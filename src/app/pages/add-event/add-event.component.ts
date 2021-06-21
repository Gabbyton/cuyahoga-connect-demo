import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Event } from 'src/app/utils/data/models/event.model';
import { FullEvent } from 'src/app/utils/data/models/full-event.model';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from 'src/app/utils/services/general-services/date.service';
import { CategoryService } from 'src/app/utils/services/model-services/category.service';
import { Category } from 'src/app/utils/data/models/category.model';
import { AuthService } from 'src/app/utils/services/web-services/auth.service';
import { StorageUtilsService } from 'src/app/utils/services/web-services/storage-utils.service';
import { forkJoin, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  eventForm = this.formBuilder.group({
    // basic event
    category: [],
    dateStart: [], // as ngbdatestruct
    dateEnd: [], // as ngbdatestruct
    location: [],
    name: [],
    price: [],
    shortLocation: [],

    // full event
    imageURL: [], // from generator
    registrationEmail: [], // from auth
    registrationLink: [],
    description: [],
    dateStartTime: [], // as ngbtimestruct
    dateEndTime: [], // as ngbtimestruct
    contactEmail: [],
    contactName: [],
    contactNumber: [],

    // preview event
    eventId: [], // from firestore
    previewImageURL: [], // from croppper
  });
  private thumbnail: File | null = null;
  private image: File | null = null;
  private selectedFilters: string[] = [];

  private isLoading: boolean = true;
  private uploadProgress: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dateUtilsService: DateService,
    private categoryService: CategoryService,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private storageUtils: StorageUtilsService,
  ) { }

  ngOnInit(): void {
  }

  get categories(): readonly Category[] {
    return this.categoryService.categories;
  }

  onSubmit(): void {
    const randomImageName = this.randomImageName;
    const eventImageFilename = `${randomImageName}-image`;
    const thumbImageFilename = `${randomImageName}-thumbnail`;
    const results = this.eventForm.value;
    if (this.areFilesSet) {
      const imageUploadObs = this.storageUtils.uploadFile(this.image!, eventImageFilename);
      const thumbUploadObs = this.storageUtils.uploadFile(this.thumbnail!, thumbImageFilename);
      // subscribe to upload progress
      forkJoin([imageUploadObs.uploadProgress, thumbUploadObs.uploadProgress]).pipe(
        map(data =>
          ((data[0] == undefined ? 0 : data[0]) +
            (data[1] == undefined ? 0 : data[1])) / 2),
      ).subscribe(data => {
        console.log(`upload progress: ${data}`);
      });
      // subscribe to main upload task
      const uploadObs = this.authService.user$!.pipe(
        concatMap(user => {
          return forkJoin({
            imageUpload: imageUploadObs.uploadChanges,
            thumbUpload: thumbUploadObs.uploadChanges,
            registerUser: of(user!),
          })
        }),
        concatMap(uploadData => {
          const eventId = this.firestore.createId();
          const fullEvent = this.getFullEventObject(
            results,
            uploadData.registerUser.email,
            eventImageFilename
          );
          const previewEvent = this.getPreviewEventObject(results, eventId, thumbImageFilename);
          return forkJoin({
            fullEventOpts: this.firestore.collection<FullEvent>('events').doc(eventId).set(fullEvent),
            previewEventOpts: this.firestore.collection<PreviewEvent>('previewEvents').doc(eventId).set(previewEvent),
            registerUser: of(uploadData.registerUser),
            eventId: of(eventId),
          });
        }),
        concatMap(uploadData => { // update posts field for this user with this event id
          const userDoc = this.firestore.doc(`users/${uploadData.registerUser.uid}`);
          return userDoc.update({ posts: firebase.firestore.FieldValue.arrayUnion(uploadData.eventId) });
        }),
      );
      uploadObs.subscribe(_ => {
        console.log(`all upload tasks completed...`);
      });
    } else {
      console.log(`files not set!!..`);
    }
  }

  setThumbnail(thumbnail: File) {
    this.thumbnail = thumbnail;
  }

  setImage(image: File) {
    this.image = image;
  }

  get areFilesSet(): boolean {
    return this.image != null && this.thumbnail != null;
  }

  setSelectedFilters(filters: string[]) {
    this.selectedFilters = filters;
  }

  private get randomImageName(): string {
    const suffix = Math.random().toString(36).substring(2);
    return `${this.dateUtilsService.getCurrentDateinFormat('yyyy-MM-dd')}-${suffix}`;
  }

  private getEventObject(results: any): Event {
    const dateStart = results.dateStart as NgbDateStruct;
    const dateEnd = results.dateEnd as NgbDateStruct;
    const dateStartTime = results.dateStartTime as NgbTimeStruct;
    const dateEndTime = results.dateEndTime as NgbTimeStruct;
    let event: Event = {
      categories: [results.category.shortName],
      dateEndDay: dateEnd.day,
      dateEndMillis: this.dateUtilsService.getDateMillis(dateEnd, dateEndTime),
      dateEndMonth: dateEnd.month,
      dateEndYear: dateEnd.year,
      dateStartDay: dateStart.day,
      dateStartMillis: this.dateUtilsService.getDateMillis(dateStart, dateStartTime),
      dateStartMonth: dateStart.month,
      dateStartYear: dateStart.year,
      filters: this.selectedFilters, // get filters from component listener
      location: results.location,
      name: results.name,
      price: parseInt(results.price),
      shortLocation: results.shortLocation,
    }
    return event;
  }

  private getFullEventObject(results: any, registrationEmail: string, imageURL: string): FullEvent {
    const basicEvent: Event = Object.assign({}, this.getEventObject(results));
    const dateStartTime = results.dateStartTime as NgbTimeStruct;
    const dateEndTime = results.dateEndTime as NgbTimeStruct;
    const extraProperties = {
      imageURL: imageURL, // from generator
      registrationEmail: registrationEmail, // from auth service
      registrationLink: results.registrationLink,
      description: results.description,
      dateStartTimeHour: dateStartTime.hour,
      dateStartTimeMin: dateStartTime.minute,
      dateEndTimeHour: dateEndTime.hour,
      dateEndTimeMin: dateEndTime.minute,
      contactEmail: results.contactEmail,
      contactName: results.contactName,
      contactNumber: results.contactNumber,
    }
    return { ...basicEvent, ...extraProperties } as FullEvent;
  }

  private getPreviewEventObject(results: any, eventId: string, previewImageURL: string): PreviewEvent {
    const basicEvent: Event = Object.assign({}, this.getEventObject(results));
    const extraProperties = {
      eventId: eventId,
      previewImageURL: previewImageURL,
    }
    return { ...basicEvent, ...extraProperties } as PreviewEvent;
  }
}