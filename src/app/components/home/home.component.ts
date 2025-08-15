import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { BookService } from '../../services/book-service';
import { Book } from '../../types/interfaces/book';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly #http = inject(BookService);
  readonly #fb = inject(FormBuilder);
  readonly #route = inject(Router);
  readonly #destroyRef = inject(DestroyRef);

  books = signal<Book[]>([]);
  author: string = '';
  title: string = '';
  description: string = '';
  search: string = '';

  bookForm = this.#fb.group({
    author: [],
    title: [],
    description: [],
  });

  searchForm = new FormControl('');

  ngOnInit(): void {
    this.#http
      .getBook()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((list) => {
        this.books.set(list);
      });

    this.subscribeForm('author');
    this.subscribeForm('title');
    this.subscribeForm('description');
  }
  subscribeForm(controlName: 'author' | 'title' | 'description') {
    this.bookForm
      .get(controlName)
      ?.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value: string | null) => {
        if (value !== null) {
          (this as any)[controlName] = value;
        }
      });
  }

  setBook(id: string): void {
    this.#route.navigate(['/about', id]);
  }

  addBook() {
    if (!this.title && !this.author && !this.description) return;

    const newBook: Book = {
      author: this.author,
      title: this.title,
      description: this.description,
    };

    this.postBook(newBook);
  }

  findBook() {
    const searchBook = this.searchForm.value;
    if (!searchBook) return;

    const foundBook = this.#http.findBook(searchBook);
    if (foundBook?.title) {
      this.navigate(foundBook.title);
    }
  }

  navigate(title: string) {
    this.#route.navigate(['/about', title]);
  }

  postBook(book: Book) {
    console.log('postBook', book);
    this.#http
      .postBook(book)
      .pipe(
        tap(() => {
          this.bookForm.reset;
          this.author = '';
          this.title = '';
          this.description = '';
        })
      )
      .subscribe();
  }
}
