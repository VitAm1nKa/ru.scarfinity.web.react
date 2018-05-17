import { DateFormat }   from '../lib/datetime';
import update           from 'immutability-helper';

export class Shop {
    constructor(model = {}) {
        this.shopId = model.shopId;
        this.title = model.title;
        this.email = model.email;
        this.workPlan = model.workPlan;
        this.address = new Address(model.address || {});
        this.phones = _.map(model.phones, phone => new PhoneNumber(phone));
    }
}

// -- Pricing and Units
export class Unit {
    constructor(model = {}) {
        this.title = '';
        this.size = 1;
    }
}

export class Price {
    constructor(model = {}) {
        this.original = model.retail || 0;
        this.sale = 0;
        this.unit = new Unit();
        this.value = this.value.bind(this);
    }

    value() {
        return this.sale || this.original;
    }
}

export class CatalogPath {
    constructor(model = {}) {
        this.path = model.path;
    }
}

// -- Shipping and Cart asn Person ...
export class ShipMethod {
    constructor(model) {
        this.id = model.shipMethodId;
        this.title = model.title;
        this.shipBase = model.shipBase;
        this.deliveryDue = model.deliveryDue;
    }
}

export class ShipToAddress {
    constructor(model = {}) {
        this.country = model.country || "";
        this.city = model.city;
        this.address = model.address;
        this.house = model.house || "";
        this.apartments = model.apartments || "";

        this.getCity = this.getCity.bind(this);
    }

    getCity() {
        if(this.city != null && this.city.scope == 'GOOGLE') {
            return this.city.formatted_address;
        }

        return this.city;
    }

    getAddress() {
        if(this.address != null && this.address.scope == 'GOOGLE') {
            return this.address.formatted_address;
        }

        return this.address;
    }
}

export class Address {
    constructor(model = {}) {
        this.addressLine1 = model.addressLine1;
        this.addressLine2 = model.addressLine2;
        this.side = model.side;
        this.city = model.city;
        this.stateProvinceId = model.stateProvinceId;
        this.postalCode = model.postalCode;
        this.location = new Location(model.location || {});
    }
}

export class Location {
    constructor(model = {}) {
        this.lat = model.lat || 0.00;
        this.lng = model.lng || 0.00;
    }
}

// -- Person

export class PhoneNumber {
    constructor(model) {
        this.phoneTypeId = model.phoneTypeId;
        this.phoneType = model.phoneType;
        this.countryCode = model.countryCode;
        this.phoneNumber = model.phoneNumber;
    }
}

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

function downloadImage(url, callback) {
    let path = `http://192.168.1.198:55139/${url}`;
    if(url[0] != 'u')
        path = url;

    fetch(path, {mode: 'cors'})
    .then(response => response.blob())
    .then(blob => {
        if(callback != null)
            callback(blob)
    })
}

// -- Image and Gallery
export class Image {
    constructor(props = {}, index = 0) {
        this.id = props.id;
        this.preview = props.path;
        this.main = props.path;
        this.index = index;

        this.getPreview = this.getPreview.bind(this);
        this.getMain = this.getMain.bind(this);

        this.previewBlob = null;
        this.previewImage = null;
        this.previewImageUrl = '';
        this.previewBlobFetch = false;
        this.mainBlob = null;
        this.mainImage = null;
        this.mainImageUrl = '';
        this.mainBlobFetch = false;
    }

    get Preview() {
        return {
            blob: this.previewBlob,
            image: this.previewImage,
            imageSrc: this.previewImageUrl,
            fetch: this.previewBlobFetch,
            error: this.previewBlob == null && this.previewBlobFetch == false
        }
    } 

    loadPreview(callback) {
        if(this.previewBlob == null) {
            if(this.preview != '') {
                this.previewBlobFetch = true;
                downloadImage(this.preview, blob => {
                    if(blob != null) {
                        this.previewBlob = blob;
                        this.previewImageUrl = URL.createObjectURL(blob)
                        this.previewBlobFetch = false;
                        if(callback)
                            callback(this.Preview)
                    }
                })
            }
        }

        if(callback) {
            callback(this.Preview);
        }
    }

