import React from 'react';

import './info-line.less';

const Line = (props) => {
    switch(props.type) {
        case 'text': return(
            <div className="info-line__text">{props.value}</div>
        )
        case 'phone': return(
            <div className="info-line__phone">
                {`${props.value}: `}
                <span className="info-line__phone__number">{props.value2}</span>
            </div>
        )
        case 'email': return(
            <div className="info-line__email">{props.value}</div>
        )
        default: null;
    }
}

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="info-line">
                <div className="info-line__title">{this.props.title}</div>
                {
                    _.map(this.props.lines, (line, index) => <Line key={index} {...line} />)
                }
            </div>
        )
    }
}

export default Controller;