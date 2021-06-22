import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterService } from 'src/app/utils/services/model-services/filter.service';

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss']
})
export class FilterSelectComponent implements OnInit {
  @Output('onFilterSelect') onFilterSelect = new EventEmitter<string[]>();
  @Input('initialValues') initialValues: string[] = [];
  selectedFilters: string[] = [];
  constructor(private filterService: FilterService,) { }


  ngOnInit(): void {
    this.selectedFilters = [...this.selectedFilters, ...this.initialValues];
  }

  get filters() {
    return this.filterService.filters;
  }

  getFilterInitState(shortName: string): boolean {
    return this.selectedFilters.includes(shortName);
  }

  toggleFilter(event: any, filterName: string) {
    if (event != null) {
      const checked = event.target.checked;
      if (checked) {
        this.selectedFilters.push(filterName);
      } else { // only ran when switched off
        const removeIndex = this.selectedFilters.indexOf(filterName);
        if (removeIndex >= 0)
          this.selectedFilters.splice(removeIndex, 1);
      }
      this.onFilterSelect.emit(this.selectedFilters);
    }
  }
}