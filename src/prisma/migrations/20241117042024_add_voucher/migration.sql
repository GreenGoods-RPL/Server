/*
  Warnings:

  - You are about to drop the column `discount` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the `_UserVouchers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserVouchers" DROP CONSTRAINT "_UserVouchers_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserVouchers" DROP CONSTRAINT "_UserVouchers_B_fkey";

-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "discount",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isRedeemed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_UserVouchers";

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
