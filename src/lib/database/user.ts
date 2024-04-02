"use server";

import { getServerSession } from "next-auth/next";
import { prisma } from "./db";

export const user = async (email: string) => {
  const data = getServerSession();
  const uemail = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return uemail;
};

export const create = async (data: any) => {
  const user = await prisma.user.create({ data });
  return user;
};

export const update = async (param: any) => {
  //console.log(param)
  const user = await prisma.user.update({
    where: {
      email: param.email,
    },
    data: {
      nickname: param.nickname,
      user_profile: param.user_profile,
    },
  });
  return user;
};
