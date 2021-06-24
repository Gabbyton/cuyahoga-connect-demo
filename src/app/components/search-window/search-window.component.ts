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
  private month: number | null = null;
  private category: string | null = null;
  private filters: string[] | null = null;
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.onSearch.emit(
      {
        month: this.month,
        category: this.category,
        filters: this.filters
      } as SearchParams
    );
  }

  setMonth(month: number) {
    this.month = month;
  }

  setCategory(shortName: string | null) {
    this.category = shortName;
  }

  setFilters(filters: string[]) {
    this.filters = filters;
  }
}