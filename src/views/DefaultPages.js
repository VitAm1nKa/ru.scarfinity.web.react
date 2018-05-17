import React from 'react';

export const Default404 = () => {
    return(
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 500,
            color: '#3c5569',
            fontSize: 42,
            fontWeight: 500
        }}><span>{"404"}</span></div>
    )
}

export const DefaultDev = (props) => {
    return(
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 500,
            color: '#3c5569',
            fontSize: 42,
            fontWeight: 500
        }}>
            <div>{"Страница в разработке"}</div>
            <p style={{color: '#808080', fontSize: 20}}>{props.info}</p>
        </div>
    )
}

export const DefaultContentDev = (props) => {
    return(
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 500,
            color: '#3c5569',
            fontSize: 42,
            fontWeight: 500
        }}>
            <div>{"Контент страницы в разработке"}</div>
            <p style={{color: '#808080', fontSize: 20}}>{props.info}</p>
        </div>
    )
}