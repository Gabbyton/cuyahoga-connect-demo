import { Component, OnInit } from '@angular/core';
import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { CategoryService } from 'src/app/utils/services/model-services/category.service';
import { Category } from 'src/app/utils/data/models/category.model';
import { FormArray, FormBuilder } from '@angular/forms';
import { Filter } from 'src/app/utils/data/models/filter.model';
import { FilterService } from 'src/app/utils/services/model-services/filter.service';
import { PreviewEventService } from 'src/app/utils/services/model-services/preview-event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  displayEvents: any;
  searchForm = this.formBuilder.group({
    month: [],
    category: [],
    filters: this.formBuilder.array([
    ])
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
    const month = parseInt(this.searchForm.value.month);
    const categoryObject = this.searchForm.value.category;
    const category = categoryObject == null ? null : categoryObject.shortName;
    let filters: string[] = [];
    (this.searchForm.value.filters as Filter[]).forEach(filter => { filters.push(filter.shortName) });
    // assign events to results
    this.displayEvents = this.previewEventService.getEvents(month, category, filters);
  }
}