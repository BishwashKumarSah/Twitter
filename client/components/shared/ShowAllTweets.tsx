"use client"
import { useGetAllTweets } from "@/hooks/AllTweets";
import FeedCard from "./feedcard/FeedCard";
import { Tweet } from "@/gql/graphql";
import toast from "react-hot-toast";

const AllTweets: React.FC = () => {
 const {isLoading,isError,isFetched,allTweets} = useGetAllTweets()
  if (isLoading)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  if (isError) {
   
    return toast.error("Something Went Wrong!!!");
  }
  return (
    <>
      {isFetched && allTweets &&
        allTweets.map((tweet) => (
          <div key={tweet?.id}>
            <FeedCard data={tweet as Tweet} />
          </div>
        ))}
    </>
  );
};

export default AllTweets;