export class PhoneNumber {
    constructor(model) {
        this.phoneTypeId = model.phoneTypeId;
        this.phoneType = model.phoneType;
        this.countryCode = model.countryCode;
        this.phoneNumber = model.phoneNumber;
        this.number = model.number;
    }
}

function makeMask(mask) {
    return mask.split(',');
}

export var PhoneNumberMask = {
    'ru': {
        name: 'Россия',
        code: '+7',
        mask: makeMask('(x,x,x), x,x,x, x,x,-x,x'),
        count: 10
    },
    'az': {
        name: 'Азербайджан',
        code: '+994',
        mask: makeMask('x,x,-x,x,x,-x,x,-x,x'),
        count: 9
    },
    'am': {
        name: 'Армения',
        code: '+374',
        mask: makeMask('x,x,-x,x,x,-x,x,x'),
        count: 8
    },
    'by': {
        name: 'Белорусия',
        code: '+375',
        mask: makeMask('(x,x), x,x,x-,x,x,-x,x'),
        count: 9
    },
    'ge': {
        name: 'Грузия',
        code: '+995',
        mask: makeMask('(x,x,x), x,x,x,-x,x,x'),
        count: 9
    },
    'kz': {
        name: 'Казахстан',
        code: '+7',
        mask: makeMask('(x,x,x), x,x,x,-x,x,-x,x'),
        count: 10
    },
    'kg': {
        name: 'Кыргызстан',
        code: '+996',
        mask: makeMask('(x,x,x), x,x,x,-x,x,x'),
        count: 9
    },
    'tj': {
        name: 'Таджикистан',
        code: '+992',
        mask: makeMask('x,x,-x,x,x,-x,x,x,x'),
        count: 9
    },
    'tm': {
        name: 'Туркменистан',
        code: '+993',
        mask: makeMask('x,x,-x,x,-x,x,-x,x'),
        count: 8
    },
    'ua': {
        name: 'Украина',
        code: '+380',
        mask: makeMask('(x,x), x,x,x,-x,x,-x,x'),
        count: 9
    },
    'uz': {
        name: 'Узбекистан',
        code: '+998',
        mask: makeMask('x,x,-x,x,x,-x,x,x,x'),
        count: 9
    }
}