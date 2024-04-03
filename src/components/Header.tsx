"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from 'next/image'

const Header = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <div className="inline-flex items-center justify-between w-full px-6 text-sm fixed top-0 z-20 bg-black">
          <p className="float-left flex items-center"><Image src="/sendbird.png" width={40} height={40} alt="Picture of the author" /> SendBird Test App</p>
          <p>
            Hello {session.user?.name} |{" "}
            <button onClick={() => signOut()}>Sign out</button>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <p>Not Signed In</p>
    </>
  );
};

export default Header;
