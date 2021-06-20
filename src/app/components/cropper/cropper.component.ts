import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit {
  @Output('onCropped') onCropped = new EventEmitter<File>();
  selectedImageEvent: any = '';
  selectedImage: File | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  imageCropped(event: ImageCroppedEvent) {
    const selectedThumbBase64 = event.base64;
    if (selectedThumbBase64 != null)
      this.onCropped.emit(<File>base64ToFile(selectedThumbBase64));
  }

  loadImageFailed() {
    // error handling
  }

  onFileSelected(event: any) {
    this.selectedImageEvent = event;
    if (event != null)
      this.selectedImage = event.target.files[0];
  }

}
