import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UiService } from '../services/general-services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class PrefetchResolver implements Resolve<boolean> {

  constructor(private uiService: UiService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.uiService.prefetch();
  }
}
