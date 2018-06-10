import { Person } from './Person';

export class Customer {
    constructor(model = {}) {
        this.customerId = model.customerId;
        this.person = new Person(model.person || {}) || null;
        this.store = null;
        this.territoryId = model.territoryId;
        this.accountNumber = model.accountNumber;
    }
}