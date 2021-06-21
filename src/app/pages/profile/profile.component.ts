import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PreviewEvent } from 'src/app/utils/data/models/preview-event. model';
import { PreviewEventService } from 'src/app/utils/services/model-services/preview-event.service';
import { AuthService } from 'src/app/utils/services/web-services/auth.service';
import { StorageUtilsService } from 'src/app/utils/services/web-services/storage-utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  displayPosts: PreviewEvent[] = [];
  constructor(
    private previewEventService: PreviewEventService,
    private authService: AuthService,
    private storageUtils: StorageUtilsService,
  ) { }

  ngOnInit(): void {
    this.retrievePosts();
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

  getDownloadURL(path: string) {
    return this.storageUtils.getDownloadURL(path);
  }

  retrievePosts(): void {
    let postsToDisplay: Observable<PreviewEvent>[] = [];
    this.user$?.subscribe(data => {
      if (data != null) {
        data?.posts.forEach(postId => {
          const postObs = this.previewEventService.getEventById(postId);
          if (postObs != null && postObs != undefined) {
            postsToDisplay.push(postObs);
          }
        });
        forkJoin(postsToDisplay).subscribe(posts => {
          this.displayPosts = posts;
        });
      } else {
        this.displayPosts = [];
      }
    });
  }
}
