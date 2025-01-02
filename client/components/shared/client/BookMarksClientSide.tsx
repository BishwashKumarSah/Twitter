"use client";
import { useGetAllBookMarkedTweets } from "@/hooks/BookMartTweets";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import FeedCard from "../feedcard/FeedCard";
import { Tweet } from "@/gql/graphql";

const BookMarksClientSide = () => {
  const router = useRouter();
  const { id } = useParams();
  const userId = typeof id === "string" ? id : "";
  const { bookMarkedTweets, isLoading, error, isError, isFetched } =
    useGetAllBookMarkedTweets({
      userId: userId,
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-b-4 border-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return toast.error(error.message);
  }

  const handleBackButton = () => {
    router.back();
  };

  return (
    isFetched &&
    bookMarkedTweets && (
      <>
        <nav className="w-full  flex items-center gap-6 p-3">
          <div
            className="hover:bg-slate-800 p-2  rounded-full transition-all cursor-pointer"
            onClick={handleBackButton}
          >
            <FiArrowLeft className="text-2xl " />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">BookMarks</h1>
          </div>
        </nav>
        <div>
          {bookMarkedTweets && bookMarkedTweets.length > 0 ? (
            <>
              {bookMarkedTweets?.map((tweets) => (
                <FeedCard data={tweets.tweet as Tweet} key={tweets.tweetId} />
              ))}
            </>
          ) : (
            <div className="flex justify-center">
              <p>No BookMarks Yet!</p>
            </div>
          )}
        </div>
      </>
    )
  );
};

export default BookMarksClientSide;
