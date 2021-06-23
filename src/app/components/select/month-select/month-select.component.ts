import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DateService } from 'src/app/utils/services/general-services/date.service';

@Component({
  selector: 'app-month-select',
  templateUrl: './month-select.component.html',
  styleUrls: ['./month-select.component.scss']
})
export class MonthSelectComponent implements OnInit {
  private numberAssignment = new Map<string, number>();
  @Output('monthSelected') onMonthSelected = new EventEmitter<number>();
  selectBoxContent: string = '';
  constructor(private dateUtils: DateService) { }

  ngOnInit(): void {
    this.months.forEach((month, index) => {
      this.numberAssignment.set(month, index + 1);
    });
    const currentDateMonth = this.dateUtils.getCurrentDateMonth() + 1;
    this.selectBoxContent = this.months[currentDateMonth - 1];
    this.onMonthSelected.emit(currentDateMonth);
  }

  get months(): string[] {
    let monthsList: string[] = [];
    getLocaleMonthNames('en-US', FormStyle.Standalone, TranslationWidth.Abbreviated).forEach(month => {
      monthsList.push(month);
    });
    return monthsList;
  }

  getMonthSelected(monthSelected: string) {
    console.log(monthSelected);
    this.selectBoxContent = monthSelected;
    this.onMonthSelected.emit(this.numberAssignment.get(monthSelected));
  }
}
