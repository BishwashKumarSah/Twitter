"use client";

import { createGraphQLClient } from "@/clients/api";
import FeedCard from "@/components/shared/feedcard/FeedCard";
import { Tweet } from "@/gql/graphql";
import {
  handleFollowUserMutation,
  handleUnFollowUserMutation,
} from "@/graphql/mutate/user";
import { useGetAllTweetsByUserId } from "@/hooks/AllTweets";
import {
  useCurrentUser,
  useGetUserDetailsByIdWithoutTweets,
} from "@/hooks/user";
import { useCookie } from "@/utils/CookieProvider";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import React, { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

const Profile = () => {
  const router = useRouter();
  const { id } = useParams();
  const userId = typeof id === "string" ? id : "";

  const queryClient = useQueryClient();

  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);

  const {
    userInfo: userData,
    allTweetsData: tweetData,
    isFetched,
    isLoading,
    isError,
  } = useGetAllTweetsByUserId(userId);

  const {
    user: userDataWithoutTweets,
    isLoading: userDataWithoutTweetsLoading,
    isError: userDataWithoutTweetsError,
    isFetched: userDataWithoutTweetsFetched,
  } = useGetUserDetailsByIdWithoutTweets(userId);

  const { user: currentUser } = useCurrentUser();

  const handleFollowUser = useCallback(async () => {
    if (!userId || userId === "") return;
    await graphQLClient.request(handleFollowUserMutation, { to: userId });
    await queryClient.invalidateQueries({ queryKey: ["user-details-by-id-without-tweets",id] });
    await queryClient.invalidateQueries({ queryKey: ["current-user"] });
  }, [graphQLClient, id, queryClient, userId]);

  const handleUnFollowUser = useCallback(async () => {
    if (!userId || userId === "") return;
    await graphQLClient.request(handleUnFollowUserMutation, { to: userId });
    await queryClient.invalidateQueries({ queryKey: ["user-details-by-id-without-tweets",id] });
    await queryClient.invalidateQueries({ queryKey: ["current-user"] });
  }, [graphQLClient, id, queryClient, userId]);

  const isFollowing = useMemo(() => {
    // console.log("following", currentUser?.following, currentUser?.id, userId);
    
    // console.log("sfasfasdfadf",userDataWithoutTweets?.follower,userId,currentUser?.id);
    if (!userId || userId === "") return false;
    if (
      userDataWithoutTweets?.follower &&
      userDataWithoutTweets?.follower?.length > 0 &&
      userDataWithoutTweets?.follower?.findIndex((el) => el.id === currentUser?.id) >= 0
    ) {
      return true;
    }
    return false;
  }, [currentUser?.id, userDataWithoutTweets?.follower, userId]);

  if (isLoading || userDataWithoutTweetsLoading) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }

  if (isError || userDataWithoutTweetsError) {
    return toast.error("Something went wrong while fetching profile data!!!");
  }

  const handleBackButton = () => {
    router.back();
  };

  return (
    isFetched && userDataWithoutTweetsFetched &&
    userData && userDataWithoutTweets && (
      <>
        <nav className="w-full  flex items-center gap-6 p-3">
          <div
            className="hover:bg-slate-800 p-2  rounded-full transition-all cursor-pointer"
            onClick={handleBackButton}
          >
            <FiArrowLeft className="text-2xl " />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">{`${userData.firstName} ${
              userData.lastName ?? ""
            }`}</h1>
            <p className="text-sm  text-gray-400">{`${tweetData?.length} ${
              tweetData?.length && tweetData?.length > 1 ? "Tweets" : "Tweet"
            }`}</p>
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">
                  {`${userData.firstName} ${userData.lastName ?? ""}`}
                </h1>
                <div className="text-md text-gray-400 flex gap-5 mt-2 font-bold">
                  <span>{userDataWithoutTweets?.follower?.length} followers</span>
                  <span>{userDataWithoutTweets?.following?.length} following</span>
                </div>
              </div>
              {currentUser?.id !== userId && (
                <>
                  {!isFollowing ? (
                    <button
                      className="bg-white text-black px-3 py-1 rounded-full text-md"
                      onClick={handleFollowUser}
                    >
                      follow
                    </button>
                  ) : (
                    <button
                      className="bg-white text-black px-3 py-1 rounded-full text-md"
                      onClick={handleUnFollowUser}
                    >
                      unfollow
                    </button>
                  )}
                </>
              )}
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
