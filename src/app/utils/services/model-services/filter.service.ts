import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { Filter } from '../../data/models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filters: readonly Filter[] = [];
  constructor(private firestore: AngularFirestore) { }

  prefetch(): Observable<boolean> {
    return this.firestore.collection<Filter>('filters').valueChanges().pipe(
      first(),
      tap(data => {
        this.filters = data;
      }),
      map(_ => true),
      catchError(_ => of(false)),
    );
  }

  getFilter(filterShortName: string): Filter {
    return this.filters.filter(filter => filter.shortName == filterShortName)[0];
  }
}
