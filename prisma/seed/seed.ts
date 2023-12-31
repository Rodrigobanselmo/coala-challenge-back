import { GoogleBooksResponseDto } from './../../src/modules/books/interfaces/google-books-response.types';
// npx prisma migrate dev --name init
// npx prisma studio
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function main() {
  const books = readFileSync('prisma/seed/json/books.json', 'utf8');
  const booksJson = JSON.parse(books) as GoogleBooksResponseDto;

  const user = await prisma.user.create({
    data: {
      id: 'y3qfSuVPXxvrEqnBjAs33',
      email: 'rodrigobanselmo@gmail.com',
      name: 'Rodrigo Banselmo',
      photoUrl:
        'https://lh3.googleusercontent.com/a-/AFdZucouIGn-Xy2T2QndjbIZxKUpTGrDIJL0gbBnsnPX=s96-c',
    },
  });

  await Promise.all(
    booksJson.items.map(async (book) => {
      const bookCreated = await prisma.book.create({
        data: {
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors,
          categories: book.volumeInfo.categories,
          googleId: book.id,
          pageCount: book.volumeInfo.pageCount,
          language: book.volumeInfo.language,
          smallThumbnail: book.volumeInfo.imageLinks?.smallThumbnail,
          thumbnail: book.volumeInfo.imageLinks?.thumbnail,
        },
      });

      await prisma.usersBooks.create({
        data: {
          bookId: bookCreated.id,
          userId: user.id,
        },
      });
    }),
  );
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
