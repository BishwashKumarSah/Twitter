"use client";
import { useGetAllTweets } from "@/hooks/AllTweets";
import FeedCard from "./feedcard/FeedCard";
import { Tweet } from "@/gql/graphql";
import toast from "react-hot-toast";

const AllTweets: React.FC = () => {
  const { isLoading, isError, isFetched, allTweets } = useGetAllTweets();
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-b-4 border-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  if (isError) {
    return toast.error("Something Went Wrong!!!");
  }
  return (
    <>
      {isFetched &&
        allTweets &&
        allTweets.map((tweet) => (
          <div key={tweet?.id}>
            <FeedCard data={tweet as Tweet} />
          </div>
        ))}
    </>
  );
};

export default AllTweets;
