"use server";

import { prisma } from "./db";

export const save_channel = async (params: any) => {
  const channels = await prisma.userChannel.create({
    data: params,
  });
  return channels;
};

export const updateUserChannel = async (param: string) => {
  const updateChannel = await prisma.userChannel.update({
    where: {
      url: param,
    },
    data: {
      deleted: true,
    },
  });
  return true
};

export const getAllChannels = async () => {
  const allChannels = await prisma.userChannel.findMany({
    where: {
      deleted: false
    }
  })

  return allChannels
}
