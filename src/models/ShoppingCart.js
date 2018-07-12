import { ProductSmall } from './ProductModel';

export class ShoppingCart {
    constructor(model) {
        model = model || {};
        this.shoppingCartId = model.shoppingCartId;
        this.creationDate = model.creationDate;
        this.lastModified = model.lastModified;
        this.userId = model.userId;
        this.userStatusId = model.userStatusId;
        this.subTotal = model.subTotal || 0;
        this.lines = _.map(model.lines, line => new ShoppingCartLine(line));
    }

    static getProductQuantity(shoppingCart, productId) {
        if(shoppingCart != null) {
            const line = _.find(shoppingCart.lines, line => line.product.productId == productId);
            if(line)
                return line.quantity;
        }

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