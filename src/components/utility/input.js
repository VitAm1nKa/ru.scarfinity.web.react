import React from 'react';

import './input.less';

export const Input = {
    Basic: (props) => {
        return (
            <BasicInput
                {...props}
                value={props.model[props.field] || ""}
                error={props.valid == null ? false : !props.valid}
                success={props.valid == null ? false : props.valid}
                onChange={e => {props.onChange(e, props.field)}}/>
        )
    },
    TextArea: (props) => {
        return(
            <TextArea
                {...props}
                error={props.valid == null ? false : !props.valid}
                success={props.valid == null ? false : props.valid}
                value={props.model[props.field] || ""}
                onChange={e => {props.onChange(e, props.field)}}/>
        )
    }
}

export const BasicInput = (props) => {
    const className = `sInput${
        props.valid == true ? " sInput--success" :
        props.valid == false ? " sInput--error" : ""
    }`;
    return(
        <input
            className={className}
            type={props.type}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            disabled={props.disabled}
            readOnly={props.readonly}/>
    )
}

export const TextArea = (props) => {
    return(
        <textarea
            style={{
                resize: 'vertical',
                maxHeight: 320,
                minHeight: 43
            }}
            className={`sInput${
                props.success   ? " sInput--success" : 
                props.error     ? " sInput--error"   :
                props.search    ? " sInput--search"  : ""
            }`}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder || ""}
            ref={props.inputRef}></textarea>
    )
}

export class NameInput extends React.Component {
    //- Getter -----------------------------------------------------------------------------------------------
        value() { return this.input.value }
    //- ------------------------------------------------------------------------------------------------------
    constructor(props) {
        super(props);

        this.state = Object.assign({}, props, {
            valid: false,
            validate: false,
        });

        this.doValidate = this.doValidate.bind(this);

        this.value = this.value.bind(this);
    }

    doValidate() {
        this.state.valid = this.valid();
        this.setState({validate: true});
        return this.state.valid;
    }

    valid() {
        const rej = /^[a-zа-я ,.'-]+$/i;
        return rej.test(this.input.value);
    }

    validate() {
        this.setState({
            valid: this.valid()
        }, () => {
            if(this.state.onValidate) this.state.onValidate(this.state.valid);
            return this.state.valid;
        });
    }

    handleInput() {
        this.validate();
    }

    render() {
        return(
            <input
                className={`sInput${
                    this.state.valid                            ? " sInput--success" : 
                    !this.state.valid && this.state.validate    ? " sInput--error"   : ""
                }`}
                type="text"
                placeholder={this.state.placeholder}
                disabled={this.state.disabled}
                onInput={this.handleInput.bind(this)}
                ref={input => this.input = input}/>
        )
    }
}

export class EmailInput extends React.Component {
    //- Getter -----------------------------------------------------------------------------------------------
        value() { return this.input.value }
    //- ------------------------------------------------------------------------------------------------------
    constructor(props) {
        super(props);

        this.state = Object.assign({}, props, {
            valid: false,
            validate: false,
        });

        this.doValidate = this.doValidate.bind(this);

        this.value = this.value.bind(this);
    }

    doValidate() {
        this.state.valid = this.valid();
        this.setState({validate: true});
        return this.state.valid;
    }

    validate() {
        this.setState({
            valid: this.valid(),
        }, () => {
            if(this.state.onValidate) this.state.onValidate(this.state.valid);
            return this.state.valid;
        });
    }

    valid() {
        const rej = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return rej.test(this.input.value);
    }

    handleInput() {
        this.validate();
    }