    get Main() {
        if(this.mainBlob == null) {
            if(this.main != '') {
                this.mainBlobFetch = true;
                downloadImage(this.main, blob => {
                    if(blob != null) {
                        this.mainBlob = blob;
                        this.mainImageUrl = URL.createObjectURL(blob)
                        this.mainBlobFetch = false
                    }
                })
            }
        }

        return {
            blob: this.mainBlob,
            image: this.mainImage,
            imageSrc: this.mainImageUrl,
            fetch: this.mainBlobFetch,
            error: this.mainBlob == null && this.mainBlobFetch == false
        }
    }

    getPreview() {
        if(this.preview != null) {
            if(this.preview[0] == 'u')
                return `http://192.168.1.198:55139/${this.preview}`;

            return this.preview
        }

        return 'http://192.168.1.198:55139/uploads/tmp/scarf-3.jpg';
    }

    getMain() {
        if(this.main != null) {
            if(this.main[0] == 'u')
                return `http://192.168.1.198:55139/${this.main}`;

            return this.main;
        }

        return 'http://192.168.1.198:55139/uploads/tmp/scarf-3.jpg';
    }
}

export class ImageGallery {
    constructor(props = {}) {
        this.id = props.id;
        this.images = _.map(props.images, (image, index) => new Image(image, index));

        this.chain = this.chain.bind(this);
        this.thumbnail = this.thumbnail.bind(this);
        this.getImageById = this.getImageById.bind(this);
    }

    get Count() {
        return this.images.length || 0;
    }

    chain(imageId) {
        // Получение информации о запрашиваемом изображении
        // Так же вовращение id предыдущего и следующего изображения
        const currentImage = _.find(this.images, i => i.id == imageId);
        if(currentImage != null) {
            const count = this.Count;
            const index = currentImage.index;
            return {
                image: currentImage,
                prevId: this.images[(index + count - 1) % count].id,
                nextId: this.images[(index + 1) % count].id
            }
        }

        return null;
    }

    thumbnail() {
        return (_.first(this.images) || new Image()).getPreview();
    }

    getImageById(imageId) {
        return _.find(this.images, i => i.id == imageId) || new Image();
    }

    getImage(index) {
        const image = this.images[index];
        if(image != null) {
            return image;
        }

        return new Image();
    }
}

// -- Product Info
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
    
        this.price = new Price(model.price);
        this.ribbon = 'sale';
        this.inFavorite = false;

        this.products = _.map(model.products, product => new Product(product));

        //
        this.userProductModelPreferences = new UserProductModelPreferences(model.userProductModelPreferences || {});
        this.userProductModelCartStat = new UserProductModelCartStat(model.userProductModelCartStat || {});

        // Methods
        this.path = () => `${this.productCategoryPath.path}/${this.productModelId}`;

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

export class ProductModelReviewStats {
    constructor(model) {
        this.reviewCollectionId = model.reviewCollectionId;
        this.averageRating = model.averageRating;
        this.reviewsCount = model.reviewsCount;
    }
}

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

// -- Catalog
export class CatalogPage {
    constructor(props = {}) {   
        this.id = props.id;
        this.title = props.title || '';
        this.path = props.path || '';
        this.productsCount = props.productsCount || 0;
        this.minWholesale = props.minWholesale || 0;
        this.maxWholesale = props.maxWholesale || 0;
        this.minRetail = props.minRetail || 0;
        this.maxRetail = props.maxRetail || 0;
        this.colorCodes = props.colorCodes || [];
        this.seasonsCodes = props.seasonsCodes || [];
        this.nodes = props.nodes || [];
        this.minPrice = props.minRetail || 0;
        this.maxPrice = props.maxRetail || 0;

        this.getColorCodes = this.getColorCodes.bind(this);
        this.getNormalPath = this.getNormalPath.bind(this);
    }

    getNormalPath() {
        return _.join(_.tail(this.path.substr(1).split('/')), '/');
    }

    getNodes() {
        const subCatalogs = _.map(this.nodes, (subCatalog) => {
            const info = new CatalogPage(subCatalog);
            return {
                id: info.id,
                title: info.title,
                path: info.path,
                productsCount: info.productsCount
            }
        });

        return subCatalogs;
    }

