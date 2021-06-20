import { Component, OnInit, Type } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Event } from 'src/app/utils/data/models/event.model';
import { FullEvent } from 'src/app/utils/data/models/full-event.model';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Filter } from 'src/app/utils/data/models/filter.model';
import { DateService } from 'src/app/utils/services/general-services/date.service';
import { CategoryService } from 'src/app/utils/services/model-services/category.service';
import { FilterService } from 'src/app/utils/services/model-services/filter.service';
import { Category } from 'src/app/utils/data/models/category.model';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  eventForm = this.formBuilder.group({
    // basic event
    category: [],
    dateStart: [], // as ngbdstruct
    dateEnd: [], // as ngbdstruct
    filters: [], // as filter ojects
    location: [],
    name: [],
    price: [],
    shortLocation: [],

    // full event
    imageURL: [], // from generator
    registrationEmail: [], // from auth
    registrationLink: [],
    description: [],
    dateStartTime: [], // as {hour, minute}
    dateEndTime: [], // as {hour, minute}
    contactEmail: [],
    contactName: [],
    contactNumber: [],

    // preview event
    eventId: [], // from firestore
    previewImageURL: [], // from croppper
  });
  thumbnail: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private dateUtilsService: DateService,
    private categoryService: CategoryService,
    private filterService: FilterService,
  ) { }

  ngOnInit(): void {
  }

  get categories(): readonly Category[] {
    // return this.categoryService.categories;
    return [];
  }

  onSubmit(): void {

  }

  setThumbnail(thumbnail: File) {
    this.thumbnail = thumbnail;
  }

  private getEventObject(results: any): Event {
    const dateStart = results.dateStart as NgbDateStruct;
    const dateEnd = results.dateEnd as NgbDateStruct;
    const dateStartTime = results.dateStartTime as NgbTimeStruct;
    const dateEndTime = results.dateEndTime as NgbTimeStruct;
    const filters = results.filters as Filter[];
    let event: Event = {
      categories: [results.category],
      dateEndDay: dateEnd.day,
      dateEndMillis: this.dateUtilsService.getDateMillis(dateEnd, dateEndTime),
      dateEndMonth: dateEnd.month,
      dateEndYear: dateEnd.year,
      dateStartDay: dateStart.day,
      dateStartMillis: this.dateUtilsService.getDateMillis(dateStart, dateStartTime),
      dateStartMonth: dateStart.month,
      dateStartYear: dateStart.year,
      filters: filters.map(filter => filter.shortName),
      location: results.location,
      name: results.name,
      price: parseInt(results.price),
      shortLocation: results.shortLocation,
    }
    return event;
  }

  getFullEventObject(results: any): FullEvent {
    const basicEvent: Event = Object.assign({}, this.getEventObject(results));
    const dateStartTime = results.dateStartTime as NgbTimeStruct;
    const dateEndTime = results.dateEndTime as NgbTimeStruct;
    const extraProperties = {
      imageURL: '', // from generator
      registrationEmail: '', // from auth
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

  getPreviewEventObject(results: any): PreviewEvent {
    const basicEvent: Event = Object.assign({}, this.getEventObject(results));
    const extraProperties = {
      eventId: '', // from firestore
      previewImageURL: '', // from generator
    }
    return { ...basicEvent, ...extraProperties } as PreviewEvent;
  }
}