    render() {
        return(
            <input
                className={`sInput${
                    this.state.valid                            ? " sInput--success" : 
                    !this.state.valid && this.state.validate    ? " sInput--error"   : ""
                }`}
                type="email"
                placeholder="E-mail"
                disabled={this.state.disabled}
                onInput={this.handleInput.bind(this)}
                ref={input => this.input = input}/>
        )
    }
}

export class PhoneInput extends React.Component {
    //- Getter -----------------------------------------------------------------------------------------------
        value() { return this.state.values.join('') }
    //- ------------------------------------------------------------------------------------------------------
    constructor(props) {
        super(props);

        this.state = Object.assign({}, props, {
            values: [],
            digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            controls: ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"],
            numbers: [0, 0, 1, 2, 3, 3, 3, 4, 5, 6, 6, 7, 8, 8, 9],
            numbersCaret: [5, 5, 6, 9, 10, 10, 10, 11, 13, 14, 14, 16, 17, 17, 18],
            backspace: [0, 1, 2, 2, 2, 3, 4, 5, 5, 6, 7, 7, 8, 9],
            backspaceCaret: [4, 5, 6, 6, 6, 9, 10, 11, 11, 13, 14, 14, 16, 17],
            delete: [0, 0, 1, 2, 3, 3, 3, 4, 5, 6, 6, 7, 8, 8, 9],
            flag: false,
            valid: false,
            validate: false,
        });

        this.doValidate = this.doValidate.bind(this);
        this.value = this.value.bind(this);
    }

    insertIntoArray(array, index, value) {
        return [...array.slice(0, index), value, ...array.slice(index, array.length)];
    }

    removeFromArray(array, index) {
        return [...array.slice(0, index), ...array.slice(index + 1, array.length)];
    }

    doValidate() {
        this.state.valid = this.valid();
        this.setState({validate: true});
        return this.state.valid;
    }

    valid() {
        return this.state.values.length === 10;
    }

    validate() {
        if(this.state.valid != this.valid()) {
            this.setState({
                valid: !this.state.valid,
            }, () => {
                if(this.state.onValidate) this.state.onValidate(this.state.valid);
                return this.state.valid;
            });
        }
    }

    updateValue(count) {
        const base = "+7 ";
        switch(count) {
            case 0: return base;
            case 1:
            case 2: return `${base}(${this.state.values.slice(0, count).join('')}`;
            case 3: return `${base}(${this.state.values.slice(0, count).join('')}) `;
            case 4:
            case 5: return `${this.updateValue(3)}${this.state.values.slice(3, count).join('')}`;
            case 6: return `${this.updateValue(3)}${this.state.values.slice(3, count).join('')} `;
            case 7: return `${this.updateValue(6)}${this.state.values.slice(6, count).join('')}`;
            case 8: return `${this.updateValue(6)}${this.state.values.slice(6, count).join('')}-`;
            case 9: 
            case 10: return `${this.updateValue(8)}${this.state.values.slice(8, count).join('')}`;
        }
    }

    handlePaste(event) {
        event.stopPropagation();
        event.preventDefault();
        return false;
    }

    handleFocus(event) {
        if(!this.state.flag) {
            this.setState({
                flag: true,
            }, () => {
                this.input.value = this.updateValue(this.state.values.length);
            })
        }
    }

    handleBlur(event) {
        if(this.state.values.length == 0) {
            this.setState({
                flag: false
            }, () => {
                this.input.value = "";
            });
        }
    }

    handleKeyDown(event) {
        if(this.state.digits.indexOf(event.nativeEvent.key) !== -1 && this.state.values.length < 10) {
            event.stopPropagation();
            event.preventDefault();

            const caret = this.input.selectionStart;

            if(caret >= 3) {
                this.state.values = this.insertIntoArray(this.state.values, this.state.numbers[caret - 3], Number(event.nativeEvent.key));
                this.input.value = this.updateValue(this.state.values.length);
                this.input.selectionStart = this.state.numbersCaret[caret - 3];
                this.input.selectionEnd = this.state.numbersCaret[caret - 3];
            }

        } else if(this.state.controls.indexOf(event.nativeEvent.key) !== -1) {
            switch(event.nativeEvent.key) {
                case 'Backspace': {
                    event.stopPropagation();
                    event.preventDefault();
    
                    const caret = this.input.selectionStart;
    
                    if(caret >= 5) {
                        this.state.values = this.removeFromArray(this.state.values, this.state.backspace[caret - 5]);
                        this.input.value = this.updateValue(this.state.values.length);
                        this.input.selectionStart = this.state.backspaceCaret[caret - 5];
                        this.input.selectionEnd = this.state.backspaceCaret[caret - 5];
                    }

                    return false;
                }
                case 'Delete': {
                    event.stopPropagation();
                    event.preventDefault();
        
                    const caret = this.input.selectionStart;
        
                    if(caret >= 3) {
                        this.state.values = this.removeFromArray(this.state.values, this.state.delete[caret - 3], Number(event.nativeEvent.key));
                        this.input.value = this.updateValue(this.state.values.length);
                        this.input.selectionStart = caret;
                        this.input.selectionEnd = caret;
                    }
                    return false;
                } break;
                default: return true;
            }
        }

        event.stopPropagation();
        event.preventDefault();
        // return false;
    }

