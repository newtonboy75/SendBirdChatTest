import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import SessionProvider from "@/context/SessionProvider";
import { authProviders } from "./api/auth/[...nextauth]/route";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sendbird Messaging App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authProviders);

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
