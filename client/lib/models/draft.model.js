export default class Draft {
    static id = 0;

    constructor(title = "New Draft", pages = [], draftContent = "", tag = "scene") {
        this.id = id + 1;
        this.type = "draft";
        this.status = "draft";
        this.title = title;
        this.pages = pages;
        this.draftContent = draftContent;
        this.tag = tag;
    }
}