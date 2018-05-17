import React                    from 'react';
import { 
    Link,
    NavLink
}                               from 'react-router-dom'

import { 
    ProductModel,
    Product
}                               from '../../store/__models';

import Paper                    from 'material-ui/Paper';
import RatingBox                from './rating-box';
import ImageContainer           from './image-container';
import ColorPicker              from './color-picker';
import Currency                 from './currency';
import Ribbon                   from './ribbon';
import {
    CatalogProductCartButton
}                               from './buttons';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedProductId: props.firstProduct().id
        }

        this.handleCartAdd = this.handleCartAdd.bind(this);
    }

    handleCartAdd() {
        if(this.props.onCartAdd) {
            this.props.onCartAdd({
                productId: this.state.selectedProductId,
                quantity: 1
            });
        } 
    }

    render() {
        const ribbon = this.props.ribbon ? <Ribbon ribbonType={this.props.ribbon} size={70} /> : null;

        return(
            <div className="product-card-catalog">
                <div className="product-card-catalog__image">
                    <div className="product-card-catalog__image__image">
                        <ImageContainer
                            imageUrl={this.props.thumbnail(this.state.selectedProductId)}/>
                    </div>
                    <NavLink
                        to={this.props.path()}
                        className="product-card-catalog__image__info">
                            <span>Цвета:</span>
                            <ColorPicker
                                colors={this.props.colorCodes()}
                                selectedColors={[this.props.getProduct(this.state.selectedProductId).colorCode]}
                                count={5}/>
                    </NavLink>
                </div>

                <div className="product-card-catalog__rating">
                    <RatingBox
                        currentValue={this.props.reviewStats.averageRating}
                        iconSize={16} />
                </div>

                <div className="product-card-catalog__description">
                    <span className="product-card-catalog__title">{this.props.title}</span>
                    <div className="product-card-catalog-footer">
                        <div className="product-card-catalog-footer__price">
                            <Currency
                                original={this.props.listPrice}
                                glyphFull
                                fontSize={18}
                                fontWeight={500}/>
                        </div>
                        <div className="product-card-catalog-footer__button">
                            <CatalogProductCartButton
                                iddleLabel={"Добавить в корзину"}
                                completeLabel={"Перейти в корзину"}
                                onIddleClick={this.handleCartAdd}
                                onCompleteClick={() => {}} />
                        </div>
                    </div>
                </div>
                <div className="product-card-catalog__ribbon">{ribbon}</div>
            </div>
        )
    }
}

export default Controller;