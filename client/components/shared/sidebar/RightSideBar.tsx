"use client"
import { useCurrentUser } from "@/hooks/user";
// import { useCurrentUser } from "@/hooks/user";
import GoogleLoginButton from "../../../utils/GoogleLoginButton";
import React from "react";

const RightSideBar = () => {
  const { user } = useCurrentUser();
  console.log("user",user);
  return (
    <>      
        <GoogleLoginButton />     
    </>
  );
};

export default RightSideBar;
