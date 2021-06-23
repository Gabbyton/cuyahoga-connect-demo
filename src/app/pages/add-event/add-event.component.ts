import { Component, OnInit } from '@angular/core';
import { StorageUtilsService } from 'src/app/utils/services/web-services/storage-utils.service';
import { EventFormResults } from 'src/app/utils/data/models/event-form-results.model';
import { EventFormResultsService } from 'src/app/utils/services/model-services/event-form-results.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  progressBarValue: number = 0;
  uploadComplete: boolean = false;
  showError: boolean = false;
  disableSubmit: boolean = false;
  constructor(
    private storageUtils: StorageUtilsService,
    private eventFormResultsService: EventFormResultsService,
  ) { }

  ngOnInit(): void {
  }

  upload(formResults: EventFormResults): void {
    this.disableSubmit = true;
    const imageUploadObs = this.storageUtils
      .uploadFile(formResults.imageFile, formResults.fullEvent.imageURL);
    const thumbUploadObs = this.storageUtils
      .uploadFile(formResults.thumbnailFile, formResults.previewEvent.previewImageURL);
    // subscribe to upload progress
    this.eventFormResultsService
      .uploadResultsProgress(
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