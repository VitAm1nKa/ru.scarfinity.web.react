import { ContactPerson } from './ContactPerson';

export class Store {
    constructor(model = {}) {
        this.businessEntityId = model.businessEntityId;
        this.name = model.name;
        this.contactPerson = new ContactPerson(model.contactPerson || {});
        this.salesPersonId = model.salesPersonId;
    }
}