-- CreateTable
CREATE TABLE "UserChannel" (
    "id" SERIAL NOT NULL,
    "channel_name" VARCHAR(100),
    "url" TEXT,
    "chatmate" VARCHAR(100),
    "total_messages" INTEGER DEFAULT 0,
    "deleted" BOOLEAN DEFAULT false,
    "creator" TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT,
    "nickname" VARCHAR(50),
    "user_profile" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
