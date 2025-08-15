import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book-service';
import { Book } from '../../types/interfaces/book';

@Component({
  selector: 'app-page',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent implements OnInit {
  book = signal<Book>({ title: '', author: '', description: '' });

  readonly #store = inject(BookService);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  ngOnInit(): void {
    const idBook = this.#route.snapshot.paramMap.get('title');

    if (!idBook) {
      return;
    }

    this.#store.findBook(idBook);

    const userBook = this.#store.books.getValue()[0];
    this.book.set(userBook);
  }

  back(): void {
    this.#router.navigate(['']);
  }
}
