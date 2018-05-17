import React from 'react';

const ChevronLeft = (props) => {
    return(
        <svg
            style={{
                marginRight: 8
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 100 100">
                <path fill='gray' fillRule='evenodd' d="M23.9,54.7L67.116,97.98A7.123,7.123,0,0,0,77.167,87.912L39.226,49.928l37.94-37.995a6.951,6.951,0,0,0-.251-9.811,6.927,6.927,0,0,0-9.8-.249L23.9,45.144a6.545,6.545,0,0,0-1.879,4.508c0,0.087-.018.181-0.019,0.276s0.014,0.182.019,0.276A6.535,6.535,0,0,0,23.9,54.7Z"/>
        </svg>
    )
}

const ChevronRight = (props) => {
    return(
        <svg
            style={{
                marginLeft: 8
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 100 100">
            <path
                fill='gray'
                fillRule='evenodd'
                d="M77.1,45.213L33.934,1.9a6.917,6.917,0,0,0-9.789.257,6.968,6.968,0,0,0-.251,9.821l37.9,38.02-37.9,38.03a7.119,7.119,0,0,0,10.04,10.07L77.1,54.783a6.557,6.557,0,0,0,1.877-4.512c0-.087.018-0.181,0.019-0.277s-0.014-.182-0.019-0.277A6.547,6.547,0,0,0,77.1,45.213Z"/>
        </svg>
    )
}

const FlatButton = (props) => {
    return(
        <button
            className="s-flat-button"
            onClick={props.onClick}>
                {props.chevronLeft && <ChevronLeft />}
                {props.label && <span className="s-flat-button__label">{props.label}</span>}
                {props.chevronRight && <ChevronRight />}
        </button>
    )
}

export default FlatButton;