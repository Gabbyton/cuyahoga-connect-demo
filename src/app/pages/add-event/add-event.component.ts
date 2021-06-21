import { Component, OnInit } from '@angular/core';
import { FullEvent } from 'src/app/utils/data/models/full-event.model';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
import { StorageUtilsService } from 'src/app/utils/services/web-services/storage-utils.service';
import { forkJoin } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { EventFormResults } from 'src/app/utils/data/models/event-form-results.model';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  constructor(
    private firestore: AngularFirestore,
    private storageUtils: StorageUtilsService,
  ) { }

  ngOnInit(): void {
  }

  upload(formResults: EventFormResults): void {
    const eventId = formResults.previewEvent.eventId; // id saved as property of preview event
    const imageUploadObs = this.storageUtils.uploadFile(formResults.imageFile, formResults.fullEvent.imageURL);
    const thumbUploadObs = this.storageUtils.uploadFile(formResults.thumbnailFile, formResults.previewEvent.previewImageURL);
    // subscribe to upload progress
    console.log(`starting upload tasks...`);
    forkJoin([imageUploadObs.uploadProgress, thumbUploadObs.uploadProgress]).pipe(
      map(data =>
        ((data[0] == undefined ? 0 : data[0]) +
          (data[1] == undefined ? 0 : data[1])) / 2),
    ).subscribe(data => {
      console.log(`upload progress: ${data}`);
    });
    // subscribe to main upload task
    forkJoin({
      imageUpload: imageUploadObs.uploadChanges,
      thumbUpload: thumbUploadObs.uploadChanges,
    }).pipe(
      concatMap(_ => {
        return forkJoin({
          fullEventOpts: this.firestore.collection<FullEvent>('events').doc(eventId).set(formResults.fullEvent),
          previewEventOpts: this.firestore.collection<PreviewEvent>('previewEvents').doc(eventId).set(formResults.previewEvent),
        });
      }),
      concatMap(_ => {
        const userDoc = this.firestore.doc(`users/${formResults.userUID}`);
        return userDoc.update({ posts: firebase.firestore.FieldValue.arrayUnion(eventId) });
      }),
    ).subscribe(_ => {
      // on complete
      console.log(`process complete...`);
    });
  }
}