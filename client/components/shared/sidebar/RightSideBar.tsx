"use client";
import React from "react";
import { useCurrentUser } from "@/hooks/user";
import GoogleLoginButton from "../../../utils/GoogleLoginButton";
import Image from "next/image";
import Link from "next/link";

const RightSideBar = () => {
  const { user } = useCurrentUser();

  return (
    <>
      <div className="pl-5">
        {user && user.id ? (
          <>
            {user.recommendedUsers && user.recommendedUsers.length > 0 && (
              <div className="px-4 py-2 bg-slate-800 rounded-lg mt-2">
                <h1 className="my-2 text-2xl">Users you may know?</h1>

                {user.recommendedUsers &&
                  user.recommendedUsers.length > 0 &&
                  user.recommendedUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 mt-5">
                      {u.profileImageUrl && (
                        <Image
                          src={u.profileImageUrl as string}
                          alt="Profile"
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                      )}
                      <div className="flex flex-col gap-2">
                        <h2>
                          {u.firstName} {u.lastName}
                        </h2>
                        <Link
                          href={u.id}
                          className="bg-white text-black text-sm px-4 py-1 rounded-lg w-fit"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        ) : (
          <GoogleLoginButton />
        )}
      </div>
    </>
  );
};

export default RightSideBar;
