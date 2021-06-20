import { Component, OnInit } from '@angular/core';
import { CategoryService } from './utils/services/model-services/category.service';
import { FilterService } from './utils/services/model-services/filter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cuyahoga-connect-demo';
  constructor(
    private categoryService: CategoryService,
    private filterService: FilterService,
  ) {
  }

  ngOnInit(): void {
    this.categoryService.prefetch();
    this.filterService.prefetch();
  }
}
