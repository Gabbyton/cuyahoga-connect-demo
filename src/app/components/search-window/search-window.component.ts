import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { CategoryService } from 'src/app/utils/services/model-services/category.service';
import { Category } from 'src/app/utils/data/models/category.model';
import { FormArray, FormBuilder } from '@angular/forms';
import { Filter } from 'src/app/utils/data/models/filter.model';
import { FilterService } from 'src/app/utils/services/model-services/filter.service';
import { PreviewEventService } from 'src/app/utils/services/model-services/preview-event.service';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
@Component({
  selector: 'app-search-window',
  templateUrl: './search-window.component.html',
  styleUrls: ['./search-window.component.scss']
})
export class SearchWindowComponent implements OnInit {
  @Output('onStartSearch') onStartSearch = new EventEmitter<void>();
  @Output('onEventLoaded') onDisplayEvent = new EventEmitter<PreviewEvent[]>();
  searchForm = this.formBuilder.group({
    month: [],
    category: [],
    filters: this.formBuilder.array([]),
  });

  constructor(
    private categoryService: CategoryService,
    private filterService: FilterService,
    private previewEventService: PreviewEventService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  get months(): readonly string[] {
    return getLocaleMonthNames('en-US', FormStyle.Standalone, TranslationWidth.Abbreviated);
  }

  get categories(): readonly Category[] {
    return this.categoryService.categories;
  }

  get filters(): readonly Filter[] {
    return this.filterService.filters;
  }

  get filterSelects() {
    return this.searchForm.get('filters') as FormArray;
  }

  addFilter() {
    this.filterSelects.push(this.formBuilder.control(null));
  }

  onSubmit(): void {
    // get search parameters from form
    this.onStartSearch.emit(); // signal that this component is starting search
    const month = parseInt(this.searchForm.value.month);
    const categoryObject = this.searchForm.value.category;
    const category = categoryObject == null ? null : categoryObject.shortName;
    let filters: string[] = [];
    (this.searchForm.value.filters as Filter[]).forEach(filter => { filters.push(filter.shortName) });
    // assign events to results
    this.previewEventService.getEvents(month, category, filters).subscribe(events => {
      this.onDisplayEvent.emit(events);
    });
  }
}