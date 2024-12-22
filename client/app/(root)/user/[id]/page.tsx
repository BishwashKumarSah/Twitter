import GetTweetsByUserId from "@/components/shared/server/GetTweetsByUserId";
import React from "react";

const Profile = ({ params }: { params: { id: string } }) => {
  const userId = params.id;
  // console.log("userId", userId);
  return (
    <>
    <div><p>hasasdasdasdasd</p></div>
      <GetTweetsByUserId userId={userId} />
    </>
  );
};

export default Profile;
