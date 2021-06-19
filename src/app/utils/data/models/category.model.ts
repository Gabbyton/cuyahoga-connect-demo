import Tag from "./tag.model";

export class Category extends Tag {
    emoji: string;

    constructor(emoji: string, shortName: string, longName: string, description: string) {
        super(shortName, longName, description);
        this.emoji = emoji;
    }
}