import React from 'react';

import './header-navigation.less';

const renderState = [
    { s1: "active active--state-1", s2: "state-1", s3: "", s4: "", s5: "" },
    { s1: "complete", s2: "state-2", s3: "active active--state-2", s4: "state-3", s5: "" },
    { s1: "complete", s2: "", s3: "complete", s4: "state-4", s5: "active active--state-3" }
];

const delimTable = [
    [["#bf4f79", "#ffffff", "#ffffff"], ["#ffffff", "#ef8742", "#ffffff"], ["#ffffff", "#ffffff", "#d7d7d7"]],
    [["#ffffff", "#ffffff", "#d7d7d7"], ["#ef8742", "#ffffff", "#ffffff"], ["#ffffff", "#8869ca", "#ffffff"]],
]

const CartHeaderDelimIcon = (props) => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="51" viewBox="0 0 60 170">
            <path
                style={{
                    fillRule: "evenodd",
                    fill: delimTable[props.side][props.step][2],
                    transition: 'all 0.3s',
                }}
                d="M12,0h4L48,85,16,170H12L44,85Z"/>
            <path
                style={{
                    fillRule: "evenodd",
                    fill: delimTable[props.side][props.step][0],
                    transition: 'all 0.3s',
                }}
                d="M12,0L44,85,12,170H0V0H12Z"/>
            <path
                style={{
                    fillRule: "evenodd",
                    fill: delimTable[props.side][props.step][1],
                    transition: 'all 0.3s',
                }}
                d="M16,170L48,85,16,0H60V170H16Z"/>
        </svg>
    )
}
CartHeaderDelimIcon.defaultProps = {
    side: 0,
    step: 0,
}

const CartHeaderPaginationIcon = (props) => {
    const style = {
        iddle: {
            tria: "rgba(255, 255, 255, 0.0)",
            circle: "rgba(170, 170, 170, 0.5)",
            text: "#808080",
            icon: "rgba(27, 189, 105, 0.0)",
        },
        active: {
            tria: "rgba(255, 255, 255, 0.5)",
            circle: "rgba(255, 255, 255, 0.5)",
            text: "#ffffff",
            icon: "rgba(27, 189, 105, 0.0)",
        },
        done: {
            tria: "rgba(255, 255, 255, 0.0)",
            circle: "rgba(27, 189, 105, 1.0)",
            text: "rgba(0, 0, 0, 0.0)",
            icon: "rgba(27, 189, 105, 1.0)",
        },
    }

    const currentStyle = props.state <= 0 ? style.iddle : props.state == 1 ? style.active : style.done;

    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 300 300" {...props.style}>
            <path
                style={{
                    fillRule: 'evenodd',
                    fill: currentStyle.tria,
                    transition: 'all 0.3s ease',
                }}
                d="M265.232,120.641L300,150l-34.848,29.428S270,171.053,270,150C270,128.689,265.232,120.641,265.232,120.641Z"/>
            <path
                style={{
                    fillRule: 'evenodd',
                    fill: currentStyle.circle,
                    transition: 'all 0.3s ease',
                }}
                d="M150,30A120,120,0,1,1,30,150,120,120,0,0,1,150,30Zm0,15A105,105,0,1,1,45,150,105,105,0,0,1,150,45Z"/>
            <text
                style={{
                    fontSize: 18,
                    textAnchor: 'middle',
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    fillRule: 'evenodd',
                    fill: currentStyle.text,
                    transition: 'all 0.3s ease',
                }}
                transform="translate(152 187) scale(6.45 5.8)">{props.value}</text>
            <path
                style={{
                    fillRule: 'evenodd',
                    fill: currentStyle.icon,
                    transition: 'all 0.3s ease',
                }}
                d="M195.943,137.3L148.97,182.236l-4.99,4.779a7.3,7.3,0,0,1-9.979,0l-4.989-4.779L104.064,158.37a6.554,6.554,0,0,1,0-9.554l4.989-4.766a7.275,7.275,0,0,1,9.979,0l19.958,19.1,41.985-40.171a7.275,7.275,0,0,1,9.979,0l4.989,4.769A6.556,6.556,0,0,1,195.943,137.3Z"/>
        </svg>
    )
}
CartHeaderPaginationIcon.defaultProps = {
    value: 1,
    state: 0,
    size: 40,
    style: {},
}

const HeaderNavigation = (props) => {
    const render = renderState[props.step];
    return(
        <div className="cart__header-navigation">
            <div className={`cart__header-navigation__navigation-item ${render.s1}`}>
                <CartHeaderPaginationIcon value={1} state={props.step + 1} />
                <span className="cart__header-navigation__navigation-item__text">{"Корзина заказов"}</span>
            </div>
            <CartHeaderDelimIcon
                side={0}
                step={props.step} />
            <div className={`cart__header-navigation__navigation-item ${render.s3}`}>
                <CartHeaderPaginationIcon value={2} state={props.step} />
                <span className="cart__header-navigation__navigation-item__text">{"Доставка"}</span>
            </div>
            <CartHeaderDelimIcon
                side={1}
                step={props.step} />
            <div className={`cart__header-navigation__navigation-item ${render.s5}`}>
                <CartHeaderPaginationIcon value={3} state={props.step - 1} />
                <span className="cart__header-navigation__navigation-item__text">{"Способ оплаты"}</span>
            </div>
        </div>
    )
}
HeaderNavigation.defaultProps = {
    step: 0,
    onStepClick: () => {},
}

export default HeaderNavigation;