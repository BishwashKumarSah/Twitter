"use client";
import React, { useCallback } from "react";
import { BsTwitter } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { HiMagnifyingGlass } from "react-icons/hi2";

import { FaRegBookmark, FaRegUser } from "react-icons/fa";
import UserProfile from "../UserProfile";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/user";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { createGraphQLClient } from "@/clients/api";
import { verifyUserGoogleLoginToken } from "@/graphql/query/user";
import { createCampaignCookie } from "@/lib/actions/getToken.action";
import { FaGoogle } from "react-icons/fa6";
interface TwitterLeftSideBarButton {
  title: string;
  icon: React.ReactNode;
  href: string;
  restricted?: boolean;
}

const LeftSideBar = () => {
  const { user } = useCurrentUser();
  const pathName = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const graphQLClient = createGraphQLClient("");
  const leftSideBarMenuItems: TwitterLeftSideBarButton[] = [
    { title: "Home", icon: <GoHome />, href: "/" },
    { title: "Explore", icon: <HiMagnifyingGlass />, href: "/explore" },

    {
      title: "Bookmarks",
      icon: <FaRegBookmark />,
      href: `/bookmarks/${user ? user.id : ""}`,
      restricted: true,
    },
    {
      title: "Profile",
      icon: <FaRegUser />,
      href: user?.id ? `/user/${user.id}` : "",
      restricted: true,
    },
  ];

  const handleRestrictedClick = (
    event: React.MouseEvent,
    itemTitle: string
  ) => {
    if (!user) {
      event.preventDefault(); // Prevent navigation
      toast.error(`Please log in to view ${itemTitle}`);
      router.push("/"); // Optionally redirect to the homepage or login page
    }
  };

  const handleGoogleLogin = useCallback(
    async (cred: TokenResponse) => {
      const googleToken = cred.access_token;

      if (!googleToken) return toast.error("Google Token Not Found!");

      try {
        const { verifyGoogleToken } = await graphQLClient.request(
          verifyUserGoogleLoginToken,
          { token: googleToken, type: "access_token" }
        );
        if (verifyGoogleToken) {
          toast.success("Verification Successful");
        }
        const token = verifyGoogleToken || "";
        await createCampaignCookie(token);
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong While Verifying Google Login!");
      }
      // console.log("googleToken",token);

      // if (verifyGoogleToken) {
      //   window.localStorage.setItem("__twitter_token", verifyGoogleToken);
      // }

      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      // console.log({ verifyGoogleToken });
    },
    [graphQLClient, queryClient]
  );
  const login = useGoogleLogin({
    onSuccess: (cred) => handleGoogleLogin(cred),
  });

  return (
    <div className="flex flex-col max-custom:items-end items-start py-4 min-h-full justify-between">
      <div>
        <div className="text-3xl hover:bg-slate-800 w-fit h-fit p-3 rounded-full transition-all cursor-pointer">
          <BsTwitter />
        </div>
        <ul className="mt-4">
          {leftSideBarMenuItems.map((item) => {
            const isActive = pathName === item.href;

            // If user is not logged in and the item is restricted, show a toast on click
            const handleClick = (event: React.MouseEvent) => {
              if (item.restricted) {
                handleRestrictedClick(event, item.title);
              }
            };

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  onClick={handleClick} // Attach the click handler
                  className={`flex items-center gap-5 mt-4 hover:bg-slate-800 w-full md:w-fit h-fit px-4 py-3 rounded-full transition-all cursor-pointer ${
                    isActive ? "bg-slate-800" : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="max-custom:hidden block font-medium text-lg">
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="w-fit mt-4">
          <button className="bg-[#1d9bf0] rounded-full py-2 md:py-3 px-6 md:px-12 font-semibold text-lg max-custom:hidden block">
            Post
          </button>
          <button
            className=" rounded-full max-custom:block hidden border ml-2 w-10 h-10  items-center justify-center"
            onClick={() => login()}
          >
            <div className="flex items-center justify-center w-full bg-white h-full rounded-full">
              <FaGoogle fontSize={20} color="black"/>
            </div>
          </button>
        </div>
      </div>
      <UserProfile />
    </div>
  );
};

export default LeftSideBar;
