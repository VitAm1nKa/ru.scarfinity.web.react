import { ProductSmall } from './ProductModel';

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
        this.product = new ShoppingCartProduct(model.product || {});
    }
}

export class ShoppingCartProduct extends ProductSmall {
    constructor(model = {}) {
        super(model);
    }
}