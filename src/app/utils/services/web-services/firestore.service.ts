import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { FullEvent } from '../../data/models/full-event.model';
import { PreviewEvent } from '../../data/models/preview-event. model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private items: Observable<any>;
  month$ = new BehaviorSubject<number>(5);

  constructor(firestore: AngularFirestore) {
    this.items = this.month$.pipe(
      switchMap(inputMonth =>
        firestore
          .collection<PreviewEvent>('previewEvents', ref =>
            ref.where('dateStartMonth', '==', inputMonth)).valueChanges().pipe(
              map(allData => {
                return allData.map(data => data.name)
              })
            ))
    );
  }

  get itemsObs() {
    return this.items;
  }
}

