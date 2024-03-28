/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `UserChannel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserChannel" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "UserChannel_url_key" ON "UserChannel"("url");
