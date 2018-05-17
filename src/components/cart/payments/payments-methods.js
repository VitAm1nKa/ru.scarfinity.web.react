import React                    from 'react';
import {connect}                from 'react-redux';

import Currency                 from '../../utility/currency';

const RadioIcon = (props) => {
    const styles = {
        checked: {
            outside: "#1bb869",
            inside: "#ffffff",
            round: "1bb869",
        },
        unchecked: {
            outside: "#aaaaaa",
            inside: "#ffffff",
            round: "#ffffff",
        },
    }

    const style = props.checked ? styles.checked : styles.unchecked;

    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 300 300" style={{marginRight: 10}}>
            <circle
                style={{
                    fill: style.outside,
                }}
                cx="150" cy="150" r="144"/>
            <circle
                style={{
                    fill: style.inside,
                }}
                cx="150" cy="150" r="130"/>
            <circle
                style={{
                    fill: style.round,
                    transition: 'all 0.3s ease',

                }}
                cx="150" cy="150" r="65"/>
        </svg>
    )
}
RadioIcon.defaultProps = {
    checked: false,
    size: 16,
}


const PaymentMethod = (props) => {
    return(
        <div
            className={`requisites-shipping-method__item${props.checked ? " requisites-shipping-method__item--selected": ""}`}
            onClick={props.onClick}>
                <RadioIcon checked={props.checked} />
                <Currency original={shipMethod.shipBase} fontSize={15} fontWeight={500} />
                <span className="requisites-shipping-method__item__title">{shipMethod.title}</span>
                <span className="requisites-shipping-method__item__duration">{shipMethod.deliveryDue}</span>
        </div>
    )
}

//- Export class -------------------------------------------------------------------------------
class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        
    }

    render() {
        return(
            <div
                className={`requisites-shipping-method
                ${
                    this.props.valid === true ? " requisites-shipping-method--success" :
                    this.props.valid === false ? " requisites-shipping-method--error" : ""
                }`}>
                <span className="requisites-shipping-method__title">{this.props.title}</span>
                {
                    _.map(this.props.items, item => {
                        return(
                            <PaymentMethod
                                key={item.id}
                                {...item}
                                checked={item.id == this.state.checkedId}
                                onClick={() => {this.handleClick(item.id)}}/>
                        )
                    })
                }
            </div>
        )
    }
}

export default Controller;
