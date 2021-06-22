import { Component, OnInit } from '@angular/core';
import { FullEvent } from 'src/app/utils/data/models/full-event.model';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
import { StorageUtilsService } from 'src/app/utils/services/web-services/storage-utils.service';
import { forkJoin } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { EventFormResults } from 'src/app/utils/data/models/event-form-results.model';
import { EventFormResultsService } from 'src/app/utils/services/model-services/event-form-results.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  constructor(
    private firestore: AngularFirestore,
    private storageUtils: StorageUtilsService,
    private eventFormResultsService: EventFormResultsService,
  ) { }

  ngOnInit(): void {
  }

  upload(formResults: EventFormResults): void {
    const imageUploadObs = this.storageUtils
      .uploadFile(formResults.imageFile, formResults.fullEvent.imageURL);
    const thumbUploadObs = this.storageUtils
      .uploadFile(formResults.thumbnailFile, formResults.previewEvent.previewImageURL);
    // subscribe to upload progress
    console.log(`starting upload tasks...`);
    this.eventFormResultsService
      .uploadResultsProgress(
        formResults,
        imageUploadObs.uploadProgress,
        thumbUploadObs.uploadProgress,
      ).subscribe(data => {
        console.log(`upload progress: ${data}`);
      });
    // subscribe to main upload task
    this.eventFormResultsService.uploadResults(
      formResults,
      imageUploadObs.uploadChanges,
      thumbUploadObs.uploadChanges,
    ).subscribe(_ => {
      // on complete
      console.log(`process complete...`);
    });
  }
}