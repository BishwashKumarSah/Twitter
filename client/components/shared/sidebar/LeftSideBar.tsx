"use client";
import React from "react";
import { BsTwitter } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { SlBell } from "react-icons/sl";
import { FaRegEnvelope, FaRegBookmark, FaRegUser } from "react-icons/fa";
import UserProfile from "../UserProfile";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/user";
import { usePathname } from "next/navigation";

interface TwitterLeftSideBarButton {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const LeftSideBar = () => {
  const { user } = useCurrentUser();
  const pathName = usePathname();

  const leftSideBarMenuItems: TwitterLeftSideBarButton[] = [
    { title: "Home", icon: <GoHome />, href: "/" },
    { title: "Explore", icon: <HiMagnifyingGlass />, href: "/explore" },
    { title: "Notifications", icon: <SlBell />, href: "/notification" },
    { title: "Messages", icon: <FaRegEnvelope />, href: "/messages" },
    { title: "Bookmarks", icon: <FaRegBookmark />, href: "/bookmarks" },
    {
      title: "Profile",
      icon: <FaRegUser />,
      href: user?.id ? `/${user.id}` : "/",
    },
  ];
  return (
    <div className="flex flex-col max-custom:items-end items-start py-4 min-h-full justify-between">
      <div>
        <div className="text-3xl hover:bg-slate-800 w-fit h-fit p-3 rounded-full transition-all cursor-pointer">
          <BsTwitter />
        </div>
        <ul className="mt-4">
          {leftSideBarMenuItems.map((item) => {
            let isActive = pathName === item.href
            if(item.title === "Profile" && pathName === '/'){
              isActive = false
            }
            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-5 mt-4 hover:bg-slate-800 w-full md:w-fit h-fit px-4 py-3 rounded-full transition-all cursor-pointer ${isActive ? 'bg-slate-800' : ''}`}
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
        <div className=" w-fit mt-4">
          <button className="bg-[#1d9bf0] rounded-full py-2 md:py-3 px-6 md:px-12 font-semibold text-lg max-custom:hidden block">
            Post
          </button>
          <button className="bg-[#1d9bf0] rounded-full p-2 font-semibold text-xl max-custom:block hidden border ml-2">
            <BsTwitter />
          </button>
        </div>
      </div>

      <UserProfile />
    </div>
  );
};

export default LeftSideBar;
