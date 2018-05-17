import React            from 'react';
import {connect}        from 'react-redux';

import Favorite         from 'material-ui/svg-icons/action/favorite';
import FavoriteBorder   from 'material-ui/svg-icons/action/favorite-border';
import IconButton       from 'material-ui/IconButton';

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

// ------------------------------------------------------
// Комонент получает productId
// В стейте ищет продукт с этим ИД и берет информации о фэворит стейте
// Не нежно проверять на существование продукта в списке, так как этот копонет часть другого в кором эта проверка уже была пройдена.
const ProductCardFavorite = (props) => {
    return(
        <div className="product-card-favorite">
            <span className="product-card-favorite__label">В избранное</span>
                <IconButton 
                    style={style.button}
                    iconStyle={props.favoriteState ? style.iconSelected : style.icon}
                    onClick={props.changeFavoriteState} >
                    {props.favoriteState ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
        </div>
    )
}

const mstp = (state, ownProps) => {
    return {
        favoriteState: false,
        // favoriteState: state.products
        //     .find(x => x.id === ownProps.productId).favoriteState,
    }
}

const mdtp = (dispatch) => {
    return {
        changeFavoriteState: () => dispatch({type: "PRODUCT__CHANGE_FAVORITE_STATE", data: null}),
    }
}

export default connect(mstp, mdtp)(ProductCardFavorite);

// ----------------------------------------------------------