    handleSubmit(event) {}

    render() {
        const className = `sInput-phone${
            this.props.valid == true ? " sInput-phone--success" :
            this.props.valid == false ? " sInput-phone--error" : ""
        }${
            this.state.flag ? " sInput-phone--flag": ""
        }`;

        return(
            <input
                className={className}
                type="tel"
                name={this.props.name}
                placeholder={this.props.placeholder}
                disabled={this.props.disabled}
                readOnly={this.props.readonly}
                value={this.props.value}
                onPaste={this.handlePaste.bind(this)}
                onFocus={this.handleFocus.bind(this)}
                onBlur={this.handleBlur.bind(this)}
                onSubmit={this.handleSubmit.bind(this)}
                onKeyDown={this.handleKeyDown.bind(this)}
                onKeyUp={this.props.onChange}
                ref={input => this.input = input}/>
        )
    }
}

export class SearchInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, props, {
            options: [],
            optionsIndex: -1,
            currentOption: null,
            showOptions: false,
            wrap: false,
            inputValue: "",
            preSelectIndex: -1,
            searchLimit: 5,
            valid: false,
            validate: false,
            warning: false,
        });

        this.doValidate = this.doValidate.bind(this);
    }

    inputValue() {
        if(this.state.optionsIndex == -1) {
            return this.state.inputValue;
        } else {
            if(this.state.city) {
                return this.state.options[this.state.optionsIndex].name;
            } else if(this.state.street) {
                const option = this.state.options[this.state.optionsIndex];
                if(option.contentType == "street") {
                    return option.name;
                } else if(option.contentType == "building") {
                    const streetInfo = option.parents.filter(x => x.contentType == "street");
                    if(streetInfo && streetInfo.length > 0) {
                        return `${streetInfo[0].name} ${option.name}`;
                    }
                }
            }
        }
    }

    currentOptionValue() {
        if(this.state.optionsIndex == -1) {
            return null;
        } else {
            return this.state.options[this.state.optionsIndex];
        }
    }

    showOptions() {
        return this.state.options.length > 0;
    }

    // Навигация по списку
    handleKeyDown(event) {
        if(event.nativeEvent.key == "ArrowDown" || event.nativeEvent.key == "ArrowUp") {
            event.stopPropagation();
            event.preventDefault();

            let index = this.state.optionsIndex;
            let count = this.state.options.length;
            
            if(count > 0) {
                count = count + 1; // add -1 value 

                switch(event.nativeEvent.key) {
                    case "ArrowDown": index = (index + 2) % count - 1; break;
                    case "ArrowUp": ; index = (index + count) % count - 1; break;
                }

                this.setState({
                    optionsIndex: index,
                }, () => {
                    this.input.value = this.inputValue();
                    this.state.currentOption = this.currentOptionValue();
                    this.input.selectionStart = this.input.value.length;
                    this.input.selectionEnd = this.input.value.length;
                });
            }

            return false;
        }

        if(event.nativeEvent.key == "Enter" || event.nativeEvent.key == "Tab") {
            this.setState({
                showOptions: false,
                optionsIndex: -1,
                options: [],
            }, () => {
                this.input.blur();
            });
        }

        return true;
    }

    handleInput(event) {
        this.state.warning = false;
        this.state.inputValue = event.target.value;
        this.state.optionsIndex = -1;
        this.preSelectIndex = -1;
        this.state.currentOption = null;
        this.search(this.state.inputValue);
        this.validate();
    }

    handleFocus() {
        this.setState({
            showOptions: this.showOptions(),
        });
    }

    handleBlur(event) {
        this.validate(true);
        if(this.state.preSelectIndex == -1) {
            this.setState({
                showOptions: false,
                optionsIndex: -1,
                options: [],
            }, this.removeWrap);
        } else {
            event.stopPropagation();
            this.input = document.activeElement;
        }
    }

    search(query) {
        if(query !== "") {
            let searchURL = null;

            if(this.state.city) {
                searchURL = `${APIpath}?query=${query}&limit=${this.state.searchLimit}&contentType=city`;
            }

            if(this.state.street && this.cityId !== null) {
                //searchURL = `${APIpath}?query=${query}&limit=${this.state.searchLimit}&cityId=${this.cityId}&oneString=1&withParent=1`;
                searchURL = `${APIpath}?query=${query}&limit=${this.state.searchLimit}&cityId=${"5400000100000"}&oneString=1&withParent=1`;
                //5400000100000
            }

            console.log(searchURL, this.state.street, this.cityId);

            if(searchURL == null) return;

            $.ajax({
                url: searchURL,
                type: 'get',
                dataType: 'jsonp'
            }).done(jsonData => {
                console.log(jsonData);
                if(jsonData.result != null) {
                    if(jsonData.result.length > 0) {
                        const items = jsonData.result;
                        this.setState({
                            options: items,
                            showOptions: items.length > 0 && this.input === document.activeElement,
                            wrap: items.length > 0 && this.input === document.activeElement,
                        });
                        return;
                    }
                }
            });
        } else {
            this.setState({
                options: [],
                showOptions: false,
            }, this.removeWrap);
        }
    }

    prepareName(item) {
        if(this.state.city) {
            if(item && item.name && item.typeShort)
                return `${item.typeShort}. ${item.name}`;
        }

        if(this.state.street) {
            if(item) {
                if(item.contentType == "street") {
                    return `${item.typeShort}. ${item.name}`;
                } else if(item.contentType == "building") {
                    const street = item.parents.filter(x => x.contentType == "street");
                    if(street && street.length > 0) {
                        const streetData = street[0];
                        return `${streetData.typeShort}. ${streetData.name}  ${item.typeShort}. ${item.name}`;
                    }

                }
            }
        }

        return "";
    }

    handlePreSelect(index) {
        this.state.preSelectIndex = index;
    }

    handleRemovePreSelect(index) {
        this.state.preSelectIndex = -1;
    }

    handleSelect(event) {
        event.stopPropagation();
        this.state.optionsIndex = this.state.preSelectIndex;
        this.input.value = this.inputValue();
        this.state.currentOption = this.currentOptionValue();
        this.input.selectionStart = this.input.value.length;
        this.input.selectionEnd = this.input.value.length;
        this.validate(true);

        this.setState({
            showOptions: false,
            optionsIndex: -1,
            options: [],
        }, this.removeWrap);

        return true;
    }

    removeWrap() {
        setTimeout(() => {
            this.setState({
                wrap: false,
            });
        }, 150);
    }

    doValidate() {
        this.state.valid = this.valid();
        this.state.warning = this.warning();
        this.setState({validate: true});
        return {valid: this.state.valid, warning: this.state.warning};
    }

    validate(warning = false) {
        this.setState({
            valid: this.valid(),
            warning: warning ? this.warning() : this.state.warning,
        }, () => {
            if(this.state.onValidate) this.state.onValidate({
                valid: this.state.valid, 
                warning: this.state.warning, 
                data: this.state.currentOption,
            });
        });
    }

    valid() {
        if(this.input.value != "" && this.state.currentOption != null) {
            return true;
        }

        return false;
    }

    warning() {
        if(this.input.value != "") {
            if(this.state.currentOption == null) {
                return true;
            } 
        }

        return false;
    }

    render() {
        return (
            <div className={`sInput-search-wrap${this.state.wrap ? " sInput-search-wrap--active" : ""}`}>
                <input
                    className={`sInput-search
                        ${this.state.valid                          ? " sInput-search--success" : 
                        (!this.state.valid && this.state.validate)  ? " sInput-search--error"   :
                        this.state.warning                          ? " sInput-search--warning" : ""}`}
                    onFocus={this.handleFocus.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                    onInput={this.handleInput.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                    placeholder={this.state.placeholder}
                    ref={ref => this.input = ref}/>
                {
                    (this.state.showOptions && this.input === document.activeElement) &&
                    <div 
                        className="sInput-options-container"
                        data-section-title={this.state.options.length == 0 ? "Ничего не найдено" : "Результаты" }>
                        {
                            this.state.options.length > 0 &&
                            this.state.options.map((item, index) => 
                                <div 
                                    key={index}
                                    className={`sInput-options-container__item
                                        ${(this.state.optionsIndex === index) ? " sInput-options-container__item--selected" : ""}`}
                                    onMouseEnter={() => {this.handlePreSelect(index)}}
                                    onMouseLeave={this.handleRemovePreSelect.bind(this)}
                                    onClick={event => {this.handleSelect(event)}}
                                >{this.prepareName(item)}</div>
                            )
                        }
                    </div>
                }
            </div>
        );
    }
}
SearchInput.defaultProps = {
    city: false,
    street: false,
    cityId: null,
    placeholder: "",
}

export class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="sSearch-wrap">
                <input
                    className={"sSearch"}
                    type={this.props.type}
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled}
                    readOnly={this.props.readonly}/>
                <button className="sSearch-wrap__button"></button>
            </div>
        )
    }
}

