import React    from 'react';

import './value-switch.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(item) {
        if(this.props.onValueChange) {
            if(item != this.props.selectedValue) {
                this.props.onValueChange(item);
            }
        }
    }

    render() {
        if(this.props.items == null || this.props.items.length == 0) {
            return null;
        }

        return(
            <div className="value-switch">
                <span className="value-switch__title">{this.props.title}</span>
                <div className="value-switch__items">
                    {
                        _.map(this.props.items, (item, index) => {
                            return(
                                <div
                                    key={index}
                                    onClick={() => {this.handleClick(item)}}
                                    className={`value-switch__item${
                                        this.props.selectedValue == item ? ' value-switch__item--active': ''}`}>
                                            {item}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Controller;