import { Address }  from './Address';
import { Person }   from './Person';
import { Customer } from './Customer';

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
        this.userId = model.userId || 'self';
        this.menagerId = model.menagerId || 1;
        this.shoppingCartId = model.shoppingCartId;
        this.shipMethodId = model.shipMethodId;
        this.paymentMethodId = model.paymentMethodId;
        this.shipToAddress = new Address(model.shipToAddress || {});
        this.billToAddress = new Address(model.billToAddress || {});
        this.person = new Person(model.person || {}); 
        this.customer = new Customer({ person: this.person });
    }
}