export class SearchInputCity1 extends React.Component {
    //- Getter -----------------------------------------------------------------------------------------------
    value() {
        console.log(this.state.placeInformation);
        if(!this.state.customInfo && this.state.placeInformation != null) {
            const address_components = this.state.placeInformation.address_components
                .map(item => ({
                    type: item.types[0],
                    name: item.short_name,
                }));

            return (({
                formatted_address,
                name,
                place_id,
                id,
            }) => ({
                address_components,
                formatted_address,
                name,
                place_id,
                id,
            }))(this.state.placeInformation)
        }

        return {
            address_components: null,
            name: this.input.value,
            formatted_address: "",
            place_id: "",
            id: "",
        }
    }
    //- ------------------------------------------------------------------------------------------------------
    constructor(props) {
        super(props);

        this.state = Object.assign({}, props, {
            valid: false,
            validate: false,
            warning: false,
            placeInformation: null,
            customInfo: false,
        });

        this.doValidate = this.doValidate.bind(this);

        this.value = this.value.bind(this);
    }

    componentDidMount() {
        let otions = {
            types: ['(cities)'],
            componentRestrictions: {country: "ru"},
        }

        if(google) {
            this.autocomplete = new google.maps.places.Autocomplete(this.input, otions);
            this.autocomplete.addListener('place_changed', this.handlePlaceChaged.bind(this));
        }
    }

