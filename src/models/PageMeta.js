export class PageMeta {
    constructor(model = {}) {
        this.seo = model.seo;
        this.title = model.title;
        this.description = model.description;
        this.keywords = model.keywords;
        this.author = model.author;
        this.openGraphMeta = new OpenGraphMeta(model.openGraphMeta || { title: model.title, description: model.description });
        this.pageId = model.pageId;
    }
}

export class OpenGraphMeta {
    constructor(model = {}) {
        this.title = model.title;
        this.image = model.image;
        this.description = model.description;
        this.url = model.url;
        this.siteName = model.siteName;
        this.type = model.type;
    }
}