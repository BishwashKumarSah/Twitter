import SingleTweetServerComponent from "@/components/shared/server/SingleTweetServerComponent";
import React from "react";

const TweetComponent = ({ params }: { params: { id: string } }) => {
  const tweetId = params.id;
  return (
    <>
      <SingleTweetServerComponent tweetId={tweetId} />
    </>
  );
};

export default TweetComponent;