    handlePlaceChaged() {
        const placeInfo = this.autocomplete.getPlace();
        this.state.placeInformation = placeInfo;
        this.state.customInfo = false;
        this.validate();
    }

    handleInput() {
        this.state.customInfo = true;
        this.validate();
    }

    doValidate() {
        this.state.valid = this.valid();
        this.state.warning = this.warning();
        this.setState({
            validate: true,
        })

        return({
            valid: this.state.valid,
            warning: this.state.warning,
            error: this.state.valid == false && this.state.warning == false,
        });
    }

    valid() {
        if(this.input.value != "" && this.state.placeInformation != null && this.state.customInfo == false) {
            return true;
        }

        return false;
    }

    warning() {
        if(this.state.customInfo && this.input.value != "") {
            return true;
        }

        return false;
    }

    validate() {
        this.setState({
            valid: this.valid(),
            warning: this.warning(),
        }, () => {
            if(this.state.onValidate) this.state.onValidate({
                valid: this.state.valid,
                warning: this.state.warning,
            })
        });
    }

    render() {
        return (
            <div className="sInput-search-wrap">
                <input
                    className={`sInput-search
                        ${
                            this.state.valid    ? " sInput-search--success" :
                            this.state.warning  ? " sInput-search--warning" :
                            !this.state.valid && this.state.validate   ? " sInput-search--error"   : ""
                        }`}
                    onInput={this.handleInput.bind(this)}
                    placeholder={this.state.placeholder}
                    ref={ref => this.input = ref}/>
            </div>
        );
    }
}

