import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DateService } from 'src/app/utils/services/general-services/date.service';

@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.scss']
})
export class DateSelectComponent implements OnInit {
  @Output('monthSelected') onMonthSelected = new EventEmitter<number>();
  constructor(private dateUtils: DateService) { }

  ngOnInit(): void {
  }

  get currentMonth() {
    return this.dateUtils.getCurrentDateMonth();
  }

  get currentFullMonth() {
    return this.dateUtils.getFullMonths()[this.currentMonth - 1];
  }

  get fullMonths(): string[] {
    return this.dateUtils.getFullMonths();
  }

  selectMonth(monthIndex: number) {
    this.onMonthSelected.emit(monthIndex + 1); // add one to get month in correct index format
  }

}
