import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment.dev';
import { HomeComponent } from './pages/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { SearchWindowComponent } from './components/search-window/search-window.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AddEventComponent } from './pages/add-event/add-event.component';
import { CropperComponent } from './components/cropper/cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';
import { DatePipe } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { EventComponent } from './pages/event/event.component';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EditEventComponent } from './pages/edit-event/edit-event.component';
import { ErrorComponent } from './pages/error/error.component';
import { LegendComponent } from './pages/legend/legend.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchWindowComponent,
    CalendarComponent,
    AddEventComponent,
    CropperComponent,
    FilterSelectComponent,
    ProfileComponent,
    EventComponent,
    NavbarComponent,
    EventFormComponent,
    EditEventComponent,
    ErrorComponent,
    LegendComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    AngularFireAnalyticsModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
