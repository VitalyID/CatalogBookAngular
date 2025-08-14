import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Book } from '../types/interfaces/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  URL = 'assets/mock/books.json';

  readonly #http = inject(HttpClient);

  // NOTE: something about store....
  store = new BehaviorSubject<Book[]>([
    { id: '', title: '', author: '', description: '' },
  ]);

  getBook() {
    return this.#http.get<Book[]>(this.URL).pipe(
      tap((list) => {
        this.store.next(list);
      }),
      catchError((error) => {
        console.log('Error get books');
        return throwError(() => Error);
      })
    );
  }
}
