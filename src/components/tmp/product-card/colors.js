import React        from 'react';
import {connect}    from 'react-redux';

import {ColorPickerAdvance}  from '../../utility/color-picker';

{/*Блок с контейнером цветов*/}
const ProductCardColorPicker = (props) => {
    return(
        <div className="product-card__product-info__color-select-block">
            <div className="product-card-color">
                <span className="product-card-color__title">Цвет: </span>
                    <ColorPickerAdvance
                        colors={props.colors}
                        selectedColor={props.colorCode}
                        onClick={props.onColorCodeChange} />
            </div>
    </div>
    )
}

const mstp = (state, ownProps) => {
    const productInfo = state.products.find(x => x.id == ownProps.productId);
    const colors = productInfo.subart.map(item => item.colorCode);

    return {
        colors,
        colorCode: ownProps.colorCode,
        onColorCodeChange: ownProps.onColorCodeChange,
    }
}

const mdtp = (dispatch) => {
    return {
        
    }
}

export default connect(mstp, mdtp)(ProductCardColorPicker);