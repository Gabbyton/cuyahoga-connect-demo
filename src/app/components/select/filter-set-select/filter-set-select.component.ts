import { AfterViewInit, Component, OnInit } from '@angular/core';
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

  currentlySelectedFilters: Filter[] = [];
  currentSelectorContent: string | null = null;

  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
    this.currentlySelectedFilters = [...this.filters];
  }

  get filters() {
    return this.filterService.filters;
  }

  selectOption(index: number) {
    switch (index) {
    }
  }
}

enum FilterMenuOption {
  WheelchairAccessibility = 0,
  ChooseAccessibility = 1,
  RemoveFilter = 2,
  Cancel = 3,
}
