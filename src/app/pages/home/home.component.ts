import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  isLoading: boolean = true;
  private previousGetSubs: Subscription | null = null;

  constructor(
    private previewEventService: PreviewEventService,
    private dateUtils: DateService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loadEvents({ month: this.currentMonth } as SearchParams);
    this.route.data.subscribe(data => {
      console.log(data);
      this.isLoading = false;
    });
  }

  get currentMonth() {
    return this.dateUtils.getCurrentDateMonth();
  }

  loadEvents(searchParams: SearchParams) {
    this.isLoading = true;
    // assign events to results
    if (this.previousGetSubs != null)
      this.previousGetSubs.unsubscribe();
    this.previousGetSubs = this.previewEventService
      .getEvents(searchParams.month, searchParams.category, searchParams.filters)
      .subscribe(events => {
        this.displayEvents = [];
        this.displayEvents = events;
        this.isLoading = false;
      });
  }

  setMonth(month: number) {
    console.log('month selected: ', month);
  }

  setCategory(shortName: string | null) {
    if (shortName == null) {
      console.log(`anything goes`);
    } else {
      console.log('category selected:', shortName);
    }
  }
}