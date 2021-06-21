import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, first } from 'rxjs/operators';
import { PreviewEvent } from '../../data/models/preview-event. model';
import { StorageUtilsService } from '../web-services/storage-utils.service';

@Injectable({
  providedIn: 'root'
})
export class PreviewEventService {

  constructor(
    private firestore: AngularFirestore,
    private storageUtils: StorageUtilsService,
  ) {
  }

  private getEventsForMonth(month: number): Observable<PreviewEvent[]> {
    return this.firestore
      .collection<PreviewEvent>('previewEvents',
        ref => ref.where('dateStartMonth', '==', month)
      ).valueChanges().pipe(
        first(),
      );
  }

  getEvents(month: number, category: string, filters: string[]): Observable<PreviewEvent[]> {
    return this.getEventsForMonth(month).pipe(
      concatMap((results: PreviewEvent[]) => {
        if (category != null && category != '')
          return of(results.filter(result => result.categories.includes(category)));
        return of(results);
      }),
      concatMap((results: PreviewEvent[]) => {
        if (filters != null && filters.length > 0) {
          return of(results.filter(result => {
            let allFiltersPresent = result.filters.length > 0;
            filters.forEach(filter => {
              allFiltersPresent = allFiltersPresent && result.filters.includes(filter);
            });
            return allFiltersPresent;
          }));
        }
        return of(results);
      }),
      concatMap(data => {
        let getDownloadURLObs: Observable<any>[] = [];
        data.forEach(event => {
          getDownloadURLObs.push(
            this.storageUtils.getDownloadURL(event.previewImageURL).pipe(
              concatMap(url => {
                let updatedEvent: PreviewEvent = Object.assign({}, event); // copy contents of the preview event
                updatedEvent.previewImageURL = url; // assign the url of the copy to new url
                return of(updatedEvent); // return the copy
              }),
            )
          );
        });
        if (getDownloadURLObs.length > 0)
          return forkJoin(getDownloadURLObs);
        return of([]);
      }),
    );
  }
}
