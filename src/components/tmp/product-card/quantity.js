import React        from 'react';
import {connect}    from 'react-redux';

import IconButton   from 'material-ui/IconButton';
import Add          from 'material-ui/svg-icons/content/add';
import Remove       from 'material-ui/svg-icons/content/remove';

var style = {
    button: {
        width: 22, 
        height: 22, 
        padding: 3,
    },
    icon: {
        width: 16, 
        height: 16, 
        color: "#777",
    }
}

class ProductCardQuantity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentValue: Math.max(props.currentValue, 1),
        }
    }

    handleAdd() {
        this.setState({
            currentValue: Math.min(this.state.currentValue + 1, this.props.maxValue),
        });
    }

    handleRemove() {
        this.setState({
            currentValue: Math.max(this.state.currentValue - 1, this.props.minValue),
        });
    }

    render() {
        return(
            <div className="product-card-quantity">
                <span className="product-card-quantity__value">{Math.max(this.state.currentValue, this.props.currentValue)}</span>
                <div className="product-card-quantity__control">
                    <div className="product-card-quantity__control__item">
                        <IconButton 
                            iconStyle={style.icon} 
                            style={style.button}
                            disabled={this.state.currentValue == this.props.maxValue}
                            onClick={this.handleAdd.bind(this)} >
                                <Add />
                        </IconButton>
                    </div>
                    <div className="product-card-quantity__control__item">
                        <IconButton 
                            iconStyle={style.icon} 
                            style={style.button} 
                            disabled={this.state.currentValue == this.props.minValue}
                            onClick={this.handleRemove.bind(this)} >
                                <Remove />
                        </IconButton>
                    </div>
                </div>
            </div>
        );
    }
}

const mstp = (state, ownProps) => {
    const productInfo = state.products.find(x => x.id === ownProps.productId);
    return {
        minValue: 1,    // productInfo.quantity.min
        maxValue: 10,   // productInfo.quantity.max
    }
}

const mdtp = (dispatch) => {
    return {
        onChangeQuantity: () => dispatch({type: "PRODUCT__CHANGE_QUANTITY", data: null}),
    }
}

export default connect(mstp, mdtp)(ProductCardQuantity);

// ----------------------------------------------------------
