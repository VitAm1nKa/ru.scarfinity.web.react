import React        from 'react';
import Currency     from './currency';

import './price-calculation.less';

const PriceCalculationView = (props) => {
    return(
        <div className="price-calculation">
            <div className="price-calculation__row">
                <span className="price-calculation__row__text">Товары</span>
                <span className="price-calculation__row__sign"></span>
                <span className="price-calculation__row__text">Доставка</span>
                <span className="price-calculation__row__sign"></span>
                <span className="price-calculation__row__text accent">Сумма</span>
            </div>
            <div className="price-calculation__row">
                <span className="price-calculation__row__text">
                    <Currency
                        original={(props.productsTotal || 0)}
                        fontSize={16}
                        fontWeight={400}
                        glyphFull />
                </span>
                <span className="price-calculation__row__sign plus"></span>
                <span className="price-calculation__row__text">
                    <Currency
                        original={(props.deliveryTotal || 0)}
                        fontSize={16}
                        fontWeight={400}
                        glyphFull />
                </span>
                <span className="price-calculation__row__sign equals"></span>
                <span className="price-calculation__row__text accent">
                    <Currency
                        original={(props.productsTotal || 0) + (props.deliveryTotal || 0)}
                        fontSize={16}
                        fontWeight={500}
                        glyphFull />
                </span>
            </div>
        </div>
    )
}

export default PriceCalculationView;