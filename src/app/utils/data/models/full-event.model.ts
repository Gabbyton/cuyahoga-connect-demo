import { Event } from "./event.model";

export interface FullEvent extends Event {
    imageURL: string;
    registrationEmail: string;
    registrationLink: string;
    description: string;
    dateStartTimeHour: number;
    dateStartTimeMin: number;
    dateEndTimeHour: number;
    dateEndTimeMin: number;
    contactEmail: string;
    contactName: string;
    contactNumber: number;
}
