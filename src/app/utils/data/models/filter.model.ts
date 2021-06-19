import Tag from "./tag.model";

export class Filter extends Tag {
    iconClass: string;
    constructor(iconClass: string, shortName: string, longName: string, description: string) {
        super(shortName, longName, description);
        this.iconClass = iconClass;
    }
}