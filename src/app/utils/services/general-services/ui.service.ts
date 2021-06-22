import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventFormResults } from '../../data/models/event-form-results.model';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  editEvent = new BehaviorSubject<EventFormResults | null>(null);

  constructor() { }
}
