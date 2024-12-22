"use client";
import { useGetTweetById } from "@/hooks/AllTweets";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import FeedCard from "../feedcard/FeedCard";
import { Tweet } from "@/gql/graphql";

const SingleTweetClientComponent = ({ tweetId }: { tweetId: string }) => {
  const router = useRouter();

  const { tweetData, isLoading, isError, isFetched } = useGetTweetById({
    tweetId,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return toast.error("Something Went Wrong While Fetching Comments!");
  }

  const handleBackButton = () => {
    router.back();
  };

  return (
    <>
      <nav className="w-full  flex items-center gap-6 p-3">
        <div
          className="hover:bg-slate-800 p-2  rounded-full transition-all cursor-pointer"
          onClick={handleBackButton}
        >
          <FiArrowLeft className="text-2xl " />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Post</h1>
        </div>
      </nav>
      {isFetched && tweetData && (
        <>
          <div>
            <FeedCard data={tweetData as Tweet} showComments={true} />
          </div>
        </>
      )}
    </>
  );
};

export default SingleTweetClientComponent;
