import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/utils/services/web-services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  get user$() {
    return this.authService.user$;
  }

  async login() {
    await this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

}
