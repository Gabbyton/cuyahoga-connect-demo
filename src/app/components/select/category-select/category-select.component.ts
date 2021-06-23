import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoryService } from 'src/app/utils/services/model-services/category.service';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {
  @Output('categorySelected') onCategorySelected = new EventEmitter<string | null>();
  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
  }

  get categories() {
    return this.categoryService.categories;
  }

  get filtersString() {
    return this.categories.map(category => `${category.emoji} ${category.longName}`);
  }

  selectCategory(categoryIndex: number) {
    if (categoryIndex == -1) {
      this.onCategorySelected.emit(null);
    } else {
      this.onCategorySelected.emit(this.categories[categoryIndex].shortName);
    }
  }
}
