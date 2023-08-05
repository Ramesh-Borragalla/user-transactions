-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER');

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "user_type" "UserType" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
