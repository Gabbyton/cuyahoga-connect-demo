import { Component, OnInit } from '@angular/core';
import { CategoryService } from './utils/services/model-services/category.service';
import { FilterService } from './utils/services/model-services/filter.service';
import { AuthService } from './utils/services/web-services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cuyahoga-connect-demo';
  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authService.initAuthPipe();
  }
}
