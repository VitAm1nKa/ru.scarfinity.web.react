import React from 'react';

var getRibbonType = (ribbonType) => {
    switch(ribbonType) {
        case "hot": return {
            base: "#ef8742",
            shadow: "#d76f31",
            text: 'горячее!',
        }
        case "new": return {
            base: "#8869ca",
            shadow: "#7557b4",
            text: 'новинка!',
        }
        case "sale": return {
            base: "#9cbf3e",
            shadow: "#86a72e",
            text: 'скидка!',
        }
        default: return {
            base: "#ef8742",
            shadow: "#d76f31",
            text: 'горячее!',
        }
    }
}

export const HorisontalRibbon = (props) => {
    const style = getRibbonType(props.ribbonType);

    return(
        <span
            style={{
                display: 'block',
                fontWeight: 500,
                color: 'white',
                backgroundColor: style.base,
                fontSize: props.size,
                padding: `${Math.ceil(props.size / 5)}px ${Math.ceil(props.size / 4) * 2}px`,
                borderRadius: Math.round(props.size / 6),
            }}>
                {style.text}
        </span>
    )
}
HorisontalRibbon.defaultProps = {
    size: 12,
    ribbonType: 'hot'
}

const Ribbon = (props) => {
    const style = getRibbonType(props.ribbonType);
    return(
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={props.size}
            height={props.size}
            viewBox="0 0 180 180">
            <path
                style={{
                    fillRule: '',
                    fill: style.base,
                }}
                d="M10,0H90l90,90v80Z"/>
            <path
                style={{
                    fillRule: '',
                    fill: style.shadow,
                }}
                d="M0,10L10,0,20,10H0ZM170,180l10-10-10-10v20Z"/>
            <text
                style={{
                    fontSize: 28,
                    fill: '#fff',
                    textAnchor: 'middle',
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                }}
                transform="translate(106 72) rotate(45)">{style.text}</text>
        </svg>
    )
}
Ribbon.defaultProps = {
    size: 75,
    ribbonType: "hot",
}

export default Ribbon;