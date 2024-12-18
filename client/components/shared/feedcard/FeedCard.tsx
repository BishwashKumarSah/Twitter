import React from "react";
import Image from "next/image";
import { BiMessageRounded } from "react-icons/bi";
import { AiOutlineRetweet } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { GoHeartFill } from "react-icons/go";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";
import { useLikeTweets } from "@/hooks/AllTweets";
import toast from "react-hot-toast";
import { ClientError } from "graphql-request";
import { useCurrentUser } from "@/hooks/user";
import { useCreateBookMarkedTweets } from "@/hooks/BookMartTweets";


interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = ({ data }) => {
  const { user } = useCurrentUser();
  const { mutateAsync } = useLikeTweets({ userId: user ? user?.id : "" });
  const { mutateAsync: BookMarkTweet } = useCreateBookMarkedTweets();

  const handleBookmarkTweet = async (tweetId: string) => {
    try {
      // toast.loading("Saving...", { id: `BookMark:${tweetId}` });
      await BookMarkTweet({ tweetId }).then(() => {
        toast.success("Post Saved Successfully!", {
          id: `BookMark:${tweetId}`,
        });
      });
    } catch (error) {
      if (error instanceof ClientError) {
        toast.error(error.message);
      }
      console.log("Error while Bookmarking!", error);
    }
  };

  const handleLike = async (tweetId: string) => {
    try {
      // Optimistic UI Update

      // Call mutation
      await mutateAsync({ tweetId });
    } catch (error) {
      // Show error toast
      if (error instanceof ClientError) {
        // console.log("ERRORLIEKS", error.response.errors?.[0]?.message);
        toast.error(
          error.response.errors?.[0]?.message || "Something went wrong!"
        );
      } else {
        console.error("Unknown error:", error);
        toast.error("An unknown error occurred!");
      }
    }
  };

  return (
    <div className="flex p-4 gap-3 border border-r-0 border-l-0 border-b-0 border-gray-800 hover:bg-gray-950 cursor-pointer">
      <div>
        {data.author?.profileImageUrl && (
          <Image
            className="rounded-full"
            src={data.author?.profileImageUrl}
            height={38}
            width={38}
            alt="Profile Image"
          />
        )}
      </div>
      <div className="w-full">
        <Link href={`${data.author.id}`}>
          <h5>{`${data.author?.firstName} ${data.author?.lastName || ""}`}</h5>
        </Link>
        <p className="mt-2">{data.content}</p>
        {data.imageUrl &&
          data.imageUrl.map(
            (img) =>
              img && (
                <div key={img} className="w-full">
                  <Image
                    src={img}
                    alt="tweet-images"
                    height={0}
                    layout="responsive"
                    width={100}
                    style={{
                      height: "auto",
                      maxHeight: "400px",
                    }}
                  />
                </div>
              )
          )}
        <div className="flex justify-between items-center max-w-[80%] mt-4 text-[22px]">
          <div>
            <BiMessageRounded />
          </div>
          <div onClick={() => handleBookmarkTweet(data.id)}>
            <AiOutlineRetweet />
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <div onClick={() => handleLike(data.id)} className="cursor-pointer">
              {data.isLikedByUser ? <GoHeartFill color="red" /> : <FiHeart />}
            </div>
            <span className="text-sm">{data.likesCount}</span>
          </div>
          <div>
            <LuUpload />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
