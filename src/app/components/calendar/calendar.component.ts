import { Component, HostListener, Input, OnInit } from '@angular/core';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input('events') previewEvents: PreviewEvent[] = [];
  displayWidth: number = this.getDisplayWidth();

  constructor() { }

  ngOnInit(): void {
  }

  getMonthAbbrev(month: number): string {
    return getLocaleMonthNames('en-US', FormStyle.Standalone, TranslationWidth.Abbreviated)[month - 1];
  }

  isSameDay(previewEvent: PreviewEvent): boolean {
    const dateStart = `${previewEvent.dateStartMonth}+${previewEvent.dateStartDay}+${previewEvent.dateStartYear}`;
    const dateEnd = `${previewEvent.dateEndMonth}+${previewEvent.dateEndDay}+${previewEvent.dateEndYear}`;
    return dateStart == dateEnd;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.displayWidth = this.getDisplayWidth();
  }

  getDisplayWidth(): number {
    let computedWidth = (0.07 * window.innerWidth) + 142.86;
    return computedWidth;
  }

}
