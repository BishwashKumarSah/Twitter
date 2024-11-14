"use client";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import React from "react";

const UserProfile: React.FC = () => {
  const { user } = useCurrentUser();

  if (!user) return null;

  const fullName = user.firstName + " " + `${user.lastName !== null ? user.lastName: ''}`;

  return (
    <>
      {user && (
        <div className="flex gap-2 items-center px-3 py-2 rounded-full bg-slate-800 w-fit">
          {user && user.profileImageUrl && (
            <Image
              src={user.profileImageUrl}
              width={40}
              height={40}
              className="rounded-full"
              alt="User Profile"
            />
          )}
          <div className="max-custom:hidden">
            <h1>{fullName}</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
