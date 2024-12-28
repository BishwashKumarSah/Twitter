"use client";

import { createGraphQLClient } from "@/clients/api";
import { verifyUserGoogleLoginToken } from "@/graphql/query/user";
import { createCampaignCookie } from "@/lib/actions/getToken.action";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import toast from "react-hot-toast";

const GoogleLoginButton: React.FC = () => {
  const queryClient = useQueryClient();
  const graphQLClient = createGraphQLClient("");
  const handleGoogleLogin = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;

      if (!googleToken) return toast.error("Google Token Not Found!");

      try {
        const { verifyGoogleToken } = await graphQLClient.request(
          verifyUserGoogleLoginToken,
          { token: googleToken }
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

  return (
    <div className="p-5 rounded-lg w-fit bg-slate-900">
      <h1 className="mb-2 text-2xl">New to Twitter?</h1>

      <GoogleLogin onSuccess={(cred) => handleGoogleLogin(cred)} />
    </div>
  );
};

export default GoogleLoginButton;
