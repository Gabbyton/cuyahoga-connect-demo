import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  sitePages = [
    { path: 'home', title: 'Calendar' },
    { path: 'legend', title: 'Legend for Symbols' },
    { path: 'add-event', title: 'Add an Event' },
    { path: 'profile', title: 'My Profile' },
  ]
  resourceLinks = [
    { name: 'Cuyahoga BODD', url: 'https://cuyahogabdd.org/' },
    { name: 'Case Western Reserve University', url: 'https://case.edu/' },
    { name: 'Design for America - CWRU-CIA', url: 'https://www.facebook.com/dfacwru/' },
  ]
  aboutLinks = [
    { path: 'about', title: 'About Us' },
    { path: 'donate', title: 'Donate' },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
