"use client";

import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import "@sendbird/uikit-react/dist/index.css";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SendBirdWrapper from "@/context/SendBirdWrapper";
import Image from 'next/image'

const APP_ID = process.env.APP_ID!;

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const [nickname, setNickName] = useState<string>("");

  useEffect(() => {
    setTimeout(function () {
      setLoading(false);
    }, 2000);

    const checkUser = async () => {
      const existingUser = await fetch(
        "http://localhost:3000/api/user/email"
      ).then((res) => {
        return res.json();
      });

      //server action implementation
      // const existingUser = await user(session?.user?.email!);

      if (existingUser.data === null) {
        const user_data = {
          email: session?.user?.email!,
          nickname: session?.user?.name!,
          deleted: false,
        };

        try {
          const response = await fetch("http://localhost:3000/api/user/email", {
            method: "post",
            body: JSON.stringify(user_data),
          });
          const result = await response.json();

          setUserId(result.data.user_id);
          setNickName(result.data.nickname!);
        } catch (error) {
          console.error("Error:", error);
        }

        //server action implementation
        // setUserId(createUser.user_id!);
        // setNickName(createUser.nickname!);
      } else {
        setUserId(existingUser.data.user_id!);
        setNickName(existingUser.data.nickname!);
      }
    };

    if (session) {
      checkUser();
    }
  }, [session]);

  if (session) {
    return (
      <div className="App">
        <SendbirdProvider appId={APP_ID} userId={userId} nickname={nickname}>
          <Header />
          <SendBirdWrapper />
        </SendbirdProvider>
      </div>
    );
  }

  return (
    <div className="App">
      {loading ? (
        <div></div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-black gap-2 mt--10">
          <Image src="/sendbird.png" width={300} height={300} alt="Picture of the author" />
          <h1 className="text-2xl font-semibold max-w-sm text-center mt-5">
            Welcome to Sendbird Test App
          </h1>
          <button
            onClick={() => signIn("google")}
            type="button"
            className="max-w-sm mt-10 py-2 px-4 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
          >
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mr-2"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
            </svg>
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}
