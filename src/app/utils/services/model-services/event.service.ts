import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { forkJoin, from, Observable, of } from 'rxjs';
import { concatMap, first, map, switchMap } from 'rxjs/operators';
import { FullEvent } from '../../data/models/full-event.model';
import { PreviewEvent } from '../../data/models/preview-event. model';
import { StorageUtilsService } from '../web-services/storage-utils.service';
import { FullEventService } from './full-event.service';
import firebase from 'firebase/app';
import { AuthService } from '../web-services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private fullEventService: FullEventService,
    private storageUtils: StorageUtilsService,
    private authService: AuthService,
    private firestore: AngularFirestore,
  ) { }

  deleteEvents(previewEvent: PreviewEvent): Observable<any> {
    const authUser = this.authService.user$;
    if (authUser != null) {
      return authUser.pipe(
        first(),
        concatMap(user => {
          if (user) {
            return this.fullEventService.getEvent(previewEvent.eventId).pipe(
              concatMap(fullEvent => {
                return this.deleteImages(fullEvent!.imageURL, previewEvent.previewImageURL).pipe(
                  map(_ => fullEvent),
                );
              }),
              concatMap(fullEvent => {
                const eventId = previewEvent.eventId;
                return from(this.firestore.doc<PreviewEvent>(`previewEvents/${eventId}`).delete()).pipe(
                  map(_ => fullEvent),
                );
              }),
              concatMap(fullEvent => {
                const eventId = previewEvent.eventId;
                console.log(`event id: ${eventId}`);
                return from(this.firestore.doc<FullEvent>(`events/${eventId}`).delete()).pipe(
                  map(_ => {
                    return { email: fullEvent!.registrationEmail, eventId: eventId };
                  }),
                );
              }),
              concatMap(removeData => {
                console.log(`removeData email: ${removeData.email}`);
                console.log(`removeData event id: ${removeData.eventId}`);

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
                console.log(`doc id at remove: ${removeData.userDoc.id}`);
                console.log(`event id at remove: ${removeData.eventId}`);

                return from(removeData.userDoc.update({ // update doc to remove post id in posts array
                  posts: firebase.firestore.FieldValue.arrayRemove(removeData.eventId),
                })).pipe(
                  map(_ => true),
                );
              }),
            )
          }
          else {
            return of(null);
          }
        })
      )
    }
    else {
      return of(null);
    }
  }

  deleteImages(previousImageURL: string, previousThumbURL: string): Observable<any> {
    return forkJoin([
      this.storageUtils.deleteFileOfURL(previousImageURL),
      this.storageUtils.deleteFileofPath(previousThumbURL),
    ]);
  }
}
