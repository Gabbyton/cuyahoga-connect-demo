import { Component, OnInit } from '@angular/core';
import { EventFormResults } from 'src/app/utils/data/models/event-form-results.model';
import { UiService } from 'src/app/utils/services/general-services/ui.service';
import { StorageUtilsService } from 'src/app/utils/services/web-services/storage-utils.service';
import { EventFormResultsService } from 'src/app/utils/services/model-services/event-form-results.service';
import { EventService } from 'src/app/utils/services/model-services/event.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  progressBarValue: number = 0;
  uploadComplete: boolean = false;
  showError: boolean = false;
  disableSubmit: boolean = false;

  constructor(
    private storageUtils: StorageUtilsService,
    private eventService: EventService,
    private eventFormResultsService: EventFormResultsService,
    private uiService: UiService,
  ) { }

  ngOnInit(): void {
  }

  get editEvent() {
    return this.uiService.editEvent.value;
  }

  update(formResults: EventFormResults): void {
    this.disableSubmit = true;
    // delete previously uploaded images
    const previousImageURL = formResults.previousImageURL!;
    const previousThumbURL = formResults.previousThumbURL!;
    this.eventService.deleteImages(previousImageURL, previousThumbURL).subscribe(_ => { // start deleting files
    }, error => {
      console.error(`failed to delete file...`, error);
    });

    const imageUploadObs = this.storageUtils.uploadFile(formResults.imageFile, formResults.fullEvent.imageURL);
    const thumbUploadObs = this.storageUtils.uploadFile(formResults.thumbnailFile, formResults.previewEvent.previewImageURL);
    // subscribe to upload progress
    this.eventFormResultsService.uploadResultsProgress(
      formResults,
      imageUploadObs.uploadProgress,
      thumbUploadObs.uploadProgress,
    ).subscribe(uploadProgress => {
      this.progressBarValue = uploadProgress;
    });
    // subscribe to main upload task
    this.eventFormResultsService.uploadResults(
      formResults,
      imageUploadObs.uploadChanges,
      thumbUploadObs.uploadChanges,
    ).subscribe(_ => {
      // on complete
      this.uploadComplete = true;
    });
  }

}