export class SearchInputGoogle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            placeInformation: null,
            customInfo: false,
        }
    }

    componentDidMount() {
        const otions = {
            types: [this.props.types],
            componentRestrictions: {country: this.props.country},
        }

        if(google) {
            this.autocomplete = new google.maps.places.Autocomplete(this.input, otions);
            this.autocomplete.addListener('place_changed', this.handlePlaceChaged.bind(this));
        }
    }

    handlePlaceChaged() {
        if(this.props.onPlaceChanged) {
            this.props.onPlaceChanged(this.autocomplete.getPlace());
        }
    }

    render() {
        const className = `sInput-search${
            this.props.valid == true ? " sInput-search--success" :
            this.props.valid == false ? " sInput-search--error" : ""
        }${
            this.props.warning == true ? " sInput-search--warning" : ""
        }`;

        return (
            <div className="sInput-search-wrap">
                <input
                    className={className}
                    value={this.props.value}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    onChange={this.props.onChange}
                    ref={ref => this.input = ref}/>
            </div>
        );
    }
}

export class SearchInputCity extends React.Component {
    //- Getter -----------------------------------------------------------------------------------------------
    value() {
        if(!this.state.customInfo && this.state.placeInformation != null) {
            const address_components = this.state.placeInformation.address_components
                .map(item => ({
                    type: item.types[0],
                    name: item.short_name,
                }));

            return (({
                formatted_address,
                name,
                place_id,
                id,
            }) => ({
                address_components,
                formatted_address,
                name,
                place_id,
                id,
            }))(this.state.placeInformation)
        }

        return {
            address_components: null,
            name: this.input.value,
            formatted_address: "",
            place_id: "",
            id: "",
        }
    }
    //- ------------------------------------------------------------------------------------------------------
    constructor(props) {
        super(props);

        this.state = {
            placeInformation: null,
            customInfo: false,
        }
    }

    componentDidMount() {
        const otions = {
            types: [this.props.types],
            componentRestrictions: {country: this.props.country},
        }

        if(google) {
            this.autocomplete = new google.maps.places.Autocomplete(this.input, otions);
            this.autocomplete.addListener('place_changed', this.handlePlaceChaged.bind(this));
        }
    }

    handlePlaceChaged() {
        if(this.props.onChange) {
            this.props.onChange({
                target: {
                    name: this.props.name,
                    value: this.autocomplete.getPlace()
                }
            });
        }
    }

    render() {
        const className = `sInput-search${
            this.props.valid == true ? " sInput-search--success" :
            this.props.valid == false ? " sInput-search--error" : ""
        }${
            this.props.warning == true ? " sInput-search--warning" : ""
        }`;

        return (
            <div className="sInput-search-wrap">
                <input
                    className={className}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    onChange={this.props.onChange}
                    ref={ref => this.input = ref}/>
            </div>
        );
    }
}

export class SearchInputAddress extends React.Component {
    //- Getter -----------------------------------------------------------------------------------------------
        value() {
            console.log(this.state.placeInformation);
            if(!this.state.customInfo && this.state.placeInformation != null) {
                const address_components = this.state.placeInformation.address_components
                    .map(item => ({
                        type: item.types[0],
                        name: item.short_name,
                    }));

                return (({
                    formatted_address,
                    name,
                    place_id,
                    id,
                }) => ({
                    address_components,
                    formatted_address,
                    name,
                    place_id,
                    id,
                }))(this.state.placeInformation)
            }

            return {
                address_components: null,
                name: this.input.value,
                formatted_address: "",
                place_id: "",
                id: "",
            }
        }
    //- ------------------------------------------------------------------------------------------------------

    constructor(props) {
        super(props);

        this.state = Object.assign({}, props, {
            valid: false,
            validate: false,
            warning: false,
            placeInformation: null,
            customInfo: false,
            disabled: false,
        });

        this.doValidate = this.doValidate.bind(this);
        this.disable = this.disable.bind(this);
        this.enable = this.enable.bind(this);

        this.value = this.value.bind(this);
    }

    enable() {
        this.state.disabled = false;
        this.validate();  
    }

    disable() {
        this.setState({
            disabled: true,
        });
        if(this.state.onValidate) this.state.onValidate({valid: true, warning: false});
    }

