export default class Draft {
    constructor(
        title = "New Draft",
        pages = [],
        draftContent = "",
        tag = "scene",
        wordCount = 0,
        lastEdited = new Date().toISOString(),
        id = null
    ) {
        this.id = id || `draft_${Date.now()}`;
        this.type = "draft";
        this.status = "draft";
        this.title = title;
        this.pages = pages;
        this.draftContent = draftContent;
        this.tag = tag;
        this.wordCount = wordCount;
        this.lastEdited = lastEdited;

        console.log("created new Draft --> id: " + this.id);
    }

    addPage() {
        const newId =
            this.pages.length > 0
                ? Math.max(...this.pages.map((p) => p.id || 0)) + 1
                : 1;
        this.pages.push({ id: newId, title: "", content: "" });
        return newId;
    }

    hasEmptyPages() {
        return this.pages.some((page) => !page.title && !page.content);
    }
}
