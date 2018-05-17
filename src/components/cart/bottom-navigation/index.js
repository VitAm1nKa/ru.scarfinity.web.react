import React from 'react';

import './bottom-navigation.less';

import Currency from '../../utility/currency';
import NavLink from 'react-router-dom/NavLink';

const PaymentsCheck = (props) => {
    return(
        <div className="payments-check">
            <span className="payments-check__title">Итого</span>
            <Currency
                original={props.total}
                fontSize={26}
                fontWeight={600}/>
        </div>
    )
}

const BottomNavigation = (props) => {
    return(
        <div className={`cart__bottom-navigation${props.orderTotal ? ' check' : ''}`}>
            <div className="cart__bottom-navigation__left">
                <NavLink to={props.prevLink.path || '/'}>
                    <div className="cart__button-prev">{props.prevLink.title}</div>
                </NavLink>
            </div>
            <div className="cart__bottom-navigation__check">
                {
                    props.orderTotal != null &&
                    <PaymentsCheck total={props.orderTotal || 0} />
                }
            </div>
            <div className="cart__bottom-navigation__right">
                <NavLink to={props.nextLink.path || '/'}>
                    <div className="cart__button-next">{props.nextLink.title}</div>
                </NavLink>
            </div>
        </div>
    )
}

export default BottomNavigation;