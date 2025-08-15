import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Book } from '../types/interfaces/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  readonly #http = inject(HttpClient);

  URL = 'http://localhost:3000/books';

  // NOTE: something about store....
  books = new BehaviorSubject<Book[]>([]);

  getBook() {
    return this.#http.get<Book[]>(this.URL).pipe(
      tap((list: Book[]) => {
        this.books.next(list);
      }),
      catchError((error) => {
        console.log('Error get books');
        return throwError(() => error);
      })
    );
  }

  postBook(book: Book) {
    return this.#http.post<Book>(this.URL, book).pipe(
      catchError((error) => {
        console.log('Error post books');
        return throwError(() => error);
      }),
      tap((newBook) => {
        const currentListBook = this.books.getValue();
        this.books.next([...currentListBook, newBook]);
      })
    );
  }

  findBook(search: string) {
    return this.books
      .getValue()
      .find((book) => book.author === search || book.title === search);
  }
}
