import { FullEvent } from "./full-event.model";
import { PreviewEvent } from "./preview-event. model";

export interface EventFormResults {
    fullEvent: FullEvent,
    previewEvent: PreviewEvent,
    imageFile: File,
    thumbnailFile: File,
    userUID: string,
    previousImageURL?: string;
    previousThumbURL?: string;
}