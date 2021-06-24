import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventFormResults } from '../../data/models/event-form-results.model';
import { CategoryService } from '../model-services/category.service';
import { FilterService } from '../model-services/filter.service';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  editEvent = new BehaviorSubject<EventFormResults | null>(null);

  constructor(
    private filterService: FilterService,
    private categoryService: CategoryService,
  ) { }

  prefetch(): Observable<boolean> {
    return forkJoin([
      this.filterService.prefetch(),
      this.categoryService.prefetch(),
    ]).pipe(
      map(resolved => resolved[0] && resolved[1]),
    );
  }
}
