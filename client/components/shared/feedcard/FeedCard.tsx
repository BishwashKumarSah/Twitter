import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BiMessageRounded } from "react-icons/bi";
import { FiHeart } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { GoBookmarkFill, GoHeartFill } from "react-icons/go";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";
import { useLikeTweets } from "@/hooks/AllTweets";
import toast from "react-hot-toast";
import { ClientError } from "graphql-request";
import { useCurrentUser } from "@/hooks/user";
import { useCreateBookMarkedTweets } from "@/hooks/BookMartTweets";
import { GoBookmark } from "react-icons/go";
import { usePostCommentByTweetId } from "@/hooks/comments";

interface FeedCardProps {
  data: Tweet;
  showComments?: boolean;
  includeStats?: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({
  data,
  showComments = false,
  includeStats = true,
}) => {
  const { user } = useCurrentUser();
  const { mutateAsync } = useLikeTweets({ userId: user ? user?.id : "" });
  const [showMessageTextBox, setShowMessageTextBox] = useState(showComments);
  const [content, setContent] = useState("");
  const [hydrationLoad, setHydrationLoad] = useState(false);

  useEffect(() => {
    setHydrationLoad(true);
  }, []);

  const { mutateAsync: TweetComments } = usePostCommentByTweetId({
    userId: user ? user?.id : "",
  });
  const { mutateAsync: BookMarkTweet } = useCreateBookMarkedTweets({
    userId: user ? user?.id : "",
  });

  const handleCopyTweetLink = () => {
    const tweetLink = `${window.location.origin}/tweet/${data.id}`; // Construct the full link
    navigator.clipboard
      .writeText(tweetLink)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy the link. Please try again.");
      });
  };

  const handleBookmarkTweet = async (tweetId: string) => {
    try {
      // Perform the bookmark/unbookmark operation
      await BookMarkTweet({ tweetId });

      // Show success toast
      const successMessage = data.hasBookMarked
        ? "Removed Post From Bookmark!"
        : "Added Post To Bookmark!";
      toast.success(successMessage, { id: tweetId });
    } catch (error) {
      const toastId = `BookMarkError:${tweetId}`;
      toast.dismiss(toastId);

      if (error instanceof ClientError) {
        toast.error(
          error.response.errors?.[0]?.message || "Something went wrong!",
          { id: toastId }
        );
      } else {
        toast.error("An unknown error occurred!", { id: toastId });
      }
    }
  };

  const handleLike = async (tweetId: string) => {
    try {
      // Optimistic UI Update
      await mutateAsync({ tweetId });
    } catch (error) {
      console.log("likeTweetError", error);
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

  const handleMessageClick = async () => {
    setShowMessageTextBox((prev) => !prev);
  };

  const handlePostComment = async (tweetId: string) => {
    try {
      if (content === "") return;
      toast.loading("Posting Comment...", { id: `Comment:${tweetId}` });
      await TweetComments({
        payload: { tweetId: tweetId, content: content },
      }).then(() => {
        setContent("");
        toast.success("Comment Posted Successfully!", {
          id: `Comment:${tweetId}`,
        });
      });
    } catch (error) {
      setContent("");
      if (error instanceof ClientError) {
        console.log({ error });
        toast.error(
          error.response.errors?.[0]?.message || "Something went wrong!",
          { id: `Comment:${tweetId}` }
        );
      } else {
        toast.error("Error while posting comment!");
      }
    }
  };

  return (
    <>
      {hydrationLoad && (
        <div className=" hover:bg-gray-950 cursor-pointer border border-slate-800 ">
          <div className="flex p-4 gap-3 border border-r-0 border-l-0 border-b-0 border-gray-800 hover:bg-gray-950 cursor-pointer  min-w-full">
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
              <Link href={`/user/${data.author.id}`}>
                <h5>{`${data.author?.firstName} ${
                  data.author?.lastName || ""
                }`}</h5>
              </Link>

              <Link href={`/tweet/${data.id}`}>
                <div className="w-full">
                  <p className="mt-2  text-wrap break-words">{data.content}</p>
                </div>
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
              </Link>
            </div>
          </div>
          <div className="max-w-[80%] text-[22px] pb-6 mx-auto ">
            {showMessageTextBox && (
              <div className="flex gap-5 items-center min-w-full">
                <textarea
                  className="w-full bg-transparent text-lg focus:outline-0 min-h-[5rem] border-b border-slate-800 pt-4 resize-none"
                  rows={2}
                  placeholder="Post your reply"
                  maxLength={70}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div>
                  <button
                    className="bg-[#1d9bf0] rounded-full py-1 px-4 w-fit font-semibold text-[16px] disabled:bg-[#0F4E78] disabled:text-[#808080] disabled:cursor-not-allowed"
                    disabled={
                      user === undefined || user === null || content === ""
                    }
                    onClick={() => handlePostComment(data.id)}
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
          {includeStats !== false && (
            <div className="flex justify-between items-center max-w-[80%] text-[22px] pb-6 mx-auto">
              <div
                className="flex flex-row justify-center items-center gap-2"
                onClick={() => handleMessageClick()}
              >
                <div>
                  <BiMessageRounded />
                </div>
                <span className="text-sm">{data.commentCount}</span>
              </div>
              <div onClick={() => handleBookmarkTweet(data.id)}>
                {data.hasBookMarked ? <GoBookmarkFill /> : <GoBookmark />}
              </div>
              <div className="flex flex-row justify-center items-center gap-2">
                <div
                  onClick={() => handleLike(data.id)}
                  className="cursor-pointer"
                >
                  {data.isLikedByUser ? (
                    <GoHeartFill color="red" />
                  ) : (
                    <FiHeart />
                  )}
                </div>
                <span className="text-sm">{data.likesCount}</span>
              </div>
              <div>
                <LuUpload onClick={handleCopyTweetLink} />
              </div>
            </div>
          )}
        </div>
      )}
      {showComments && (
        <div>
          {data.comment?.map((com) => {
            return (
              hydrationLoad && (
                <div className="flex p-4 gap-3 border border-r-0 border-l-0 border-b-0 border-gray-800 hover:bg-gray-950 cursor-pointer">
                  <div>
                    {data.author?.profileImageUrl && (
                      <Image
                        className="rounded-full"
                        src={com.user?.profileImageUrl as string}
                        height={38}
                        width={38}
                        alt="Profile Image"
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <div className="w-fit">
                      <Link href={`${com.user?.id}`}>
                        <h5>{`${com.user?.firstName} ${
                          com.user?.lastName || ""
                        }`}</h5>
                      </Link>
                    </div>
                    <p className="mt-2">{com.content}</p>
                  </div>
                </div>
              )
            );
          })}
        </div>
      )}
    </>
  );
};

export default FeedCard;
