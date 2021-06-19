export default class Tag {
    shortName: string;
    longName: string;
    description: string;

    constructor(shortName: string, longName: string, description: string) {
        this.shortName = shortName
        this.longName = longName
        this.description = description
    }
}