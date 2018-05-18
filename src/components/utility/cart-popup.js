import React                from 'react';
import connect              from 'react-redux';
import {
    NavLink
}                           from 'react-router-dom';
import { 
    ButtonChevronRight
}                           from './buttons';

import ImageContainer       from './image-container';
import Currency             from './currency';

import IconButton           from 'material-ui/IconButton';
import NavigationCancel     from 'material-ui/svg-icons/navigation/cancel';


import './cart-popup.less';

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

export const ProductCardView = (props) => {
    const handleProductRemove = () => {
        if(item.onProductRemove) {
            item.onProductRemove({
                productId: item.productId,
                quantity: 0
            });
        }
    }

    return (
        <div className="cart-popup-product-card">
            <div className="cart-popup-product-card__image">
                <ImageContainer
                    imageUrl={props.line.product.image.getPreview()}/>
            </div>
            <div className="cart-popup-product-card__content">
                <NavLink
                    to={props.line.product.path}
                    className="cart-popup-product-card__content__title">
                        {props.line.product.title}
                </NavLink>
                <div className="cart-popup-product-card__content__info">
                    <span className="cart-popup-product-card__content__info__quantity">
                        {props.line.quantity}
                    </span>
                    <div className="cart-popup-product-card__content__info__delim">&#215;</div>
                    <Currency 
                        original={props.line.product.listPrice}
                        fontSize={13}
                        accent
                        glyphFull/>
                </div>
            </div>
            <div className="cart-popup-product-card__button">
                <IconButton iconStyle={ styles.mediumIcon } style={ styles.medium } onClick={handleProductRemove} >
                    <NavigationCancel hoverColor="#e46a5a" />
                </IconButton>
            </div>
        </div>
    )
}

class Controller extends React.Component {
    render() {
        const lines = _.map(_.take(this.props.shoppingCart.lines, 4), line => {
            return(
                <div
                    key={line.product.productId}
                    className="cart-popup__item">
                        <ProductCardView
                            line={line}
                            onProductRemove={this.props.onProductRemove}/>
                </div>
            )
        })

        return(
            <div className="cart-popup__container">
                <div className="cart-popup">
                    {lines}
                    <div className="cart-popup__footer">
                        <span className="cart-popup__footer__title">
                            {"Подитог:"}&nbsp;&nbsp;&nbsp;
                            <Currency 
                                original={this.props.shoppingCart.subTotal}
                                fontSize={17}
                                accent
                                glyphFull/>
                        </span>
                        <div className="cart-popup__footer__button">
                            <ButtonChevronRight
                                to={"/cart"}
                                title={"Рассчитать"}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Controller;