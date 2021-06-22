import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Event } from 'src/app/utils/data/models/event.model';
import { FullEvent } from 'src/app/utils/data/models/full-event.model';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from 'src/app/utils/services/general-services/date.service';
import { CategoryService } from 'src/app/utils/services/model-services/category.service';
import { Category } from 'src/app/utils/data/models/category.model';
import { AuthService } from 'src/app/utils/services/web-services/auth.service';
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { EventFormResults } from 'src/app/utils/data/models/event-form-results.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  @Output('onSubmit') onSubmit = new EventEmitter<EventFormResults>();
  @Input('contents') contents: EventFormResults | null = null;
  eventForm: FormGroup | null = null;

  private thumbnail: File | null = null;
  private image: File | null = null;
  private selectedFilters: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dateUtilsService: DateService,
    private categoryService: CategoryService,
    private firestore: AngularFirestore,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // TODO: make previous image preview that's cancellable
    const inputFullEvent = this.contents?.fullEvent;
    const inputPreviewEvent = this.contents?.previewEvent;
    this.eventForm = this.formBuilder.group({
      // basic event
      category: [this.getCategoryObject(inputFullEvent?.categories[0]!)],
      dateStart: [this.getDefaultDate(
        inputFullEvent?.dateStartYear,
        inputFullEvent?.dateStartMonth,
        inputFullEvent?.dateStartDay,
      )], // as ngbdatestruct
      dateEnd: [this.getDefaultDate(
        inputFullEvent?.dateEndYear,
        inputFullEvent?.dateEndMonth,
        inputFullEvent?.dateEndDay,
      )], // as ngbdatestruct
      location: [inputFullEvent?.location],
      name: [inputFullEvent?.name],
      price: [inputFullEvent?.price],
      shortLocation: [inputFullEvent?.shortLocation],
      // full event
      imageURL: [inputFullEvent?.imageURL], // from generator
      registrationEmail: [inputFullEvent?.registrationEmail], // from auth
      registrationLink: [inputFullEvent?.registrationLink],
      description: [inputFullEvent?.description],
      dateStartTime: [this.getDefaultTime(
        inputFullEvent?.dateStartTimeHour,
        inputFullEvent?.dateEndTimeMin,
      )], // as ngbtimestruct
      dateEndTime: [this.getDefaultTime(
        inputFullEvent?.dateEndTimeHour,
        inputFullEvent?.dateEndTimeMin,
      )], // as ngbtimestruct
      contactEmail: [inputFullEvent?.contactEmail],
      contactName: [inputFullEvent?.contactName],
      contactNumber: [inputFullEvent?.contactNumber],
      // preview event
      eventId: [inputPreviewEvent?.eventId], // from firestore
      previewImageURL: [inputPreviewEvent?.previewImageURL], // from croppper
    });
  }

  get initFilterValues(): string[] {
    const initFilters = this.contents?.fullEvent.filters;
    if (initFilters != null && initFilters != undefined) {
      return initFilters;
    }
    return [];
  }

  private getDefaultDate(year?: number, month?: number, day?: number): NgbDateStruct | null {
    if (year == null || month == null || day == null)
      return null;
    return { year: year, month: month, day: day } as NgbDateStruct;
  }

  private getDefaultTime(hour?: number, minute?: number): NgbTimeStruct | null {
    if (hour == null || minute == null)
      return null;
    return { hour: hour, minute: minute } as NgbTimeStruct;
  }

  get categories(): readonly Category[] {
    return this.categoryService.categories;
  }

  private getCategoryObject(shortName: string): Category {
    return this.categories.filter(category => category.shortName == shortName)[0];
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

  submit(): void {
    if (this.areFilesSet && this.authService.user$ != null && this.eventForm != null) {
      const randomImageName = this.randomImageName;
      const eventImageFilename = `${randomImageName}-image`;
      const thumbImageFilename = `${randomImageName}-thumbnail`;
      const results = this.eventForm!.value;
      const eventId = this.firestore.createId();
      const previewEvent = this.getPreviewEventObject(results, eventId, thumbImageFilename);
      // retrieve auth user email and uid
      this.authService.user$!.pipe(
        first(),
      ).subscribe(userData => {
        const fullEvent = this.getFullEventObject(
          results,
          userData!.email,
          eventImageFilename
        );
        this.onSubmit.emit({
          fullEvent: fullEvent,
          previewEvent: previewEvent,
          imageFile: this.image!,
          thumbnailFile: this.thumbnail!,
          userUID: userData!.uid,
        } as EventFormResults);
      });
    } else {
      console.error(`Circumvented Validators for File and User data`,
        `The file for the event is null or the user is not logged in. If you are seeing this error, please contact website owners.`);
    }
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
