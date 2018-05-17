import React from 'react';
import PropTypes from 'prop-types';

import './quantity.less';

const QuantityView = (props) => {
    const decButton = <button
        className="quantity__button minus"
        name="dec"
        disabled={props.quantity <= props.minQuantity}
        onClick={props.handleClick}/>;
    
    const incButton = <button
        className="quantity__button plus"
        name="inc"
        disabled={props.quantity >= props.maxQuantity}
        onClick={props.handleClick}/>;

    const input = <input
        className="quantity__input"
        type="text"
        value={props.quantity}
        onChange={props.handleChange}
        onKeyPress={props.handleKeyPress}
        onBlur={props.handleBlur} />;

    if(props.viewStyle == 'product-card') {
        return(
            <div className="quantity-product-card">
                {input}
                <div className="quantity-product-card__control">
                    {incButton}
                    {decButton}
                </div>
            </div>
        )
    }

    return(
        <div className="quantity">
            {decButton}
            {input}
            {incButton}
        </div>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: props.quantity
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.quantity != this.state.quantity) {
            this.state.quantity = Math.max(Math.min(parseInt(nextProps.quantity), this.props.maxQuantity), this.props.minQuantity);
        }
    }

    handleChange(event) {
        var quantity = event.target.value || 0;
        var reg = /^\d+$/;
        if(/^\d+$/.test(quantity)) 
            this.setState({quantity: Math.max(Math.min(parseInt(quantity), this.props.maxQuantity), this.props.minQuantity)});
    }

    handleKeyPress(event) {
        if(event.key === 'Enter') {
            event.target.blur();

            if(this.props.onChange)
                this.props.onChange(this.state.quantity);
        }
    }

    handleBlur() {
        if(this.props.onChange)
            this.props.onChange(this.state.quantity);
    }

    handleClick(event) {
        this.setState({
            quantity: this.state.quantity + (event.target.name == 'inc' ? 1 : -1)
        }, () => {
            if(this.props.onChange)
                this.props.onChange(this.state.quantity);
        });
    }

    render() {
        return <QuantityView
            viewStyle={this.props.viewStyle}
            quantity={this.state.quantity}
            minQuantity={this.props.minQuantity}
            maxQuantity={this.props.maxQuantity}
            handleClick={this.handleClick}
            handleChange={this.handleChange}
            handleKeyPress={this.handleKeyPress}
            handleBlur={this.handleBlur}/>
    }
}
Controller.defaultProps = {
    minQuantity: 0,
    maxQuantity: 999
}

export default Controller;