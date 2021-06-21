import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private datePipe: DatePipe) { }

  getDateMillis(date: NgbDateStruct, time: NgbTimeStruct): number {
    return new Date(date.year, date.month, date.day, time.hour, time.minute).getTime();
  }

  getCurrentDateinFormat(format: string) {
    return this.datePipe.transform(Date.now(), format);
  }

  getCurrentDateMonth(): number {
    const currentDate = new Date();
    return currentDate.getMonth() + 1;
  }
}