    getColorCodes() {
        return _.map(this.colorCodes, info => info.code);
    }
}

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

export class CatalogFiltersCollection {
    constructor(model = {}) {
        // Инфо каталога
        this.catalogIds = [];
        this.itemsOnPage = 20;
        this.itemsOnPageValues = [20, 60, 100];
        this.rating = 0;
        this.ratingDefault = 0;
        this.colorCodes = [];
        this.colorCodesDefault = [];
        this.seasonsCodes = [];
        this.sortByItems = [
            { id: 0, title: 'По новизне' },
            { id: 1, title: 'По популярности' },
            { id: 2, title: 'По алфавиту' },
            { id: 3, title: 'По цене' }
        ];
        this.sortById = 1;
        this.sortByDesc = false;
        this.pricePerItemFrom = 0;
        this.pricePerItemTo = 0;
    }
}

// ShoppingCart
export class ShoppingCart {
    constructor(model = {}) {
        this.shoppingCartId = model.shoppingCartId;
        this.creationDate = model.creationDate;
        this.lastModified = model.lastModified;
        this.userId = model.userId;
        this.userStatusId = model.userStatusId;
        this.subTotal = model.subTotal;
        this.lines = _.map(model.lines, line => new ShoppingCartLine(line));

        this.getProductQuantity = this.getProductQuantity.bind(this);
    }

    getProductQuantity(productId) {
        const line = _.find(this.lines, line => line.product.productId == productId);
        if(line)
            return line.quantity;

        return 0;
    }
}

export class ShoppingCartLine {
    constructor(model = {}) {
        this.quantity = model.quantity;
        this.lineTotal = model.lineTotal;
        this.product = new ProductSmall(model.product || {});
    }
}

export class ShoppingCartProduct extends ProductSmall {
    constructor(model = {}) {
        super(model);
    }
}

// -- SalesOrder
export class PhoneType {
    constructor(model = {}) {
        this.phoneTypeId = model.phoneTypeId;
        this.phoneType = model.phoneType;
        this.phoneNumber = model.phoneNumber;
    }
}

export class EmailAddress {
    constructor(model = {}) {
        this.emailAddressId = model.emailAddressId;
        this.emailAddress = model.emailAddress;
    }
}

export class Person {
    constructor(model = {}) {
        this.businessEntityId = model.businessEntityId;
        this.personType = model.personType;
        this.firstName = model.firstName || '';
        this.lastName = model.lastName || '';
        this.emailAddress = new EmailAddress(model.emailAddress || {});
        this.phoneNumber = new PhoneNumber(model.phoneNumber || {});
    }
}

export class ContactPerson {
    constructor(model = {}) {
        this.businessEntityId = model.businessEntityId;
        this.contactTypeId = model.contactTypeId;
        this.contactType = model.contactType;
        this.person = new Person(model.person || {});
    }
}

export class Store {
    constructor(model = {}) {
        this.businessEntityId = model.businessEntityId;
        this.name = model.name;
        this.contactPerson = new ContactPerson(model.contactPerson || {});
        this.salesPersonId = model.salesPersonId;
    }
}

export class Customer {
    constructor(model = {}) {
        this.customerId = model.customerId;
        this.person = new Person(model.person || {}) || null;
        this.store = null;
        this.territoryId = model.territoryId;
        this.accountNumber = model.accountNumber;
    }
}

export class SalesOrder {
    constructor(model = {}) {
        this.salesOrderId = model.salesOrderId;
        this.orderDate = model.orderDate;
        this.salesOrderNumber = model.salesOrderNumber;
        this.orderStatus = new OrderStatus(model.orderStatus || {});
        this.shipToAddress = new Address(model.shipToAddress || {});
        this.billToAddress = new Address(model.billToAddress || {});
        this.orderInfo = new OrderInfo(model.orderInfo || {});
        this.orderDetail = _.map(model.orderDetail, orderLine => new OrderLine(orderLine));

        this.productsCount = this.productsCount.bind(this);
    }

    productsCount() {
        return _.reduce(this.orderDetail, (sum, orderLine) => {
            orderLine.orderQty + n;
        }, 0);
    }
}

