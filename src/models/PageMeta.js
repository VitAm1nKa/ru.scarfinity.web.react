import { MetaTag } from './MetaTag';

export class PageMeta {
    constructor(model = {}) {
        this.title = model.title;
        this.metaTags = _.map(model.metaTags, tag => new MetaTag(tag));
        this.pageId = model.pageId;
    }
}