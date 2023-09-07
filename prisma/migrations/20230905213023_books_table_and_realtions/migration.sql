/*
  Warnings:

  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('DONE', 'PENDING', 'CANCELED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT,
    "smallThumbnail" TEXT,
    "thumbnail" TEXT,
    "categories" TEXT[],
    "authors" TEXT[],
    "pageCount" INTEGER,
    "googleId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersBooks" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UsersBooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInterests" (
    "id" SERIAL NOT NULL,
    "targetUserId" INTEGER NOT NULL,
    "interestBookId" INTEGER NOT NULL,
    "interetUserId" INTEGER NOT NULL,
    "offerBookId" INTEGER NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UsersInterests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_title_key" ON "Book"("title");

-- CreateIndex
CREATE INDEX "Book_googleId_idx" ON "Book"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "UsersBooks_bookId_userId_key" ON "UsersBooks"("bookId", "userId");

-- CreateIndex
CREATE INDEX "User_googleExternalId_idx" ON "User"("googleExternalId");

-- AddForeignKey
ALTER TABLE "UsersBooks" ADD CONSTRAINT "UsersBooks_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBooks" ADD CONSTRAINT "UsersBooks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInterests" ADD CONSTRAINT "UsersInterests_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInterests" ADD CONSTRAINT "UsersInterests_interestBookId_fkey" FOREIGN KEY ("interestBookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInterests" ADD CONSTRAINT "UsersInterests_interetUserId_fkey" FOREIGN KEY ("interetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInterests" ADD CONSTRAINT "UsersInterests_offerBookId_fkey" FOREIGN KEY ("offerBookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInterests" ADD CONSTRAINT "UsersInterests_interestBookId_targetUserId_fkey" FOREIGN KEY ("interestBookId", "targetUserId") REFERENCES "UsersBooks"("bookId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
