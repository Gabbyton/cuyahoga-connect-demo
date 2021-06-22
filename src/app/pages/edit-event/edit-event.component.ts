import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/utils/services/general-services/ui.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  constructor(private uiService: UiService) { }

  ngOnInit(): void {
  }

  get editEvent() {
    return this.uiService.editEvent.value;
  }

}
