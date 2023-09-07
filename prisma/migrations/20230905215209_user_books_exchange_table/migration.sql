/*
  Warnings:

  - You are about to drop the `UsersInterests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersInterests" DROP CONSTRAINT "UsersInterests_interestBookId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInterests" DROP CONSTRAINT "UsersInterests_interestBookId_targetUserId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInterests" DROP CONSTRAINT "UsersInterests_interetUserId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInterests" DROP CONSTRAINT "UsersInterests_offerBookId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInterests" DROP CONSTRAINT "UsersInterests_targetUserId_fkey";

-- DropTable
DROP TABLE "UsersInterests";

-- CreateTable
CREATE TABLE "UsersBookExchange" (
    "id" SERIAL NOT NULL,
    "targetUserId" INTEGER NOT NULL,
    "interestBookId" INTEGER NOT NULL,
    "interetUserId" INTEGER NOT NULL,
    "offerBookId" INTEGER NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UsersBookExchange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsersBookExchange" ADD CONSTRAINT "UsersBookExchange_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBookExchange" ADD CONSTRAINT "UsersBookExchange_interestBookId_fkey" FOREIGN KEY ("interestBookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBookExchange" ADD CONSTRAINT "UsersBookExchange_interetUserId_fkey" FOREIGN KEY ("interetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBookExchange" ADD CONSTRAINT "UsersBookExchange_offerBookId_fkey" FOREIGN KEY ("offerBookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBookExchange" ADD CONSTRAINT "UsersBookExchange_interestBookId_targetUserId_fkey" FOREIGN KEY ("interestBookId", "targetUserId") REFERENCES "UsersBooks"("bookId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
