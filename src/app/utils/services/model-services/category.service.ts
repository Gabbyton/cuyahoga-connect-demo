import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { Category } from '../../data/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories: readonly Category[] = [];
  constructor(private firestore: AngularFirestore) { }

  prefetch(): Observable<boolean> {
    return this.firestore.collection<Category>('categories').valueChanges().pipe(
      first(),
      tap(data => {
        this.categories = data;
      }),
      map(_ => true),
      catchError(_ => of(false)),
    );
  }

}
