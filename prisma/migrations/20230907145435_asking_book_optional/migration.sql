-- DropForeignKey
ALTER TABLE "UsersBookExchange" DROP CONSTRAINT "UsersBookExchange_askingBookId_fkey";

-- AlterTable
ALTER TABLE "UsersBookExchange" ALTER COLUMN "askingBookId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UsersBookExchange" ADD CONSTRAINT "UsersBookExchange_askingBookId_fkey" FOREIGN KEY ("askingBookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
