import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import SessionProvider from "@/context/SessionProvider";

import "./globals.css";
import { authOptions } from "./lib/authOptions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sendbird Messaging App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          <SessionProvider session={session}>{children}</SessionProvider>
        </>
      </body>
    </html>
  );
}
