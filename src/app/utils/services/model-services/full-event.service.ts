import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { concatMap, first } from 'rxjs/operators';
import { FullEvent } from '../../data/models/full-event.model';
import { StorageUtilsService } from '../web-services/storage-utils.service';

@Injectable({
  providedIn: 'root'
})
export class FullEventService {

  constructor(
    private firestore: AngularFirestore,
    private storageUtils: StorageUtilsService,
  ) { }

  getEvent(eventId: string): Observable<FullEvent | undefined> {
    return this.firestore.collection<FullEvent>('events')
      .doc(eventId)
      .valueChanges().pipe(
        first(),
        concatMap(event => {
          if (event != null && event != undefined) {
            return this.storageUtils.getDownloadURL(event.imageURL).pipe(
              concatMap(url => {
                let updatedEvent: FullEvent = Object.assign({}, event);
                updatedEvent.imageURL = url;
                return of(updatedEvent);
              }),
            )
          }
          return of(event);
        })
      );
  }
}
