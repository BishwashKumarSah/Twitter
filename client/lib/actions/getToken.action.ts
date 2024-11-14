"use server"

import {cookies}  from "next/headers"

export const getCookies = async() => {
    const cookieStore = cookies()
    const cookie = cookieStore.get("__twitter_token")?.value || ""
    return cookie
}

export async function createCampaignCookie(data: string) {
    const cookieStore = cookies(); // Get the cookie store
    // Set the cookie with the specified options
    cookieStore.set("__twitter_token", data, {
      httpOnly: true, // Set to true for security
      secure: true,   // Only sent over HTTPS
      path: '/',   // Set the cookie path
    });
}