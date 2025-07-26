export default class Note {
    static id = 0;

    constructor(title = "New Note", content = "", tag = "idea") {
        this.id++;
        this.type = "note";
        this.title = title;
        this.content = content;
        this.tag = tag;
        this.lastEdited = new Date().toISOString();
    }
}

