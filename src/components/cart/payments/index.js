import React            from 'react';
import CheckBox         from '../../utility/check-box';
import RadioBoxGroup    from '../../utility/radio-box-group';
import {
    VerticalGrid
}                       from '../../../lib/grid';

import './payments.less';

const Payments = (props) => {
    const cash = [
        { id: 0, title: "Оплата при получении", subTitle: "Наличный" },
        { id: 1, title: "Банковский перевод", subTitle: "безналичный" },
        { id: 2, title: "Оплата на сайте", subTitle: "безналичный", disabled: true }
    ]

    return(
        <div className="payments">
            <div className="requisites-row">
                <div className="requisites-row__left">
                    <span className="requisites-title">Способ <b>оплаты</b></span>
                    <VerticalGrid>
                        <RadioBoxGroup
                            title="Выберите способ"
                            name="paymentMethodId"
                            items={cash}
                            value={props.fieldValue("paymentMethodId")}
                            valid={props.fieldValid("paymentMethodId")}
                            onChange={props.onValueChange}/>
                    </VerticalGrid>
                </div>
                <div className="requisites-row__middle requisites-row__middle--delim"></div>
                <div className="requisites-row__right">
                    <span className="requisites-title"><b>Платежный </b>адрес</span>
                    <CheckBox
                        title="Платежный адрес совпадает с адресом доставки"
                        subTitle={"недоступно"}
                        checked={true}
                        disabled={true}/>
                </div>
            </div>
        </div>
    )
}

export default Payments;