    componentDidMount() {
        let otions = {
            types: ['address'],
            componentRestrictions: {country: "ru"},
        }

        this.autocomplete = new google.maps.places.Autocomplete(this.input, otions);
        this.autocomplete.addListener('place_changed', this.handlePlaceChaged.bind(this));
    }

    handlePlaceChaged() {
        if(this.props.onChange) {
            this.props.onChange({
                target: {
                    name: this.props.name,
                    value: this.autocomplete.getPlace()
                }
            });
        }
    }

    // handlePlaceChaged() {
    //     const placeInfo = this.autocomplete.getPlace();
    //     this.state.placeInformation = placeInfo;
    //     this.state.customInfo = false;
    //     this.validate();
    // }

    handleInput() {
        this.state.customInfo = true;
        this.validate();
    }

    doValidate() {
        this.setState({
            validate: true,
        })

        if(this.state.disabled == false) {
            this.state.valid = this.valid();
            this.state.warning = this.warning();

            return({
                valid: this.state.valid,
                warning: this.state.warning,
                error: this.state.valid == false && this.state.warning == false,
            });
        }

        return({
            valid: true,
            warning: false,
            error: false,
        });
    }

    valid() {
        if(this.input.value != "" && this.state.placeInformation != null && this.state.customInfo == false) {
            return true;
        }

        return false;
    }

    warning() {
        if(this.state.customInfo && this.input.value != "") {
            return true;
        }

        return false;
    }

    validate() {
        this.setState({
            valid: this.valid(),
            warning: this.warning(),
        }, () => {
            if(this.state.onValidate) this.state.onValidate({
                valid: this.state.valid,
                warning: this.state.warning,
            })
        });
    }

    render() {
        const className = `sInput-search${
            this.props.valid == true ? " sInput-search--success" :
            this.props.valid == false ? " sInput-search--error" : ""
        }${
            this.props.warning == true ? " sInput-search--warning" : ""
        }`;

        return (
            <div className="sInput-search-wrap">
                <input
                    className={className}
                    disabled={this.props.disabled}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    onChange={this.props.onChange}
                    ref={ref => this.input = ref}/>
            </div>
        );
    }
}

export class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            toggle: false,
            value: props.value || ''
        }

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value != null && nextProps.value != this.state.value) {
            this.setState({value: nextProps.value});
        }
    }

    handleSelect(option) {
        if(this.props.onSelect) this.props.onSelect(option);
        if(this.props.onChange) this.props.onChange({
            target: {
                name: this.props.name,
                value: option.value
            }
        });
        this.setState({value: option.value || option});
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
        var optionR = (option, index) => {
            return(
                <div
                    key={option.id || index}
                    className="sInput-select__options-container__item"
                    onMouseDownCapture={() => {this.handleSelect(option)}}>
                        {option.value || option}
                </div>
            )
        }

        let className = `sInput-dropdown${this.props.white ? ' sInput-dropdown--white' : ''}`;
            className = `${className}${
                this.props.warning == true ? " sInput-dropdown--warning" :
                this.props.valid == true ? " sInput-dropdown--success" :
                this.props.valid == false ? " sInput-dropdown--error" : ""
            }`;

        var options = this.props.options || [];
        var optionList= _.map(options, optionR);

        return (
            <div className={`sDropdown`} ref={container => {this.container = container}}>
                <input 
                    className={className}
                    type="text"
                    name={this.props.name}
                    value={this.state.value}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled}
                    readOnly={this.props.readonly || true}/>
                        {
                            this.state.toggle && options.length > 0 &&
                            <div
                                className="sDropdown__options-container"
                                tabIndex="0">
                                    {optionList}
                            </div>
                        }
            </div>
        );
    }
}

export const InputSignMail = (props) => {
    return(
        <div className={`sInput-sign sInput-sign--mail${
            props.disabled == true ? ' sInput-sign--disabled' :
            props.valid == true ? ' sInput-sign--success' :
            props.valid == false ? ' sInput-sign--error' : ''
        }`}>
            <input
                value={props.value}
                name={props.name}
                type={"email"}
                readOnly={props.readonly}
                disabled={props.disabled}
                placeholder={props.placeholder}
                onChange={props.onChange}/>
        </div>
    )
}

