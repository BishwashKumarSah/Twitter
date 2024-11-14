"use client";
import React, { useCallback, useState } from "react";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { FaRegImage } from "react-icons/fa6";
import { useCreateNewTweet } from "@/hooks/AllTweets";
import toast from "react-hot-toast";
import { createGraphQLClient } from "@/clients/api";
import { useCookie } from "@/utils/CookieProvider";
import { getPreSignedUrl } from "@/graphql/query/tweet";
import axios from "axios";

const CreateTweet: React.FC = () => {
  const { user } = useCurrentUser();

  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string[]>([]);

  const { mutateAsync } = useCreateNewTweet();

  const handleFileUpload = useCallback(
    (input: HTMLInputElement) => {
      return async (event: Event) => {
        event.preventDefault();
        // const imageName =
        if (input.files && input.files?.length > 5) {
          return toast.error("Total Number of Images can not be more than 5");
        }

        if (input.files && input.files.length > 0) {
          for (let file = 0; file < input.files.length; file++) {
            const getSignedUrl = await graphQLClient.request(getPreSignedUrl, {
              imageName: input.files[file].name,
              imageType: input.files[file].type,
            });

            if (getSignedUrl) {
              await axios.put(
                getSignedUrl.getAWSPreSignedUrl,
                input.files[file]
              );
            }

            const url = new URL(getSignedUrl.getAWSPreSignedUrl);
            const getImageUrl = `${url.origin}${url.pathname}`;
            // console.log("imageUrl", getImageUrl);
            setImageUrl((prev) => [...prev, getImageUrl]);
            // console.log("getSignedUrl", getSignedUrl);
            // console.log("data", data);
          }
        }
      };
    },
    [graphQLClient]
  );

  const handleSelectImages = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", "true");

    const handlerFunction = handleFileUpload(input);

    input.addEventListener("change", handlerFunction);
    input.click();
  }, [handleFileUpload]);

  const handleCreateTweet = useCallback(() => {
    if (content === "") {
      return toast.error("Please Enter Some Text!");
    }
    toast.loading("Posting", { id: "tweet_post" });
    mutateAsync({
      content,
      imageUrl,
    }).then(() => {
      setContent("");
      setImageUrl([]);
      toast.success("Posted Successfully!", { id: "tweet_post" });
    });
  }, [content, mutateAsync, imageUrl]);

  return (
    <div className="flex p-4  gap-3 border border-r-0 border-l-0 border-b-0 border-gray-800   cursor-pointer">
      <div>
        {user?.profileImageUrl && (
          <Image
            className="rounded-full"
            src={user.profileImageUrl}
            height={38}
            width={38}
            alt="Profile Image"
          />
        )}
      </div>
      <div className="w-full">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          name="tweet"
          id="tweet"
          className="w-full bg-transparent text-lg focus:outline-0 min-h-[5rem] border-b border-slate-800"
          rows={4}
          placeholder="What's happening?"
        ></textarea>
        {imageUrl && (
          <div className="flex gap-5">
            {imageUrl.map(
              (img) =>
                img && (
                  <Image
                    key={img}
                    src={img}
                    alt="tweetImages"
                    width={300}
                    height={300}
                  />
                )
            )}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <FaRegImage onClick={handleSelectImages} />
          <button
            className="bg-[#1d9bf0] rounded-full py-2 px-5 font-semibold text-[16px] disabled:bg-[#0F4E78] disabled:text-[#808080]"
            disabled={user === undefined || user === null || content === ""}
            onClick={handleCreateTweet}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTweet;
