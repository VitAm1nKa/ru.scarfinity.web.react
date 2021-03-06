import { ProductCategoryPath }  from './ProductCategory';
import { ImageGallery }         from './ImageGallery';
import { Image }                from './Image';

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
            this.description = 'Dolore occaecat sunt minim officia ea aliqua quis consectetur fugiat Lorem reprehenderit. Consectetur magna nisi aliquip aute nisi ullamco adipisicing quis excepteur.';
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

    get ReviewCollectionId() {
        return this.reviewStats.reviewCollectionId || 0;
    }

    get Path() {
        return `${this.productCategoryPath.path}/${this.productModelNumber}`;
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

//  #region SmallData
export class ProductModelSmall {
    constructor(model = {}) {
        this.id = model.id;
        this.title = model.title;    
        this.catalogPath = model.catalogPath;
        this.image = new Image(model.image);

        this.path = this.path.bind(this);
    }

    path() {
        return `${this.catalogPath}/${this.id}`;
    }
}

export class ProductSmall {
    constructor(model = {}) {
        this.productId = model.productId;
        this.colorCode = model.colorCode;
        this.patternCode = model.patternCode;
        this.title = model.title;
        this.listPrice = model.listPrice;
        this.productModelId = model.productModelId;
        this.image = new Image(model.image || {});
        this.productCategoryPath = model.productCategoryPath;
        this.path = `${this.productCategoryPath}/${this.productModelId}?cl=${this.colorCode}`;
    }
}
//  #endregion