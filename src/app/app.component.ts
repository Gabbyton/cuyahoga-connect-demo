import { Component } from '@angular/core';
import { FirestoreService } from './utils/services/web-services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cuyahoga-connect-demo';

  constructor(private firestoreService: FirestoreService) {

  }

  get items() {
    return this.firestoreService.itemsObs;
  }

  updateMonth(month: number) {
    console.log(month);
    this.firestoreService.month$.next(month);
  }
}
