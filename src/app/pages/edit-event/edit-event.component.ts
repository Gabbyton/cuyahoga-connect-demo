import firebase from 'firebase/app';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { EventFormResults } from 'src/app/utils/data/models/event-form-results.model';
import { FullEvent } from 'src/app/utils/data/models/full-event.model';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
import { UiService } from 'src/app/utils/services/general-services/ui.service';
import { StorageUtilsService } from 'src/app/utils/services/web-services/storage-utils.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  constructor(
    private storageUtils: StorageUtilsService,
    private firestore: AngularFirestore,
    private uiService: UiService,
  ) { }

  ngOnInit(): void {
  }

  get editEvent() {
    return this.uiService.editEvent.value;
  }

  update(formResults: EventFormResults): void {
    // delete previously uploaded images
    const previousImageURL = formResults.fullEvent.imageURL;
    const previousThumbURL = formResults.previewEvent.previewImageURL;
    forkJoin([
      this.storageUtils.deleteFile(previousImageURL),
      this.storageUtils.deleteFile(previousThumbURL),
    ]).subscribe(_ => { // start deleting files
      console.log(`files deleted`);
    });

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
          fullEventOpts: this.firestore.collection<FullEvent>('events').doc(eventId).set(formResults.fullEvent, { merge: true }),
          previewEventOpts: this.firestore.collection<PreviewEvent>('previewEvents').doc(eventId).set(formResults.previewEvent, { merge: true }),
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
