import { Event } from "./event.model";

export interface PreviewEvent extends Event {
    eventId: string;
    previewImageURL: string;
}