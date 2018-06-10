export class ProductCategoryBase {
    constructor(model) {
        this.productCategoryId = model.productCategoryId;
        this.seo = model.seo || '';
        this.title = model.title || '';
        this.path = model.path || '';
    }
}

export class ProductSubCategory extends ProductCategoryBase {
    constructor(model) {
        super(model);

        this.productModelCount = model.productModelCount;
    }
}

export class ProductCategory extends ProductSubCategory {
    constructor(model = {}) {
        super(model);

        this.pathChain = new ProductCategoryPathChain(model.pathChain || {});
        this.subCategories = _.map(model.subCategories, subCategory => new ProductSubCategory(subCategory));
        this.colorCodes = _.map(model.colorCodes, value => new ProductCategoryValue(value));
        this.seasons = _.map(model.seasons, value => new ProductCategoryValue(value));
        this.gender = _.map(model.gender, value => new ProductCategoryValue(value));
        this.years = _.map(model.years, value => new ProductCategoryValue(value));
        this.listPrice = new ProductCategoryListPrice(model.listPrice || {});
        this.rating = new ProductCategoryRating(model.rating || {});

        this.getColorCodes = () => _.map(this.colorCodes, value => value.code);
    }

}

export class ProductCategorySchemaNode extends ProductCategoryBase {
    constructor(model) {
        super(model);

        this.nodes = _.map(model.nodes, node => new ProductCategorySchemaNode(node));
        this.NodesCount = () => (this.nodes || []).length;
    }
}

export class ProductCategoryValue {
    constructor(model) {
        this.code = model.code;
        this.count = model.count;
    }
}

export class ProductCategoryRating {
    constructor(model) {
        this.maxAverageRating = model.maxAverageRating || 0;
    }
}

export class ProductCategoryListPrice {
    constructor(model) {
        this.minListPrice = model.minListPrice || 0;
        this.maxListPrice = model.maxListPrice || 0;
    }
}

export class ProductCategoryPath {
    constructor(model) {
        this.seo = model.seo;
        this.title = model.title;
        this.path = model.path;
        this.pathChain = new ProductCategoryPathChain(model.pathChain || {});
    }
}

export class ProductCategoryPathChain {
    constructor(model) {
        this.nodes = _.map(model.nodes, node => new ProductCategoryPathChainNode(node));
    } 
}

export class ProductCategoryPathChainNode {
    constructor(model) {
        this.level = model.level || 0;
        this.seo = model.seo;
        this.title = model.title;
        this.path = model.path;
    }
}