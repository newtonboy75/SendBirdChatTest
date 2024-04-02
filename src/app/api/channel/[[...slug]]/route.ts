import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/database/db";

const getCurrentSession = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const PUT = async (req: NextRequest, res: NextRequest) => {
  const session = await getCurrentSession();
  const data = await req.json();
  console.log('start this')
  console.log(data);
  console.log('end this')

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
      url: data.url,
    },
    data: data,
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
