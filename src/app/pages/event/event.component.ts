import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { catchError, concatMap, filter } from 'rxjs/operators';
import { Filter } from 'src/app/utils/data/models/filter.model';
import { FullEvent } from 'src/app/utils/data/models/full-event.model';
import { DateService } from 'src/app/utils/services/general-services/date.service';
import { CategoryService } from 'src/app/utils/services/model-services/category.service';
import { FilterService } from 'src/app/utils/services/model-services/filter.service';
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
    private fullEventService: FullEventService,
    private categoryService: CategoryService,
    private filterService: FilterService,
    private route: ActivatedRoute,
    private dateUtils: DateService,
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

  get categoryString(): string {
    const currentCategoryShortName = this.fullEvent!.categories[0];
    const currentCategory = this.categoryService.getCategory(currentCategoryShortName);
    return `${currentCategory.emoji} ${currentCategory.longName}`;
  }

  get presentFilters(): Filter[] {
    let results: Filter[] = [];
    if (this.areFiltersDefined) {
      this.fullEvent!.filters.forEach(filter => {
        results.push(this.filterService.getFilter(filter));
      });
    }
    return results;
  }

  get areFiltersDefined() {
    return this.fullEvent != null && this.fullEvent.filters != null && this.fullEvent.filters != undefined;
  }

  get areFiltersPresent(): boolean {
    return this.areFiltersDefined && this.fullEvent!.filters.length > 0;
  }

  get startDate(): Date {
    const e = this.fullEvent!;
    return this.dateUtils.getDateObject(e.dateStartYear, e.dateStartMonth, e.dateStartDay, e.dateStartTimeHour, e.dateStartTimeMin);
  }

  get endDate(): Date {
    const e = this.fullEvent!;
    return this.dateUtils.getDateObject(e.dateEndYear, e.dateEndMonth, e.dateEndDay, e.dateEndTimeHour, e.dateEndTimeMin);
  }

  ngOnDestroy() {
    if (this.paramsSubs != null)
      this.paramsSubs.unsubscribe();
  }

}
