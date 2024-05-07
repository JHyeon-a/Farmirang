import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./Navbar";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body>
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=e6c6edef784b515a21fcf7f03cea6190&autoload=false`}
        />
        <div className="flex flex-col h-full">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
