import React                            from 'react';
import {Link}                           from 'react-router-dom'
import productCard						from '../';

import './product-card.less';

import ArrowDropDown                    from 'material-ui/svg-icons/navigation/arrow-drop-down';

import Utility__Currency                from '../../utility/Utility__Currency.jsx';
import Utility__RaitingBox              from '../../utility/Utility__RaitingBox.jsx';
import {CartButton}						from '../../utility/buttons';
import LazyLoader						from '../../utility/lazy-loader';

// Libs --------------------
import {count__reviews}		            from '../../../lib/currying';

import {ColorPickerAdvance}  			from '../../utility/color-picker';

// Components
import ProductCardFavorite				from './favorite';
import ProductCardQuantity				from './quantity';
import ProductCardImageContainer		from './image-block';
import {ImageGallery2}					from './image-block';
import ProductCardColorPicker			from './colors';
import ProductCardPricing				from './pricing';

import Favorite         				from 'material-ui/svg-icons/action/favorite';
import FavoriteBorder   				from 'material-ui/svg-icons/action/favorite-border';
import IconButton       				from 'material-ui/IconButton';

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

const ProductCard = (props) => {
	if(props.loading) {
		return <LazyLoader size={8}/>
	}
	return(
		<div className="product-card__container">
			<div className="product-card__container__header">
				<span className="product-card-title">{props.main.title}</span>
			</div>

			<div className="product-card__container__body">
				
				{/* colorCode - для проверки, новые ли данные пришли */}
				<ProductCardImageContainer
					colorCode={props.colorCode}
					items={props.images.list} />
				

				<div className="product-card__product-info-container">
					<div className="product-card__product-title">
						<div className="product-card__product-title__title-block">
							<span className="product-card-title">{props.main.title}</span>
						</div>
						<div className="product-card__product-title__review-block">


							<Utility__RaitingBox currentValue={props.reviews.rating} />
							<span className="product-card__product-title__review-block__review">
								{`${props.reviews.count} ${count__reviews(props.reviews.count)}`}
							</span>

							<div className="product-card-favorite">
								<span className="product-card-favorite__label">В избранное</span>
									<IconButton 
										style={style.button}
										iconStyle={props.favoriteState ? style.iconSelected : style.icon}
										onClick={props.changeFavoriteState} >
										{props.favorite.toggle ? <Favorite /> : <FavoriteBorder />}
									</IconButton>
							</div>



						</div>
					</div>

					<span className="product-card__product-info-container__delim"></span>

					<div className="product-card__product-info">

						{/*Блок с оисанием товара*/}
						<div className="product-card__product-info__short-description-block">
							<p className="product-card__product-info__short-description-block__content">
								{props.main.shortInfo}
							</p>
						</div>

						{/*Блок с контейнером цветов*/}
						<div className="product-card__product-info__color-select-block">
							<div className="product-card-color">
								<span className="product-card-color__title">Цвет: </span>
									<ColorPickerAdvance
										colors={props.colors.list}
										selectedColor={props.colorCode}
										onClick={props.colors.onColorCodeChange} />
							</div>
    					</div>

						{/*Блок с ценой*/}
						<div className="product-card__product-info__pricing-block">
							<Utility__Currency
								value={props.pricing.cost} 
								saleValue={props.pricing.saleCost}
								size={"xlarge"} 
								accent />
						</div>

						{/*Блок с выбором количества и кнопкой в корзину*/}
						<div className="product-card__product-info__cart-block">
							<ProductCardQuantity 
								minValue={props.quantity.minValue}
								maxValue={props.quantity.maxValue}
								currentValue={props.quantity.currentQuantity} />
							<CartButton
								baseValue="Добавить в Корзину"
								inCartValue="Перейти в Корзину"
								inCart={props.quantity.inCart}
								addToCart={() => {props.addProductToCart(2)}}
								goToCart={props.goToCart} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default productCard(ProductCard);