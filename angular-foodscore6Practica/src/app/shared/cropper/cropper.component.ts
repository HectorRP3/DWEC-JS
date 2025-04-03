import { Component, input, output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'cropper',
  imports: [ImageCropperComponent],
  templateUrl: './cropper.component.html',
  styleUrl: './cropper.component.css',
})
export class CropperComponent {
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  aspectRatio = input<number>(16 / 9);
  anchura = input<number>(0);
  image = input<Event | null>(null);
  imageUrl = output<string>();

  constructor(private sanitizer: DomSanitizer) {}

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
    this.imageUrl.emit(this.croppedImage as string);
  }
  // imageLoaded(image: LoadedImage) {
  //     // show cropper
  // }
  // cropperReady() {
  //   // cropper ready
  // }
  // loadImageFailed() {
  //     // show message
  // }
}
