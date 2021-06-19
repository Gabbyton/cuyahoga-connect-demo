import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { PreviewEvent } from '../../data/models/preview-event. model';

@Injectable({
  providedIn: 'root'
})
export class PreviewEventService {
  constructor(private firestore: AngularFirestore) {
  }

  getEventsForMonth(month: number): Observable<PreviewEvent[]> {
    return this.firestore
      .collection<PreviewEvent>('previewEvents',
        ref => ref.where('dateStartMonth', '==', month)
      ).valueChanges().pipe(
        first(),
      );
  }
}
