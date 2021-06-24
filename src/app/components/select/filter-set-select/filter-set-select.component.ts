import { Component, OnInit } from '@angular/core';
import { Filter } from 'src/app/utils/data/models/filter.model';
import { FilterService } from 'src/app/utils/services/model-services/filter.service';

@Component({
  selector: 'app-filter-set-select',
  templateUrl: './filter-set-select.component.html',
  styleUrls: ['./filter-set-select.component.scss']
})
export class FilterSetSelectComponent implements OnInit {
  options: string[] = [
    'Wheelchair Accessibility',
    'Accessibility for something else',
    'On second thought, remove this...',
    'Oh, nevermind',
  ];

  currentlySelectedFilters: (Filter | null)[] = [null];
  currentSelectorContent: string | null = null;
  currentlyHighlightedFilter: number = -1;

  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
  }

  get filters(): readonly Filter[] {
    return this.filterService.filters;
  }

  get wheelchairFilter(): Filter {
    return this.filters.filter(filter => filter.shortName == 'wheelchair')[0];
  }

  addFilter(newFilter: Filter): void {
    if (this.currentlySelectedFilters[0] == null) {
      this.currentlySelectedFilters.splice(0, 1);
    }
    this.currentlySelectedFilters.push(newFilter);
  }

  get filterMenuIndexForWheelchair() {
    return FilterMenuOption.WheelchairAccessibility;
  }

  selectOption(index: number) {
    switch (index) {
      case FilterMenuOption.WheelchairAccessibility:
        this.addFilter(this.wheelchairFilter);
        break;
      case FilterMenuOption.RemoveFilter:
        this.currentlySelectedFilters.splice(this.currentlyHighlightedFilter, 1);
        if (this.currentlySelectedFilters.length <= 0) {
          this.currentlySelectedFilters.push(null);
        }
        break;
    }
  }
}

enum FilterMenuOption {
  WheelchairAccessibility = 0,
  ChooseAccessibility = 1,
  RemoveFilter = 2,
  Cancel = 3,
}
