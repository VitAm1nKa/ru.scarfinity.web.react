import React from 'react';

import './badge.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value || 0
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.value != nextProps.value) {
            this.setState({value: nextProps.value});
        }
    }

    value(value, max) {
        return `${Math.min(value, max)}${value > max ? '+' : ''}`;
    }

    render() {
        if(!this.state.value) return null;

        return(
            <span
                className="badge"
                style={this.props.style}>
                    {this.value(this.state.value, this.props.max)}
            </span>
        )
    }
}
Controller.defaultProps = {
    value: 0,
    max: 9
}

export default Controller;