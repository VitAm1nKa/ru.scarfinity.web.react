import { ProductCategoryPath }  from './ProductCategory';
import { ImageGallery }         from './ImageGallery';

export class UserProductModelPreferences {
    constructor(model = {}) {
        this.productModelId = model.productModelId;
        this.inFavorite = model.inFavorite;
        this.inWish = model.inWish;
    }
}

export class UserProductModelCartStat {
    constructor(model = {}) {
        this.inCart = model.inCart;
        this.quantity = model.quantity;
    }
}

export class ProductModelReviewStats {
    constructor(model) {
        this.reviewCollectionId = model.reviewCollectionId;
        this.averageRating = model.averageRating;
        this.reviewsCount = model.reviewsCount;
    }
}

export class Product {
    constructor(props = {}) {
        this.productId = props.productId;
        this.colorCode = props.colorCode || '';
        this.patternCode = props.patternCode || '';
        this.imageGallery = new ImageGallery(props.imageGallery || {});
    }
}

export class ProductModel {
    constructor(model = {}) {
        try {
            this.productModelId = model.productModelId;
            this.productModelNumber = model.productModelNumber;
            this.title = model.title || '';
            this.description = model.description || '';
            this.seo = model.seo || '';
            this.seoDescription = model.seoDescription || '';
            this.listPrice = model.listPrice || 0;
            this.productCategoryPath = new ProductCategoryPath(model.productCategoryPath || {});
            
            this.reviewStats = new ProductModelReviewStats(model.reviewStats || {});
            this.imageUrl = '';
        
            // this.price = new Price(model.price);
            this.ribbon = 'sale';
            this.inFavorite = false;

            this.products = _.map(model.products, product => new Product(product));

            //
            this.userProductModelPreferences = new UserProductModelPreferences(model.userProductModelPreferences || {});
            this.userProductModelCartStat = new UserProductModelCartStat(model.userProductModelCartStat || {});
        }
        catch(ex) { console.error('Product Model fetch error: ' + ex); }

        // Methods
        this.path = () => `${this.productCategoryPath.path}/${this.productModelNumber}`;

        this.selectedProduct = this.selectedProduct.bind(this);
        this.path = this.path.bind(this);
        this.thumbnail = this.thumbnail.bind(this);
        this.colorCodes = this.colorCodes.bind(this);
        this.patternCodes = this.patternCodes.bind(this);
        this.firstProduct = this.firstProduct.bind(this);
        this.getProduct = this.getProduct.bind(this);
    }

    selectedProduct(filter) {
        const byFilter = _.find(this.products, p => p.colorCode == filter.colorCode);
        if(byFilter)
            return byFilter;
        
        const byFirst = _.first(this.products);
        if(byFirst)
            return byFirst;

        return new Product();
    }

    thumbnail(productId) {
        const index = _.findIndex(this.products, x => x.id == productId);
        return (this.products[Math.max(0, index)] || new Product()).imageGallery.thumbnail();
    }

    colorCodes() {
        return _.map(this.products, product => product.colorCode);
    }

    patternCodes() {
        return _.map(this.products, product => product.patternCode);
    }

    firstProduct() {
        const product = _.first(this.products);
        if(product != null) {
            return product;
        }

        return new Product();
    }

    getProduct(id) {
        const product = _.find(this.products, x => x.id === id);
        if(product != null) {
            return product;
        }

        return new Product();
    }
}