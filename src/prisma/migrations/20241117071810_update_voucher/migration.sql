/*
  Warnings:

  - You are about to drop the `Leaderboard` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `status` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "transactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DELIVERED', 'FINISHED');

-- CreateEnum
CREATE TYPE "adminApproval" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_userId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "adminApproval" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "status",
ADD COLUMN     "status" "transactionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Leaderboard";

-- DropEnum
DROP TYPE "status";
