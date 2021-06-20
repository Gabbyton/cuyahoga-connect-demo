import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { Category } from '../../data/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories: readonly Category[] = [];
  constructor(private firestore: AngularFirestore) { }

  prefetch() {
    this.firestore.collection<Category>('categories').valueChanges().pipe(
      first(),
    ).subscribe(data => {
      this.categories = data;
    });
  }

}
