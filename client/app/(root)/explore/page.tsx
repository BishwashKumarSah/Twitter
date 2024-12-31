"use client";
import React, { useCallback, useState } from "react";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import { GetTweetsAndUsersQueryQuery } from "@/gql/graphql";
import Image from "next/image";
import { useCurrentUserDetailsId } from "@/hooks/user";
import { createGraphQLClient } from "@/clients/api";
import {
  handleFollowUserMutation,
  handleUnFollowUserMutation,
} from "@/graphql/mutate/user";
import { useCookie } from "@/utils/CookieProvider";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ClientError } from "graphql-request";
import FeedCard from "@/components/shared/feedcard/FeedCard";

const Explore = () => {
  const [data, setData] = useState<
    GetTweetsAndUsersQueryQuery["getTweetsAndUsersQuery"] | null
  >(null);
  const queryClient = useQueryClient();

  const { cookie } = useCookie();
  const graphQLClient = createGraphQLClient(cookie);
  const [updateQuery, setUpdatedQuery] = useState(false);

  const handleDataFetched = useCallback(
    (fetchedData: GetTweetsAndUsersQueryQuery["getTweetsAndUsersQuery"]) => {
      setData(fetchedData);
    },
    []
  );

  const { userId } = useCurrentUserDetailsId();

  const handleFollowUser = useCallback(
    async (id: string) => {
      if (!cookie || cookie === null) {
        toast.error("Please Login to Follow The User!");
        return;
      }
      try {
        await graphQLClient.request(handleFollowUserMutation, { to: id });
        await queryClient.invalidateQueries({
          queryKey: ["user-details-by-id-without-tweets", id],
        });
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
        setUpdatedQuery((prev) => !prev);
      } catch (error) {
        setUpdatedQuery((prev) => !prev);
        if (error instanceof ClientError) {
          toast.error(
            error.response.errors?.[0]?.message || "Something went wrong!"
          );
        } else {
          toast.error("Something Went Wrong!");
        }
      }
    },
    [graphQLClient, queryClient, cookie]
  );

  const handleUnFollowUser = useCallback(
    async (id: string) => {
      if (!cookie || cookie === null) {
        toast.error("Please Login to UnFollow The User!");
        return;
      }
      try {
        await graphQLClient.request(handleUnFollowUserMutation, { to: id });
        await queryClient.invalidateQueries({
          queryKey: ["user-details-by-id-without-tweets", id],
        });
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
        setUpdatedQuery((prev) => !prev);
      } catch (error) {
        setUpdatedQuery((prev) => !prev);
        if (error instanceof ClientError) {
          toast.error(
            error.response.errors?.[0]?.message || "Something went wrong!"
          );
        } else {
          toast.error("Something Went Wrong!");
        }
      }
    },
    [graphQLClient, queryClient, cookie]
  );

  return (
    <div>
      <LocalSearchBar
        placeholder="Search for users or posts"
        onDataFetched={handleDataFetched}
        query={updateQuery}
      />
      <div className="mt-5">
        {data ? (
          <>
            {data.tweet &&
            data.user &&
            data.tweet.length === 0 &&
            data.user.length === 0 ? (
              <h1 className="flex justify-center">No Tweets or Users Found!</h1>
            ) : (
              <div>
                {data.user && data.user.length > 0 && (
                  <div>
                    <h1 className="text-[22px] font-bold px-8">
                      Who to follow?
                    </h1>
                    {data.user &&
                      data.user.map((userData) => {
                        return (
                          <div
                            key={userData.id}
                            className="flex gap-2 px-8 items-center py-4"
                          >
                            <div>
                              <Image
                                className="rounded-full"
                                width={50}
                                height={50}
                                alt="User_Avatar"
                                src={userData.profileImageUrl as string}
                              />
                            </div>
                            <div className="flex  w-full justify-between">
                              <div>
                                <h1 className="text-[19px] font-semibold">
                                  {userData.firstName} {userData.lastName}
                                </h1>
                                <h3>{userData.email}</h3>
                                <h2>This is my bio</h2>
                              </div>
                              <div className="place-content-center">
                                {userData?.id !== userId && (
                                  <>
                                    {userData.follower?.some(
                                      (user) => user.id === userId
                                    ) ? (
                                      <button
                                        className="bg-white text-black px-3 py-1 rounded-full text-md "
                                        onClick={() =>
                                          handleUnFollowUser(userData.id)
                                        }
                                      >
                                        unfollow
                                      </button>
                                    ) : (
                                      <button
                                        className="bg-white text-black px-3 py-1 rounded-full text-md"
                                        onClick={() =>
                                          handleFollowUser(userData.id)
                                        }
                                      >
                                        follow
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
                {data.tweet && data.tweet.length > 0 && (
                  <div className="min-w-full ">
                    <h1 className="text-[22px] font-bold px-8">
                      Posts For You
                    </h1>
                    {data.tweet &&
                      data.tweet.map((tweetData) => {
                        return (
                          <div key={tweetData.id} className="gap-2 px-8 py-4">
                            <FeedCard data={tweetData} includeStats={false} />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center">
            <h1>Search to discover users and tweets!</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
