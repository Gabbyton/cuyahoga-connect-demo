import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { catchError, concatMap, filter } from 'rxjs/operators';
import { FullEvent } from 'src/app/utils/data/models/full-event.model';
import { FullEventService } from 'src/app/utils/services/model-services/full-event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {
  paramsSubs: Subscription | null = null;
  fullEvent: FullEvent | undefined | null;
  isLoading = true;


  constructor(
    private route: ActivatedRoute,
    private fullEventService: FullEventService,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      concatMap(params => this.fullEventService.getEvent(params['id'])),
      catchError(_ => of(null))
    ).subscribe(fullEvent => {
      this.fullEvent = fullEvent;
      this.isLoading = false;
    })
  }

  ngOnDestroy() {
    if (this.paramsSubs != null)
      this.paramsSubs.unsubscribe();
  }

}
