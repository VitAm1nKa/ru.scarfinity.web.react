import React                from 'react';
import {
    NavLink
}                           from 'react-router-dom';

import FlatButton           from 'material-ui/FlatButton';
import IconButton           from 'material-ui/IconButton';
import NavigationCancel     from 'material-ui/svg-icons/navigation/cancel';
import ColorPicker          from '../../utility/color-picker';
import Currency             from '../../utility/currency';
import Quantity             from '../../utility/quantity';
import ImageContainer       from '../../utility/image-container';

const styles = {
    mediumIcon: {
        width: 22,
        height: 22,
        color: "#ccc",
        hoverColor: "#e46a5a",
    },

    medium: {
        width: 36,
        height: 36,
        padding: 2,
        hoverColor: "#e46a5a",
    },
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inProcess: false,
            collapsed: false
        };

        this.handleRemoveItem = this.handleRemoveItem.bind(this);
	}

    handleRemoveItem() {
        this.setState({collapsed: true}, () => {
            setTimeout(() => {
                if(this.props.onRemove) {
                    this.props.onRemove(this.props.productId);
                }
            }, 300);
        });
    }

    render() {
        return (
            <div 
                className={`cart__product-card${
                    this.state.inProcess ? " cart__product-card--in-process" :
                    this.state.collapsed ? " cart__product-card--collapsed" : ""
                }`}>
                    <div className="cart__product-card__back-remove-block">
                    </div>
                    <div className="cart__product-card__container">
                        <div className="cart__product-card__remove-block">
                            <IconButton
                                iconStyle={ styles.mediumIcon }
                                style={ styles.medium }
                                onClick={() => {this.props.onQuantityChange(this.props.line.product.productId, 0)}} >
                                    <NavigationCancel hoverColor="#e46a5a" />
                            </IconButton>
                        </div>
                        <div className="cart__product-card__image-block">
                            <div className="cart__product-card__image-block__image">
                                <ImageContainer
                                    imageUrl={this.props.line.product.image.getPreview()}/>
                            </div>
                        </div>
                        <div className="cart__product-card__content-block">
                            <NavLink
                                to={this.props.line.product.path}
                                className="cart__product-card__content-block__title">
                                    {this.props.line.product.title}
                            </NavLink>
                            <div className="cart__product-card__content-block__content">
                                <div className="title">Цвет:</div>
                                <div className="color-container">
                                    <ColorPicker
                                        colors={[this.props.line.product.colorCode]}
                                        itemWidth={18}
                                        unselectable/>
                                </div>
                            </div>
                        </div>
                        <div className="cart__product-card__price-block">
                            <Currency
                                original={this.props.line.product.listPrice}
                                size="small"
                                unmutable={true} />
                        </div>
                        <div className="cart__product-card__delim-block">&#215;</div>
                        <div className="cart__product-card__quantity-block">
                            <Quantity
                                quantity={this.props.line.quantity || 0}
                                onChange={quantity => this.props.onQuantityChange(this.props.line.product.productId, quantity)}/>
                        </div>
                        <div className="cart__product-card__delim-block">&#61;</div>
                        <div className="cart__product-card__total-block">
                            <Currency
                                original={this.props.line.lineTotal}
                                size="small" />
                        </div>
                    </div>
                    <div className="cart__product-card__process-block">
                        <span className="cart__product-card__process-block__spinner"></span>
                        <div className="cart__product-card__process-block__content">
                            Some processed...
                        </div>
                    </div>
            </div>
        );
    }
}

export default Controller;