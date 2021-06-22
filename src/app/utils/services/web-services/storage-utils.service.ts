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

  uploadFile(file: File, filepath: string): {
    uploadProgress: Observable<number | undefined>,
    uploadChanges: Observable<any>
  } {
    const uploadTask = this.storage.upload(filepath, file);
    return {
      uploadProgress: uploadTask.percentageChanges(),
      uploadChanges: uploadTask.snapshotChanges(),
    };
  }

  deleteFileofPath(path: string): Observable<any> {
    return this.storage.ref(path).delete();
  }

  deleteFileOfURL(url: string): Observable<any> {
    return this.storage.refFromURL(url).delete();
  }


}
