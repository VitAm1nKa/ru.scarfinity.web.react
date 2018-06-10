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