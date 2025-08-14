import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book-service';
import { Book } from '../../types/interfaces/book';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-page',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent implements OnInit {
  book = signal<Book>({ id: '', title: '', author: '', description: '' });
  idBook: string | null = '';

  readonly #store = inject(BookService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  ngOnInit(): void {
    this.idBook = this.#route.snapshot.paramMap.get('id');

    this.#store.store
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((list) => {
        const result = list.find((info) => info.id === this.idBook);
        if (result) {
          this.book.set(result);
        }
      });
  }

  back() {
    this.#router.navigate(['']);
  }
}
