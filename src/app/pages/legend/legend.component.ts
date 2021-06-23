import { Component, OnInit } from '@angular/core';
import { FilterService } from 'src/app/utils/services/model-services/filter.service';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {

  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
  }

  get filters() {
    return this.filterService.filters;
  }

}