export const InputSignPassword = (props) => {
    return(
        <div className={`sInput-sign sInput-sign--password${
            props.disabled == true ? ' sInput-sign--disabled' :
            props.valid == true ? ' sInput-sign--success' :
            props.valid == false ? ' sInput-sign--error' : ''
        }`}>
            <input
                value={props.value}
                name={props.name}
                type={"password"}
                readOnly={props.readonly}
                disabled={props.disabled}
                placeholder={props.placeholder}
                onChange={props.onChange}/>
        </div>
    )
}


// Новый инпут для телефонных номеров
export class UserPhoneInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value || '',
            lastKey: '',
            lastKeyCode: -1
        }

        this.masks = {
            'ru': {
                name: 'Россия',
                base: '+7 ',
                mask: this.makeMask('(x,x,x), x,x,x, x,x,-x,x'),
                count: 10,
                code: 1
            },
            'az': {
                title: 'Азербайджан',
                name: '+994',
                mask: this.makeMask('x,x,-x,x,x,-x,x,-x,x'),
                count: 9,
                code: 3
            },
            'am': {
                title: 'Армения',
                name: '+374',
                mask: this.makeMask('x,x,-x,x,x,-x,x,x'),
                count: 8,
                code: 3
            },
            'by': {
                title: 'Белорусия',
                name: '+375',
                mask: this.makeMask('(x,x), x,x,x-,x,x,-x,x'),
                count: 9,
                code: 3
            },
            'ge': {
                title: 'Грузия',
                name: '+995',
                mask: this.makeMask('(x,x,x), x,x,x,-x,x,x'),
                count: 9,
                code: 3
            },
            'kz': {
                title: 'Казахстан',
                name: '+7',
                mask: this.makeMask('(x,x,x), x,x,x,-x,x,-x,x'),
                count: 10,
                code: 1
            },
            'kg': {
                title: 'Кыргызстан',
                name: '+996',
                mask: this.makeMask('(x,x,x), x,x,x,-x,x,x'),
                count: 9,
                code: 3
            },
            'tj': {
                title: 'Таджикистан',
                name: '+992',
                mask: this.makeMask('x,x,-x,x,x,-x,x,x,x'),
                count: 9,
                code: 3
            },
            'tm': {
                title: 'Туркменистан',
                name: '+993',
                mask: this.makeMask('x,x,-x,x,-x,x,-x,x'),
                count: 8,
                code: 3
            },
            'ua': {
                title: 'Украина',
                name: '+380',
                mask: this.makeMask('(x,x), x,x,x,-x,x,-x,x'),
                count: 9,
                code: 3
            },
            'uz': {
                title: 'Узбекистан',
                name: '+998',
                mask: this.makeMask('x,x,-x,x,x,-x,x,x,x'),
                count: 9,
                code: 3
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    makeMask(mask) {
        return mask.split(',');
    }

    componentWillMount() {
        this.state.value = this.clear(this.state.value);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value != null) {
            this.setState({value: this.clear(nextProps.value)});
        }
    }
    
    mapper(value, digit) {
        return value.replace(/\x/g, (m,n) => digit);
    }

    decorate(value, type = 'ru') {
        return _.reduce(this.state.value, (sum, digit, index) => {
            return sum + this.mapper(this.masks[type].mask[index], digit);
        }, this.masks[type].base);
    }

    clear(value, type = 'ru') {
        return (value.replace(new RegExp(/[^\d]/, 'g'), '')).substring(this.masks[type].code, this.masks[type].count + this.masks[type].code);
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

        this.setState({value});
    }

    handleKeyDown(event) {
        this.setState({
            lastKey: event.nativeEvent.key,
            lastKeyCode: event.nativeEvent.keyCode
        })
    }

    render() {
        const className = `sInput-phone${
            this.props.valid == true ? " sInput-phone--success" :
            this.props.valid == false ? " sInput-phone--error" : ""
        }${
            true ? " sInput-phone--flag": ""
        }`;

        return(
            <div className={className}>
                <Dropdown />
                <input
                    className={className}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled}
                    readOnly={this.props.readonly}
                    type='tel'
                    value={this.decorate(this.state.value)}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}/>
            </div>
        )
    }
}
