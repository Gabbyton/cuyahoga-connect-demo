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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchWindowComponent,
    CalendarComponent,
    AddEventComponent,
    CropperComponent,
    FilterSelectComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
