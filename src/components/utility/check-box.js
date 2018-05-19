import React from 'react';

import './check-box.less';

const CheckBoxIcon = (props) => {

    const currentState = {
        borderColor: '#aaaaaa',
        iconColor: '#ffffff'
    };

    if(props.disabled) {
        currentState.borderColor = '#d7d7d7';
        currentState.iconColor = '#ffffff';

        if(props.selected) {
            currentState.borderColor = '#d7d7d7';
            currentState.iconColor = '#d7d7d7';
        }
    } else {
        if(props.hover) {
            currentState.borderColor = '#aaaaaa',
            currentState.iconColor = '#aaaaaa'
        }
    
        if(props.selected) {
            currentState.borderColor = '#1bb869';
            currentState.iconColor = '#1bb869';
        }
    }

    return( 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 200 200">
            <rect style={{fill: currentState.borderColor, transition: 'all 0.3s ease'}} width="200" height="200" rx="20" ry="20"/>
            <rect style={{fill: '#fff'}} width="170" height="170" rx="10" ry="10" x="15" y="15"/>
            <path
                style={{
                    fill: currentState.iconColor,
                    fillRule: 'evenodd',
                    transition: 'all 0.3s ease'
                }}
                d="M152.614,82.234l-53.8,53.791-5.715,5.7a8.074,8.074,0,0,1-11.429,0l-5.715-5.7L47.387,107.444a8.088,8.088,0,0,1,0-11.433l5.715-5.7a8.083,8.083,0,0,1,11.429,0l22.857,22.861,48.083-48.084a8.066,8.066,0,0,1,11.428,0l5.715,5.707A8.1,8.1,0,0,1,152.614,82.234Z"/>
        </svg>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hover: false
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.checked != nextProps.checked) {
            this.setState({
                checked: nextProps.checked
            });
        }
    }

    handleClick() {
        if(!this.props.disabled) {
            if(this.props.onChange != null) {
                this.props.onChange(this.props.checked);
            } 
        }
    }

    handleMouseEnter() {
        this.setState({hover: true});
    }

    handleMouseLeave() {
        this.setState({hover: false});
    }

    render() {
        return(
            <div
                className="check-box"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onClick={this.handleClick}>
                    <CheckBoxIcon
                        hover={this.state.hover}
                        selected={this.props.checked}
                        disabled={this.props.disabled}/>
                    <span className={`check-box__title ${this.state.checked && "check-box__title--checked"}`}>
                        {this.props.title}
                        <span className="check-box__subtitle">
                            {this.props.subTitle ? `(${this.props.subTitle})` : ""}
                        </span>
                    </span>
            </div>  
        )
    }
}

export default Controller;