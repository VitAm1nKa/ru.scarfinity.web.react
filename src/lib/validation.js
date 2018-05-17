import update from 'immutability-helper';

const ValidationModel = {
    field: "",
    required: false, 
    maxLength: Number.MAX_VALUE, 
    minLength: -1,
    regexp: null
}

export const validationModel = (model) => Object.assign({}, ValidationModel, model);

const ValidationState = {
    valid: true,
    errors: null
}

const setState = (error) => {
    if(error != null) {
        return {
            valid: false,
            error
        }
    }

    return {valid: true}
}

export const validateModel = (model, validationModel) => {
    var errors = [];

    _.each(validationModel, validator => {
        const validationState = validate(validator.field, model, validationModel);
        if(!validationState.valid) 
            errors = update(errors, {$push: [error]});
    });

    return {
        valid: errors.lenth == 0,
        errors
    }
}

export const validate = (fieldName, model, validationModel) => {
    var error = "";
    const fieldValue = model[fieldName];
    const validator = _.find(validationModel, {field: fieldName});

    if(fieldValue === undefined || validator === undefined) return setState();

    const valueLength = fieldValue.length;

    if(validator.required) {
        if(fieldValue == null || valueLength == 0)
            return setState(`${fieldName}: обязательное поле`);
    }

    if(validator.maxLength) {
        const length = fieldValue.length;
        if(validator.maxLength < length) 
            return setState(`${fieldName}: длинее чем ${validator.maxLength}`);
    }

    if(validator.minLength) {
        const length = fieldValue.length;
        if(validator.minLength > length) 
            return setState(`${fieldName}: короче чем ${validator.minLength}`);
    }

    return setState();
}

function Validate1({value: inputValue, validation}) {
    let valid = null;
    _.each(validation, ({type, value: validationValue}) => {
        switch(type) {
            case 'required': {
                if(validationValue == false) {
                    valid = true
                } else {
                    valid = inputValue.length > 0
                }
            } break;
            case 'min-length': {
                valid = inputValue.length > validationValue;
            } break;
        }
    });

    return valid;
}

const countryPhones = {
    'ru': {
        name: 'Россия',
        code: '+7',
        count: 10
    },
    'az': {
        name: 'Азербайджан',
        code: '+994',
        count: 9
    },
    'am': {
        name: 'Армения',
        code: '+374',
        count: 8
    },
    'by': {
        name: 'Белорусия',
        code: '+375',
        count: 9
    },
    'ge': {
        name: 'Грузия',
        code: '+995',
        count: 9
    },
    'kz': {
        name: 'Казахстан',
        code: '+7',
        count: 10
    },
    'kg': {
        name: 'Кыргызстан',
        code: '+996',
        count: 9
    },
    'tj': {
        name: 'Таджикистан',
        code: '+992',
        count: 9
    },
    'tm': {
        name: 'Туркменистан',
        code: '+993',
        count: 8
    },
    'ua': {
        name: 'Украина',
        code: '+380',
        count: 9
    },
    'uz': {
        name: 'Узбекистан',
        code: '+998',
        count: 9
    }
}

function Validate(inputValue = '', validation) {
    let valid = null;
    _.each(validation, ({type, value: validationValue}) => {
        switch(type) {
            case 'required': {
                valid = (value => {
                    if(value ==  null) return false;
                    if(typeof(inputValue) == 'string' && inputValue.length == 0) return false;
                    return true;
                })(inputValue);
            } break;
            case 'min-length': {
                valid = inputValue.length >= validationValue;
            } break;
            case 'max-length': {
                valid = inputValue.length <= validationValue;
            } break;
            case 'length': {
                valid = inputValue.length == validationValue;
            } break;
            case 'email': {
                var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                valid = regexp.test(inputValue);
            } break;
            case 'regexp': {
                valid = validationValue.test(inputValue);
            } break;
            case 'scope': {
                if(inputValue != null) {
                    valid = inputValue.scope === validationValue;
                } else {
                    valid: false;
                }
            } break;
            case 'phone': {
                valid = false;
                if(inputValue.phoneNumber != null && inputValue.countryCode != null) {
                    const countryPhone = countryPhones[inputValue.countryCode];
                    if(countryPhone != null) {
                        valid = inputValue.phoneNumber.length == countryPhone.count;
                    } 
                }
            }
        }
    });

    return valid;
}

export default Validate;