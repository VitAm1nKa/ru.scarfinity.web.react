import React                            from 'react';
import {NavLink}                        from 'react-router-dom';
import qs								from 'qs';
import * as Grid						from '../../lib/grid';

import ArrowDropDown                    from 'material-ui/svg-icons/navigation/arrow-drop-down';

import Currency                			from '../utility/currency';
import RaitingBox              			from '../utility/rating-box';
import {ProductCartButton}				from '../utility/buttons';
import LazyLoader						from '../utility/lazy-loader';

// Libs --------------------
import {count__reviews}		            from '../../lib/currying';

import ColorPicker			 			from '../utility/color-picker';

// Components
import ProductCardFavorite				from './favorite';
import ProductCardQuantity				from './quantity';
import ProductCardImageContainer		from './image-block';
import {ImageGallery2}					from './image-block';
import ProductCardColorPicker			from './colors';
import ProductCardPricing				from './pricing';
import Quantity             			from '../utility/quantity';

import Paper                			from 'material-ui/Paper';
import Favorite         				from 'material-ui/svg-icons/action/favorite';
import FavoriteBorder   				from 'material-ui/svg-icons/action/favorite-border';
import IconButton       				from 'material-ui/IconButton';

import {
	ProductModel,
	Product
}										from '../../store/__models';

var style = {
    button: {
        width: 32,
        height: 32,
        padding: 4,
    },
    icon: {
        width: 22,
        height: 22,
        color: "#aaa",
    },
    iconSelected: {
        width: 22,
        height: 22,
        color: "#e05543",
    }
}

class Controller extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			quantity: props.productQuantity || 1
		}

		this.handleQuantityChange = this.handleQuantityChange.bind(this);
		this.handleAddToCart = this.handleAddToCart.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.productQuantity != this.state.quantity) {
			this.setState({quantity: nextProps.productQuantity || 1});
		}
	}

	handleQuantityChange(quantity) {
		this.setState({quantity});

		if(this.props.onQuantityChange && this.props.productInCart) {
			this.props.onQuantityChange(quantity);
		}
	}

	handleAddToCart() {
		if(this.props.onQuantityChange) {
			this.props.onQuantityChange(this.state.quantity);
		}
	}

	render() {
		return(
			<div className="product-card__container">
				<div className="product-card__container__header">
					<span className="product-card-title">{this.props.productModel.title}</span>
				</div>

				<div className="product-card__container__body">					
					<ProductCardImageContainer
						colorCode={this.props.productSelected.colorCode}
						imageGallery={this.props.productSelected.imageGallery}
						items={this.props.productSelected.images} />
					
					<div className="product-card__product-info-container">
						<div className="product-card__product-title">
							<div className="product-card__product-title__title-block">
								<span className="product-card-title">{this.props.productModel.title}</span>
							</div>
							<div className="product-card__product-title__review-block">

								<RaitingBox currentValue={this.props.productModel.reviewStats.averageRating} />
								<span className="product-card__product-title__review-block__review">
									{`${this.props.productModel.reviewStats.reviewsCount} ${count__reviews(this.props.productModel.reviewStats.reviewsCount)}`}
								</span>

								<div className="product-card-favorite">
									<span className="product-card-favorite__label">В избранное</span>
										<IconButton 
											style={style.button}
											iconStyle={this.props.productModel.userProductModelPreferences.inFavorite ? style.iconSelected : style.icon}
											onClick={() => {this.props.setUserProductModelPreferences(true, false)}} >
											{this.props.productModel.userProductModelPreferences.inFavorite ? <Favorite /> : <FavoriteBorder />}
										</IconButton>
								</div>
							</div>
						</div>

						<span className="product-card__product-info-container__delim"></span>

						<Grid.VerticalGrid 
							className="product-card__product-info">
								<div className="product-card__product-info__short-description-block">
									<p className="product-card__product-info__short-description-block__content">
										{this.props.productModel.description}
									</p>
								</div>

							{/*Блок с контейнером цветов*/}
							<div className="product-card__product-info__color-select-block">
								<div className="product-card-color">
									<span className="product-card-color__title">Цвет: </span>
										<ColorPicker
											left
											colors={this.props.productModel.colorCodes()}
											selectedColors={this.props.productSelected.colorCode}
											lineCount={12}
											itemWidth={50}
											onSelectChange={this.props.onColorChange}/>
								</div>
							</div>

							{/*Блок с ценой*/}
							<div className="product-card__product-info__pricing-block">
								<Currency
									original={this.props.productModel.listPrice}
									size={"xlarge"}
									subtitle={"Цена за шт."}
									accent/>
							</div>

							<div className="product-card__product-info__cart-block">
								<Quantity
									viewStyle={"product-card"}
									quantity={this.state.quantity}
									minQuantity={1}
									maxQuantity={99}
									onChange={this.handleQuantityChange}/>
								<ProductCartButton
									iddleTitle="Добавить в Корзину"
									inCartTitle="Перейти в Корзину"
									inCart={this.props.productInCart}
									onClick={this.handleAddToCart}/>
							</div>
						</Grid.VerticalGrid>
					</div>
				</div>
			</div>
		)
	}
}

export default Controller;