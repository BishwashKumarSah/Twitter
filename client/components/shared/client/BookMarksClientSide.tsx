"use client";
import { useGetAllBookMarkedTweets } from "@/hooks/bookMartTweets";
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
    return <div>Loading...</div>;
  }

  if (isError) {
    console.log("BookmarkError", error.message);
    return toast.error(error.message);
  }

  console.log(
    "BOOKMarkedTweets",
    bookMarkedTweets?.map((tweets) => console.log(tweets.tweet))
  );

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
          {bookMarkedTweets?.map((tweets) => (
            <FeedCard data={tweets.tweet as Tweet} key={tweets.tweetId} />
          ))}
        </div>
      </>
    )
  );
};

export default BookMarksClientSide;
