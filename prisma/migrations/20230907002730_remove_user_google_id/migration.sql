/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `googleExternalId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `offerBookId` on the `UsersBookExchange` table. All the data in the column will be lost.
  - Added the required column `askingBookId` to the `UsersBookExchange` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersBookExchange" DROP CONSTRAINT "UsersBookExchange_interestBookId_targetUserId_fkey";

-- DropForeignKey
ALTER TABLE "UsersBookExchange" DROP CONSTRAINT "UsersBookExchange_interetUserId_fkey";

-- DropForeignKey
ALTER TABLE "UsersBookExchange" DROP CONSTRAINT "UsersBookExchange_offerBookId_fkey";

-- DropForeignKey
ALTER TABLE "UsersBookExchange" DROP CONSTRAINT "UsersBookExchange_targetUserId_fkey";

-- DropForeignKey
ALTER TABLE "UsersBooks" DROP CONSTRAINT "UsersBooks_userId_fkey";

-- DropIndex
DROP INDEX "Book_googleId_idx";

-- DropIndex
DROP INDEX "User_googleExternalId_idx";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "googleExternalId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UsersBookExchange" DROP COLUMN "offerBookId",
ADD COLUMN     "askingBookId" INTEGER NOT NULL,
ALTER COLUMN "targetUserId" SET DATA TYPE TEXT,
ALTER COLUMN "interetUserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UsersBooks" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "Book"("title");

-- AddForeignKey
ALTER TABLE "UsersBooks" ADD CONSTRAINT "UsersBooks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBookExchange" ADD CONSTRAINT "UsersBookExchange_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBookExchange" ADD CONSTRAINT "UsersBookExchange_interetUserId_fkey" FOREIGN KEY ("interetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBookExchange" ADD CONSTRAINT "UsersBookExchange_askingBookId_fkey" FOREIGN KEY ("askingBookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBookExchange" ADD CONSTRAINT "UsersBookExchange_interestBookId_targetUserId_fkey" FOREIGN KEY ("interestBookId", "targetUserId") REFERENCES "UsersBooks"("bookId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
