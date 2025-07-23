let id = 1;

export default class Note {
    constructor(title = "New Note", content = "", tag = "idea") {
        this.id = id++;
        this.type = "note";
        this.title = title;
        this.content = content;
        this.tag = tag;
        this.lastEdited = new Date().toISOString();
    }
}

