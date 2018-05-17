import React    from 'react';
import update   from 'immutability-helper';

import './input-phone.less';
import { PhoneNumber } from '../../store/__models';

function makeMask(mask) {
    return mask.split(',');
}

var masks = {
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

class InputPhoneDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            toggle: false,
            value: this.props.value || ''
        }

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value != null && nextProps.value != this.state.value) {
            this.setState({value: nextProps.value});
        }
    }

    handleFocus(event) {
        this.setState({
            toggle: true
        });
    }

    handleBlur(event) {
        this.setState({
            toggle: false
        })
    }

    componentDidMount() {
        this.container.addEventListener('focus', this.handleFocus, true);
        this.container.addEventListener('blur', this.handleBlur, true);
    }

    componentWillUnmount() {
        this.container.removeEventListener('focus', this.handleFocus);
        this.container.removeEventListener('blur', this.handleBlur);
    }

    render() {
        return (
            <div className={`input-phone-dropdown`} ref={container => {this.container = container}}>
                <input 
                    className={`input-phone-dropdown__input f-${this.props.countryCode}`}
                    value={this.state.value}
                    readOnly={true}/>
                        {
                            this.state.toggle && this.props.options.length > 0 &&
                            <div
                                className={`input-phone-dropdown__options-container`}
                                tabIndex="0">
                                    {_.map(this.props.options, option =>
                                        <div
                                            key={option.id}
                                            data-code={option.value.code}
                                            className={`input-phone-dropdown__options-container__item f-${option.id}`}
                                            onMouseDownCapture={() => {this.props.onSelect(option.id)}}>
                                                {option.value.name}
                                        </div>
                                    )}
                            </div>
                        }
            </div>
        );
    }
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        // В качестве занчения для этого елементра управления передается пременная класса PhoneNumber
        this.state = {
            value: this.props.value.phoneNumber || '',
            countryCode: this.props.value.countryCode || 'ru',
            lastKey: '',
            lastKeyCode: -1
        }

        this.masksArray = _.toPairs(masks);

        this.clear = this.clear.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.setStateCallback = this.setStateCallback.bind(this);
    }

    componentWillMount() {
        this.state.value = this.clear(this.state.value);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value != null) {
            this.setState({
                value: this.clear(nextProps.value.phoneNumber || ''),
                countryCode: nextProps.value.countryCode || 'ru'
            });
        }
    }
    
    mapper(value, digit) {
        return value.replace(/\x/g, (m,n) => digit);
    }

    decorate(value, countryCode = 'ru') {
        return _.reduce(this.state.value, (sum, digit, index) => {
            return sum + this.mapper(masks[countryCode].mask[index], digit);
        }, '');
    }

    clear(value, countryCode) {
        return (value.replace(new RegExp(/[^\d]/, 'g'), '')).substring(0, masks[countryCode || this.state.countryCode].count);
    }

    setStateCallback(options) {
        this.setState(options, () => {
            if(this.props.onChange != null) {
                // Необходимо вернуть объект, унифицированный с объектами инпутов
                // Для корректной работы аккумулятора данных
                this.props.onChange({
                    target: {
                        name: this.props.name,
                        value: update(this.props.value, {$merge: {
                            phoneNumber: this.state.value,
                            countryCode: this.state.countryCode
                        }})
                    }
                });
            }
        });
    }

    handleChange(event) {
        const initialValue = event.target.value;
        let value = this.clear(initialValue);
        if(this.state.value == value && value.length > 0) {
            if(this.state.lastKey == 'Backspace' || this.state.lastKeyCode == 8) {
                // Была нажата клавища Backspace, но удаление не произошло
                const caret = event.target.selectionStart;
                if(caret > 1) {
                    const leftPart = initialValue.substring(0, Math.max(caret - 1, 0));
                    const rightPart = initialValue.substring(caret);
                    value = this.clear(`${leftPart}${rightPart}`);
                }
            }
        }

        this.setStateCallback({value});
    }

    handleKeyDown(event) {
        this.setState({
            lastKey: event.nativeEvent.key,
            lastKeyCode: event.nativeEvent.keyCode
        })
    }

    handleTypeChange(countryCode) {
        if(this.state.countryCode != countryCode) {
            this.setStateCallback({
                countryCode: countryCode,
                value: this.clear(this.state.value, countryCode)
            });
        }
    }

    render() {
        return(
            <div className={`input-phone${
                this.props.valid == true ? " input-phone--success" :
                this.props.valid == false ? " input-phone--error" : ""}`}>
                    <InputPhoneDropdown
                        options={_.map(this.masksArray, m => ({id: m[0], value: m[1]}))}
                        value={masks[this.state.countryCode].code}
                        countryCode={this.state.countryCode}
                        onSelect={this.handleTypeChange}/>
                    <input
                        className='input-phone__input'
                        name={this.props.name}
                        placeholder={this.props.placeholder}
                        disabled={this.props.disabled}
                        readOnly={this.props.readonly}
                        type='tel'
                        value={this.decorate(this.state.value, this.state.countryCode)}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}/>
            </div>
        )
    }
}
Controller.defaultProps = {
    value: new PhoneNumber({
        phoneNumber: '',
        countryCode: 'ru',
        phoneTypeId: 1,
        phoneType: ''
    }),
    onChange: () => {}
}

export default Controller;
