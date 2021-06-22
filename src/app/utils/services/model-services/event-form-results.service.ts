import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { forkJoin, Observable } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { EventFormResults } from '../../data/models/event-form-results.model';
import { FullEvent } from '../../data/models/full-event.model';
import { PreviewEvent } from '../../data/models/preview-event. model';
import { StorageUtilsService } from '../web-services/storage-utils.service';

@Injectable({
  providedIn: 'root'
})
export class EventFormResultsService {

  constructor(
    private firestore: AngularFirestore,
    private storageUtils: StorageUtilsService,
  ) { }


  uploadResultsProgress(formResults: EventFormResults, imageUploadProgressObs?: Observable<number | undefined>, thumbUploadProgressObs?: Observable<number | undefined>): Observable<number> {
    if (imageUploadProgressObs == null || thumbUploadProgressObs == null) {
      console.warn(`one of the observable parameters are null. Instance of upload task created.`);
      console.warn(`the results changes instance will not be in sync with this observable...`);
      imageUploadProgressObs = this.storageUtils.uploadFile(formResults.imageFile, formResults.fullEvent.imageURL).uploadProgress;
      thumbUploadProgressObs = this.storageUtils.uploadFile(formResults.thumbnailFile, formResults.previewEvent.previewImageURL).uploadProgress;
    }
    // subscribe to upload progress
    return forkJoin([imageUploadProgressObs, thumbUploadProgressObs]).pipe(
      map(data =>
        ((data[0] == undefined ? 0 : data[0]) +
          (data[1] == undefined ? 0 : data[1])) / 2),
    );
  }

  uploadResults(formResults: EventFormResults, imageUploadChangesObs?: Observable<any>, thumbUploadChangesObs?: Observable<any>): Observable<void> {
    const eventId = formResults.previewEvent.eventId; // id saved as property of preview event
    if (imageUploadChangesObs == null || thumbUploadChangesObs == null) {
      console.warn(`one of the observable parameters are null. Instance of upload task created.`);
      console.warn(`the results progress instance will not be in sync with this observable...`);
      imageUploadChangesObs = this.storageUtils.uploadFile(formResults.imageFile, formResults.fullEvent.imageURL).uploadChanges;
      thumbUploadChangesObs = this.storageUtils.uploadFile(formResults.thumbnailFile, formResults.previewEvent.previewImageURL).uploadChanges;
    }
    // subscribe to main upload task
    return forkJoin({
      imageUpload: imageUploadChangesObs,
      thumbUpload: thumbUploadChangesObs,
    }).pipe(
      concatMap(_ => {
        return forkJoin({
          fullEventOpts: this.firestore.collection<FullEvent>('events').doc(eventId).set(formResults.fullEvent, { merge: true }),
          previewEventOpts: this.firestore.collection<PreviewEvent>('previewEvents').doc(eventId).set(formResults.previewEvent, { merge: true }),
        });
      }),
      concatMap(_ => {
        const userDoc = this.firestore.doc(`users/${formResults.userUID}`);
        return userDoc.update({ posts: firebase.firestore.FieldValue.arrayUnion(eventId) });
      }),
    );
  }
}
