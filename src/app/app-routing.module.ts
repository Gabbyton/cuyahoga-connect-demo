import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEventComponent } from './pages/add-event/add-event.component';
import { EventComponent } from './pages/event/event.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { EditEventComponent } from './pages/edit-event/edit-event.component';
import { ErrorComponent } from './pages/error/error.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['profile']);

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'add-event',
    component: AddEventComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'event/:id', component: EventComponent },
  { path: 'edit-event', component: EditEventComponent },
  { path: 'error', component: ErrorComponent },
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {path: '**', redirectTo: 'error'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
