import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { CategoryService } from 'src/app/utils/services/model-services/category.service';
import { Category } from 'src/app/utils/data/models/category.model';
import { FormArray, FormBuilder } from '@angular/forms';
import { Filter } from 'src/app/utils/data/models/filter.model';
import { FilterService } from 'src/app/utils/services/model-services/filter.service';
import { SearchParams } from 'src/app/utils/data/models/search-params.model';
import { DateService } from 'src/app/utils/services/general-services/date.service';
@Component({
  selector: 'app-search-window',
  templateUrl: './search-window.component.html',
  styleUrls: ['./search-window.component.scss']
})
export class SearchWindowComponent implements OnInit {
  @Output('onSearch') onSearch = new EventEmitter<SearchParams>();
  @Input('defaultMonth') defaultMonth: number = -1;

  searchForm = this.formBuilder.group({
    month: [this.dateUtils.getCurrentDateMonth()],
    category: [],
    filters: this.formBuilder.array([]),
  });

  constructor(
    private categoryService: CategoryService,
    private filterService: FilterService,
    private formBuilder: FormBuilder,
    private dateUtils: DateService,
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
    this.onSearch.emit({ month: month, category: category, filters: filters } as SearchParams);
  }
}