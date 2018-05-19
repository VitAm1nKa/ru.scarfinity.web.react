import React                    from 'react';

import Currency                 from '../../utility/currency';
import {count__cartItems}		from '../../../lib/currying';

import FlatButton               from 'material-ui/FlatButton';
import IconButton               from 'material-ui/IconButton';
import NavigationCancel         from 'material-ui/svg-icons/navigation/cancel';
// ---------------------
import ProductCard              from './product-card';

import './products.less';

class Controller extends React.Component {
    render() {
        const itemsCount = this.props.shoppingCart.lines.length;
        const itemsCountString = count__cartItems(itemsCount);
        const countString = <b>{itemsCount} {itemsCountString}</b>;

        const products = _.map(this.props.shoppingCart.lines, line => {
            return(
                <ProductCard
                    key={line.product.productId}
                    line={line}
                    onQuantityChange={this.props.onQuantityChange} />
            )
        });

        return (
            <div className="cart__products-container">
                <div className="cart__header-row">{"У вас "}{countString}{" в коризине"}</div>
                <div className="cart__product-card cart__product-card--header">
                    <div className="cart__product-card__container">
                        <div className="cart__product-card__remove-block">
                        </div>
                        <div className="cart__product-card__image-block">
                        </div>
                        <div className="cart__product-card__content-block">
                            <span className="cart__u__grid-title" data-full="Наименование" data-abbr="Наименование"></span>
                        </div>
                        <div className="cart__product-card__price-block">
                            <span className="cart__u__grid-title" data-full="Цена" data-abbr="Цена"></span>
                        </div>
                        <div className="cart__product-card__delim-block"></div>
                        <div className="cart__product-card__quantity-block">
                            <span className="cart__u__grid-title" data-full="Количество" data-abbr="Кол-во"></span>
                        </div>
                        <div className="cart__product-card__delim-block"></div>
                        <div className="cart__product-card__total-block">
                            <span className="cart__u__grid-title" data-full="Сумма" data-abbr="Сумма"></span>
                        </div>
                    </div>
                </div>
                {products}
                <div className="cart__bottom-row">
                    <span className="cart__bottom-row__label">Подитог:</span>
                    <Currency 
                        original={this.props.shoppingCart.subTotal}
                        size="medium" 
                        accent={true} 
                        test={true} />
                </div>
            </div>
        )
    }
}

export default Controller;