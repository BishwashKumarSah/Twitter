import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";

import "./globals.css";
import Providers from "@/utils/ReactQueryProvider";
import { CookieProvider } from "@/utils/CookieProvider";
import { cookies } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = cookies().get("__twitter_token")?.value || "";
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <Providers>
          <GoogleOAuthProvider clientId="556937168454-0dadt1qlcasgd37pp3gr8amkmm6qh42e.apps.googleusercontent.com">
            <CookieProvider cookie={cookie}>{children}</CookieProvider>
            <Toaster />
          </GoogleOAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
