import { EmailAddress } from './EmailAddress';
import { PhoneNumber }  from './PhoneNumber';

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