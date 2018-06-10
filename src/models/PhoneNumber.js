export class PhoneNumber {
    constructor(model) {
        this.phoneTypeId = model.phoneTypeId;
        this.phoneType = model.phoneType;
        this.countryCode = model.countryCode;
        this.phoneNumber = model.phoneNumber;
    }
}