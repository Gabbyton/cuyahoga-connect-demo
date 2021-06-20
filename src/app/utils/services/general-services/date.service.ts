import { Injectable } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getDateMillis(date: NgbDateStruct, time: NgbTimeStruct): number {
    return new Date(date.year, date.month, date.day, time.hour, time.minute).getTime();
  }
}
