"use client";
import React, { useState } from "react";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import { GetTweetsAndUsersQueryQuery } from "@/gql/graphql";
import Image from "next/image";

const Explore = () => {
  const [data, setData] = useState<
    GetTweetsAndUsersQueryQuery["getTweetsAndUsersQuery"] | null
  >(null);

  const handleDataFetched = (
    fetchedData: GetTweetsAndUsersQueryQuery["getTweetsAndUsersQuery"]
  ) => {
    setData(fetchedData);
  };

  return (
    <div>
      <LocalSearchBar
        placeholder="Search for users or posts"
        onDataFetched={handleDataFetched}
      />
      <div className="mt-5">
        {data ? (
          <div>
            <h2 className="text-lg font-bold">Users</h2>
            {data.user && data.user.length > 0 ? (
              <ul className="list-disc ml-5">
                {data.user.map((user) => (
                  <li key={user.id} className="mb-2">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {user.firstName} {user.lastName ?? ""}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    {user.profileImageUrl && (
                      <Image
                        width={20}
                        height={20}
                        src={user.profileImageUrl}
                        alt={`${user.firstName}'s profile`}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No users found.</p>
            )}
            <h2 className="text-lg font-bold mt-5">Tweets</h2>
            {data.tweet && data.tweet.length > 0 ? (
              <ul className="list-disc ml-5">
                {data.tweet.map((tweet) => (
                  <li key={tweet.id} className="mb-2">
                    <p>{tweet.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tweets found.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">
            Start typing to search for users or posts.
          </p>
        )}
      </div>
    </div>
  );
};

export default Explore;
