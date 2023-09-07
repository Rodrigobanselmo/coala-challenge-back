import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SearchAllBooksDto } from '../../../dto/search-all-books.dto';
import { GoogleBooksResponseDto } from '../../../interfaces/google-books-response.types';
import { BookEntity } from '../../../entities/book.entity';

@Injectable()
export class SearchAllBooksUseCase {
  constructor(private readonly httpService: HttpService) {}

  async execute(searchBooksDto: SearchAllBooksDto): Promise<BookEntity[]> {
    const { search, limit } = searchBooksDto;
    const apiUrl = this.buildApiUrl(search, limit);

    const { data } = await firstValueFrom(
      this.httpService.get<GoogleBooksResponseDto>(apiUrl).pipe(
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );

    return data.items.map(
      (book) =>
        new BookEntity({
          authors: book.volumeInfo.authors,
          googleId: book.id,
          pageCount: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories,
          id: null,
          title: book.volumeInfo.title,
          smallThumbnail: book.volumeInfo.imageLinks?.smallThumbnail,
          thumbnail: book.volumeInfo.imageLinks?.thumbnail,
          language: book.volumeInfo.language,
        }),
    );
  }

  private buildApiUrl(search: string, limit: number) {
    return `https://www.googleapis.com/books/v1/volumes?q=${search}&key=${process.env.GCP_API_KEY}=${limit}`;
  }
}
