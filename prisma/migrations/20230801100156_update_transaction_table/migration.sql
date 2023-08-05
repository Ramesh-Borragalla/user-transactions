/*
  Warnings:

  - You are about to drop the column `amount_refunded` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `entity` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `refund_status` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `from_user_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_user_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `amount` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_user_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount_refunded",
DROP COLUMN "currency",
DROP COLUMN "entity",
DROP COLUMN "method",
DROP COLUMN "order_id",
DROP COLUMN "refund_status",
DROP COLUMN "signature",
DROP COLUMN "user_id",
ADD COLUMN     "from_user_id" INTEGER NOT NULL,
ADD COLUMN     "to_user_id" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
