import { Component, OnInit } from '@angular/core';
import { FormStyle, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { CategoryService } from 'src/app/utils/services/model-services/category.service';
import { Category } from 'src/app/utils/data/models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  months: readonly string[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    // populate month form
    this.months = getLocaleMonthNames('en-US', FormStyle.Standalone, TranslationWidth.Abbreviated);
  }

  get categories(): readonly Category[] {
    return this.categoryService.categories;
  }

}
