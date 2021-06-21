import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  routes: { path: string, title: string }[] = [
    { path: 'home', title: 'Calendar' },
    { path: 'legend', title: 'Legend for Symbols' },
    { path: 'add-event', title: 'Add an Event' },
    { path: 'about', title: 'About Us' },
    { path: 'donate', title: 'Donate' },
    { path: 'profile', title: 'My Profile' },

  ]
  constructor() { }

  ngOnInit(): void {
  }

}
