"use client";
import { useGetAllTweets } from "@/hooks/AllTweets";
import FeedCard from "./feedcard/FeedCard";
import { Tweet } from "@/gql/graphql";
import toast from "react-hot-toast";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const AllTweets: React.FC = () => {
  const { ref, inView } = useInView();
  const {
    isFetchingNextPage,
    hasNextPage,
    data,
    fetchNextPage,
    isLoading,
    isError,
  } = useGetAllTweets();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

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
      {data &&
        data.pages.map((group, i) => {
          return (
            <Fragment key={i}>
              {group.getAllTweets?.map((tweet) => (
                <div key={tweet?.id} className="text-wrap w-[100%]">
                  <FeedCard data={tweet as Tweet} />
                </div>
              ))}
            </Fragment>
          );
        })}
      <div ref={ref} className="h-5 w-20"></div>
      {isFetchingNextPage ? (
        <h1>Loading More...</h1>
      ) : hasNextPage ? null : (
        <h1 className="flex justify-center">No More Posts To Show</h1>
      )}
    </>
  );
};

export default AllTweets;
