"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <div className="inline-flex items-center justify-between w-full py-2 px-6 text-sm">
          <p className="float-left">SendBird Test App</p>
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
