import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Filter } from 'src/app/utils/data/models/filter.model';
import { FilterService } from 'src/app/utils/services/model-services/filter.service';

@Component({
  selector: 'app-filter-set-select',
  templateUrl: './filter-set-select.component.html',
  styleUrls: ['./filter-set-select.component.scss']
})
export class FilterSetSelectComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any> | null = null;
  @Output('selectFilters') onSelectFilters = new EventEmitter<string[]>();
  options: string[] = [
    'Wheelchair Accessibility',
    'Accessibility for something else',
    'On second thought, remove this...',
    'Oh, nevermind',
  ];

  currentlySelectedFilters: (Filter | null)[] = [null];
  currentSelectorContent: string | null = null;
  currentlyHighlightedFilter: number = -1;

  constructor(
    private filterService: FilterService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  open(): void {
    this.modalService.open(this.content!, { ariaLabelledBy: 'modal-basic-title' });
  }

  get filters(): readonly Filter[] {
    return this.filterService.filters;
  }

  get wheelchairFilter(): Filter {
    return this.filters.filter(filter => filter.shortName == 'wheelchair')[0];
  }

  selectedInclude(selectedFilter: Filter): boolean {
    return this.currentlySelectedFilters.includes(selectedFilter);
  }

  toggleFilter(selectedFilter: Filter) {
    if (this.selectedInclude(selectedFilter))
      this.removeFilter(selectedFilter);
    else
      this.addFilter(selectedFilter);
  }

  removeFilter(filter: Filter) {
    const indexToRemove = this.currentlySelectedFilters.indexOf(filter);
    this.currentlySelectedFilters.splice(indexToRemove, 1);
    if (this.currentlySelectedFilters.length <= 0) {
      this.currentlySelectedFilters.push(null);
    }
    this.outputSelection();
  }

  addFilter(newFilter: Filter): void {
    if (this.currentlySelectedFilters[0] == null) {
      this.currentlySelectedFilters.splice(0, 1);
    }
    this.currentlySelectedFilters.push(newFilter);
    this.outputSelection();
  }

  outputSelection() {
    this.onSelectFilters.emit(
      this.currentlySelectedFilters
        .filter(filter => filter != null)
        .map(filter => filter!.shortName),
    );
  }

  get filterMenuIndexForWheelchair() {
    return FilterMenuOption.WheelchairAccessibility;
  }

  selectOption(index: number) {
    switch (index) {
      case FilterMenuOption.WheelchairAccessibility:
        this.addFilter(this.wheelchairFilter);
        break;
      case FilterMenuOption.ChooseAccessibility:
        this.open();
        break;
      case FilterMenuOption.RemoveFilter:
        this.currentlySelectedFilters.splice(this.currentlyHighlightedFilter, 1);
        if (this.currentlySelectedFilters.length <= 0) {
          this.currentlySelectedFilters.push(null);
          this.outputSelection();
        }
        break;
      default:
        console.error('Filter Menu Error', 'option not supported...');
    }
  }
}

enum FilterMenuOption {
  WheelchairAccessibility = 0,
  ChooseAccessibility = 1,
  RemoveFilter = 2,
  Cancel = 3,
}
