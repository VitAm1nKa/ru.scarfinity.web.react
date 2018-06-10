import { Person } from './Person';

export class ContactPerson {
    constructor(model = {}) {
        this.businessEntityId = model.businessEntityId;
        this.contactTypeId = model.contactTypeId;
        this.contactType = model.contactType;
        this.person = new Person(model.person || {});
    }
}