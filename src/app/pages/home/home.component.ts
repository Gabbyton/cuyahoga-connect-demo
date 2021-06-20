import { Component, OnInit } from '@angular/core';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  displayEvents: PreviewEvent[] = [];
  isLoading: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  setEvents(events: PreviewEvent[]): void {
    this.displayEvents = events;
  }

  startLoading(): void {
    this.isLoading = true;
  }
}