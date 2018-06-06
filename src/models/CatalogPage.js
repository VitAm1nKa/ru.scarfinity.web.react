import { PathChain } from "./PathChain";

export class CatalogPageBase {
    constructor(model) {
        this.catalogPageId = model.catalogPageId;
        this.seo = model.seo || '';
        this.title = model.title || '';
        this.path = model.path || '';
    }
}

export class CatalogSubPage extends CatalogPageBase {
    constructor(model) {
        super(model);

        this.productModelCount = model.productModelCount;
    }
}

export class CatalogPageValues {
    constructor(model) {
        this.values = model;
        this._codes = null;
        this._values = null;
    }

    get Values() {
        if(this._values = null) {
            this._values = _.map(this.values, value => value); 
        }

        return this._values;
    }

    get Codes() {
        if(this._codes == null) {
            this._codes = _.map(this.values, value => value.code);
        }

        return this._codes;
    }
}

export class CatalogPageInfo {
    constructor(model) {
        this.productModelCount = model.productModelCount || 0;
        this.minListPrice = model.minListPrice || 0;
        this.maxListPrice = model.maxListPrice || 0;
        this.maxAverageRating = model.maxAverageRating || 0;
        this.catalogSubPages = _.map(model.catalogSubPages, subPage => new CatalogSubPage(subPage));
        this.colorCodes = new CatalogPageValues(model.colorCodes);
        this.patternCodes = new CatalogPageValues(model.patternCodes);
        this.seasons = new CatalogPageValues(model.seasons);
        this.sexes = new CatalogPageValues(model.sexes);
        this.years = new CatalogPageValues(model.years);
    }

    get ColorCodes() {
        return this.colorCodes.Codes;
    }

    get PatternCodes() {
        return this.patternCodes.Codes;
    }

    get Seasons() {
        return this.seasons.Values;
    }
}

export class CatalogPage extends CatalogPageBase {
    constructor(model = {}) {   
        super(model);

        this.pathChain = new PathChain(model.pathChain || {});
        this.catalogPageInfo = new CatalogPageInfo(model.catalogPageInfo || {});
    }
}