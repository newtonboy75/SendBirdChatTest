import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/database/db";

const getCurrentSession = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const GET = async (req: NextRequest, res: NextRequest) => {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      {
        message: ["Unauthorized", req],
      },
      {
        status: 401,
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.email!,
    },
  });

  return NextResponse.json({
    data: user,
  });
};

export const PUT = async (req: NextRequest, res: NextRequest) => {
  const session = await getCurrentSession();
  const { email, nickname, user_profile } = await req.json();

  if (!session) {
    return NextResponse.json(
      {
        message: ["Unauthorized", req],
      },
      {
        status: 401,
      }
    );
  }

  const user = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      nickname: nickname,
      user_profile: user_profile,
    },
  });

  return NextResponse.json({
    data: user,
  });
};

export const POST = async (req: NextRequest, res: NextRequest) => {
  const session = await getCurrentSession();
  const data = await req.json();
  console.log(data);

  if (!session) {
    return NextResponse.json(
      {
        message: ["Unauthorized", req],
      },
      {
        status: 401,
      }
    );
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      nickname: data.nickname,
      deleted: false,
    },
  });

  return NextResponse.json({
    data: user,
  });
};
