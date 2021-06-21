import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { Filter } from '../../data/models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filters: readonly Filter[] = [];
  constructor(private firestore: AngularFirestore) { }

  prefetch() {
    this.firestore.collection<Filter>('filters').valueChanges().pipe(
      first(),
    ).subscribe(data => {
      this.filters = data;
    });
  }

  getFilter(filterShortName: string): Filter {
    return this.filters.filter(filter => filter.shortName == filterShortName)[0];
  }
}
