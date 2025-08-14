import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import * as uuid from 'uuid';
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
  books = signal<Book[]>([]);
  author: string = '';
  title: string = '';
  description: string = '';
  search: string = '';

  readonly #http = inject(BookService);
  readonly #fb = inject(FormBuilder);
  readonly #route = inject(Router);
  readonly #DestroyRef = inject(DestroyRef);

  // books: Observable<Book[]> = this.#http.getBook();

  bookForm = this.#fb.group({
    author: [],
    title: [],
    description: [],
  });

  searchForm = new FormControl('');

  ngOnInit(): void {
    this.#http
      .getBook()
      .pipe(takeUntilDestroyed(this.#DestroyRef))
      .subscribe((list) => {
        this.books.set(list);
      });

    this.bookForm
      .get('author')
      ?.valueChanges.pipe(takeUntilDestroyed(this.#DestroyRef))
      .subscribe((author) => {
        if (author) {
          this.author = author;
        }
      });

    this.bookForm
      .get('title')
      ?.valueChanges.pipe(takeUntilDestroyed(this.#DestroyRef))
      .subscribe((title) => {
        if (title) {
          this.author = title;
        }
      });

    this.bookForm
      .get('description')
      ?.valueChanges.pipe(takeUntilDestroyed(this.#DestroyRef))
      .subscribe((description) => {
        if (description) {
          this.author = description;
        }
      });
  }

  setBook(id: string): void {
    this.#route.navigate(['/about', id]);
  }

  addBook() {
    if (!this.title && !this.author && !this.description) return;

    const newBook = {
      id: uuid.v4(),
      author: this.author,
      title: this.title,
      description: this.description,
    };

    this.books.update((oldValue) => [...oldValue, newBook]);
  }

  find() {
    const searchValue = this.searchForm.value;

    const findBook = this.books().find(
      (book) => book.author === searchValue || book.title === searchValue
    );

    if (findBook?.id) {
      this.navigate(findBook.id);
    }
  }

  navigate(id: string) {
    this.#route.navigate(['/about', id]);
  }
}
