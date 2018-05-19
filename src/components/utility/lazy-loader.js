import React from 'react';

import './lazy-loader.less';

const LazyLoaderIcon = (props) => {
    const width = props.size / 2;
    const margin = Math.floor(props.size / 5);

    return(
        <div className="lazy-loader-icon">
            <span
                className="lazy-loader-icon__circle"
                style={{
                    borderWidth: width,
                    marginRight: margin,
                }}></span>
            <span
                className="lazy-loader-icon__circle"
                style={{
                    borderWidth: width,
                    marginLeft: margin,
                    marginRight: margin,
                }}></span>
            <span
                className="lazy-loader-icon__circle"
                style={{
                    borderWidth: width,
                    marginLeft: margin,
                }}></span>
        </div>
    )
}
LazyLoaderIcon.defaultProps = {
    size: 10,
}

const LazyLoader = (props) => {
    return(
        <div className="lazy-loader-view">
            <LazyLoaderIcon
                size={props.size}/>
            {
                props.text !== "" &&
                <span
                    className="lazy-loader-view__text"
                    style={{
                        fontSize: Math.max(props.size + 2, 11),
                    }}
                    >{props.text}</span>
            }
        </div>
    )
}
LazyLoader.defaultProps = {
    text: "",
    size: 10,
}

export default LazyLoader