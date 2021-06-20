import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageUtilsService {

  constructor(private storage: AngularFireStorage) { }

  getDownloadURL(path: string): Observable<string> {
    return this.storage
      .ref(path)
      .getDownloadURL().pipe(
        first(),
        catchError(_ => of('')),
      );
  }
}
