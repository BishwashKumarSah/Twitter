"use client";

import FeedCard from "@/components/shared/feedcard/FeedCard";
import { Tweet } from "@/gql/graphql";
import { useGetAllTweetsByUserId } from "@/hooks/AllTweets";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import React from "react";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

const Profile = () => {
  
  const router = useRouter()
  const { id } = useParams();
  const userId = typeof id === "string" ? id : "";

  const {
    userInfo: userData,
    allTweetsData: tweetData,
    isFetched,
    isLoading,
    isError,
  } = useGetAllTweetsByUserId(userId);

  if (isLoading) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }

  if (isError) {
    return toast.error("Something went wrong while fetching profile data!!!");
  }

  const handleBackButton = () => {
    router.back()
  }

  return (
    isFetched &&
    userData && (
      <>
        <nav className="w-full  flex items-center gap-6 p-3">
          <div className="hover:bg-slate-800 p-2  rounded-full transition-all cursor-pointer" onClick={handleBackButton}>
            <FiArrowLeft className="text-2xl " />
          </div>
          <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">{`${userData.firstName} ${
                userData.lastName ?? ""
              }`}</h1>
            <p className="text-sm  text-gray-400">{`${tweetData?.length} ${tweetData?.length && tweetData?.length > 1 ? 'Tweets':'Tweet'}`}</p>
          </div>
        </nav>
        {userData && (
          <div className="mt-4 flex flex-col gap-4 border-b-0 border-gray-800  p-4">
            {userData.profileImageUrl && (
              <Image
                className="rounded-full"
                height={100}
                width={100}
                src={userData.profileImageUrl}
                alt="Profile"
              />
            )}
            <div>
              <h1 className="text-xl font-bold">{`${userData.firstName} ${
                userData.lastName ?? ""
              }`}</h1>
            </div>
          </div>
        )}
        <ul>
          {tweetData?.map((tweet) => (
            <li key={tweet?.id}>
              <FeedCard data={tweet as Tweet} />
            </li>
          ))}
        </ul>
      </>
    )
  );
};

export default Profile;
