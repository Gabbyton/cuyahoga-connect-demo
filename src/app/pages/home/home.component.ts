import { Component, OnInit } from '@angular/core';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
import { SearchParams } from 'src/app/utils/data/models/search-params.model';
import { DateService } from 'src/app/utils/services/general-services/date.service';
import { PreviewEventService } from 'src/app/utils/services/model-services/preview-event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  displayEvents: PreviewEvent[] = [];
  isLoading: boolean = false;
  constructor(
    private previewEventService: PreviewEventService,
    private dateUtils: DateService,
  ) { }

  ngOnInit() {
    this.loadEvents({ month: this.currentMonth } as SearchParams);
  }

  get currentMonth() {
    return this.dateUtils.getCurrentDateMonth();
  }

  loadEvents(searchParams: SearchParams) {
    console.log(`on search`, searchParams);

    this.isLoading = true;
    // assign events to results
    this.previewEventService
      .getEvents(searchParams.month, searchParams.category, searchParams.filters)
      .subscribe(events => {
        console.log('hello wlrd');
        this.displayEvents = [];
        this.displayEvents = events;
        console.log(`display events: `, this.displayEvents);
        this.isLoading = false;
      });
  }
}