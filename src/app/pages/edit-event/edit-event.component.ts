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
import { EventFormResultsService } from 'src/app/utils/services/model-services/event-form-results.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  constructor(
    private storageUtils: StorageUtilsService,
    private eventFormResultsService: EventFormResultsService,
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
    const previousImageURL = formResults.previousImageURL!;
    const previousThumbURL = formResults.previousThumbURL!;
    forkJoin([
      this.storageUtils.deleteFileOfURL(previousImageURL),
      this.storageUtils.deleteFileofPath(previousThumbURL),
    ]).subscribe(_ => { // start deleting files
      console.log(`files deleted`);
    });

    const imageUploadObs = this.storageUtils.uploadFile(formResults.imageFile, formResults.fullEvent.imageURL);
    const thumbUploadObs = this.storageUtils.uploadFile(formResults.thumbnailFile, formResults.previewEvent.previewImageURL);
    // subscribe to upload progress
    console.log(`starting upload tasks...`);
    this.eventFormResultsService.uploadResultsProgress(
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
