import React        from 'react';
import {connect}    from 'react-redux';

{/*Блок с контейнером цветов*/}
const ProductCardPricing = (props) => {
    return React.Children.only(
        React.cloneElement(props.children, {
            cost: props.cost,
            saleCost: props.saleCost,
        })
    );
}

const mstp = (state, ownProps) => {
    const productInfo = state.products
            .find(x => x.id == ownProps.productId).subart
            .find(x => x.colorCode == ownProps.colorCode);

    return Object.assign({}, ownProps, {
        cost: productInfo.cost,
        saleCost: productInfo.saleCost,
    });
}

const mdtp = (dispatch) => {
    return {
        
    }
}

export default connect(mstp, mdtp)(ProductCardPricing);