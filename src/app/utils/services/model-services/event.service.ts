import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { forkJoin, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { FullEvent } from '../../data/models/full-event.model';
import { PreviewEvent } from '../../data/models/preview-event. model';
import { User } from '../../data/models/user.model';
import { StorageUtilsService } from '../web-services/storage-utils.service';
import { FullEventService } from './full-event.service';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private fullEventService: FullEventService,
    private storageUtils: StorageUtilsService,
    private firestore: AngularFirestore,
  ) { }

  deleteEvents(previewEvent: PreviewEvent): Observable<any> {
    return this.fullEventService.getEvent(previewEvent.eventId).pipe(
      concatMap(fullEvent => {
        return this.deleteImages(fullEvent!.imageURL, previewEvent.previewImageURL).pipe(
          map(_ => fullEvent),
        );
      }),
      concatMap(fullEvent => {
        const eventId = previewEvent.eventId;
        return forkJoin([
          this.firestore.doc<FullEvent>(`events/${eventId}`).delete(),
          this.firestore.doc<PreviewEvent>(`previewEvents/${eventId}`).delete(),
        ]).pipe(
          map(_ => {
            return { email: fullEvent!.registrationEmail, eventId: eventId };
          }),
        );
      }),
      concatMap(removeData => {
        return this.firestore
          .collection( // lookup user doc from email
            'users',
            ref => ref.where('email', '==', removeData.email).limit(1)
          )
          .get().pipe(
            map(querySnapshot => {
              return { userDoc: querySnapshot.docs[0].ref, eventId: removeData.eventId }
            }),
          )
      }),
      concatMap(removeData => {
        return removeData.userDoc.update({ // update doc to remove post id in posts array
          posts: firebase.firestore.FieldValue.arrayRemove(removeData.eventId),
        });
      }),
    )
  }

  deleteImages(previousImageURL: string, previousThumbURL: string): Observable<any> {
    return forkJoin([
      this.storageUtils.deleteFileOfURL(previousImageURL),
      this.storageUtils.deleteFileofPath(previousThumbURL),
    ]);
  }
}
