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
        message: ["Unauthorized"],
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
  const {channel_url} = await req.json();

  if (!session) {
    return NextResponse.json(
      {
        message: ["Unauthorized"],
      },
      {
        status: 401,
      }
    );
  }

  const updateChannel = await prisma.userChannel.update({
    where: {
      url: channel_url,
    },
    data: {
      deleted: true,
    },
  });


  return NextResponse.json({
    data: updateChannel,
  });
};

export const POST = async (req: NextRequest, res: NextRequest) => {
  const session = await getCurrentSession();
  const data = await req.json();

  if (!session) {
    return NextResponse.json(
      {
        message: ["Unauthorized"],
      },
      {
        status: 401,
      }
    );
  }

  const channel = await prisma.userChannel.create({
    data: data,
  });


  return NextResponse.json({
    data: channel,
  });
};
