import { Component, HostListener, Input, OnInit } from '@angular/core';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { FilterService } from 'src/app/utils/services/model-services/filter.service';
import { Router } from '@angular/router';
import { EventFormResults } from 'src/app/utils/data/models/event-form-results.model';
import { UiService } from 'src/app/utils/services/general-services/ui.service';
import { FullEventService } from 'src/app/utils/services/model-services/full-event.service';
import { EventService } from 'src/app/utils/services/model-services/event.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input('events') previewEvents: PreviewEvent[] | null = [];
  @Input('allowEdit') allowEdit: boolean = false;
  displayWidth: number = this.getDisplayWidth();
  isLoading: boolean = false;

  constructor(
    private eventService: EventService,
    private fullEventService: FullEventService,
    private filterService: FilterService,
    private uiService: UiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  editEvent(previewEvent: PreviewEvent): void {
    this.isLoading = true;
    this.fullEventService.getEvent(previewEvent.eventId).subscribe(fullEvent => {
      const event = {
        fullEvent: fullEvent,
        previewEvent: previewEvent,
      } as EventFormResults;
      this.uiService.editEvent.next(event);
      this.router.navigateByUrl('/edit-event');
    });
  }

  trashEvent(previewEvent: PreviewEvent): void {
    this.isLoading = true;
    this.eventService.deleteEvents(previewEvent).subscribe(_ => {
      const deletedEventIndex = this.previewEvents!.indexOf(previewEvent);
      this.previewEvents!.splice(deletedEventIndex, 1);
      this.isLoading = false;
    });
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

  gotoEventPage(eventId: string) {
    this.router.navigate(['event', eventId]);
  }

  getFilter(shortName: string) {
    return this.filterService.getFilter(shortName);
  }
}