export class OrderStatus {
    constructor(model = {}) {
        this.statusId = model.statusId;
        this.title = model.title;
    }
}

export class OrderLine {
    constructor(model = {}) {
        this.productId = model.productId;
        this.orderQty = model.orderQty;
        this.unitPrice = model.unitPrice;
        this.unitPriceDiscount = model.unitPriceDiscount;
        this.lineTotal = model.lineTotal;
        this.product = new ProductSmall(model.product || {});
    }
}

export class OrderInfo {
    constructor(model = {}) {
        this.subTotal = model.subTotal || 0;
        this.totalDue = model.totalDue || 0;
        this.taxAmt = model.taxAmt || 0;
        this.freight = model.freight || 0;
    }
}

export class SalesOrderPost {
    constructor(model = {}) {
        this.orderType = model.orderType;
        this.userId = model.userId;
        this.menagerId = model.menagerId;
        this.shoppingCartId = model.shoppingCartId;
        this.shipMethodId = model.shipMethodId;
        this.paymentMethodId = model.paymentMethodId;
        this.shipToAddress = new Address(model.shipToAddress || {});
        this.billingAddress = new Address(model.billingAddress || {});
        this.person = new Person(model.person || {}); 
        this.customer = new Customer({ person: this.person });
    }
}

//  --  OLD ORDER
export class Order {
    constructor(model = {}) {
        this.id = model.id;
        this.creationDate = model.creationDate || null;
        this.lastModified = model.lastModified || null;
        this.userId = model.userId || '';
        this.orderStatusId = model.orderStatusId || 0;
        this.items = _.map(model.items, item => new OrderItem(item));

        this.subtotal = this.subtotal.bind(this);
        this.count = this.count.bind(this);
    }

    count() {
        return this.items.length;
    }

    subtotal() {
        // Подитог суммы товаров
        const productsSubtotal = _.reduce(this.items, (sum, item) => item.total() + sum, 0);

        // Скидки и прочие модификаторы цены
        // Доставка и тп..

        return new Price({
            original: productsSubtotal,
            sale: 0
        });
    }
}

export class OrderItem {
    constructor(model = {}) {
        this.productId = model.productId;
        this.quantity = model.quantity;
        this.productModel = new ProductModel(model.productModel);

        this.total = this.total.bind(this);
    }

    total() {
        return new Price({original: this.productModel.price.value() * this.quantity});
    }
}

export function CartItem(model = {}) {
    this.id = model.id || -1;
    this.quantity = model.quantity || 0;
    this.productInfo = new CartProduct(model.productInfo);
    this.price = new Price(model.price);
}

export function CartProduct(model = {}) {
    this.title = model.title || "";
    this.colorCode = model.colorCode || '';
    this.patternCode = model.patternCode || '';
    this.imageGallery = new ImageGallery(model.imageGallery);
}

//  -----------------------------------------------------------
//  Review, ReviewCollection

export class Review {
    constructor(model = {}) {
        this.reviewCollectionItemId = model.reviewCollectionItemId;
        this.reviewCollectionId = model.reviewCollectionId;
        this.userId = model.userId;
        this.addedDate = model.addedDate;
        this.title = model.title || '';
        this.subject = model.subject || '';
        this.body = model.body || '';
        this.rating = model.rating || 0;

        this.getAddedDate = this.getAddedDate.bind(this);
    }

    getAddedDate() {
        return (new Date(this.addedDate)).toLocaleDateString();
    }
}

export class ReviewCollection {
    constructor(model = {}) {
        this.reviewCollectionId = model.reviewCollectionId;
        this.productModelId = model.productModelId;
        this.averageRating = model.averageRating;
        this.reviewsCount = model.reviewsCount;
        this.reviews = _.map(model.reviews, review => new Review(review));

        this.getReviewPage = this.getReviewPage.bind(this);
    }

    getReviewPage(currentPage, chunkSize = 3) {
        if(this.reviews.length > 0) {
            const reviewsChunked = _.chunk(this.reviews, chunkSize);
            return {
                reviews: reviewsChunked[currentPage - 1],
                pagesCount: reviewsChunked.length,
            }
        }
    }
}