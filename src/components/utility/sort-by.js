import React from 'react';

import './sort-by.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(id) {
        if(this.props.handleSelectChange) {
            this.props.handleSelectChange(id);
        }
    }

    render() {
        return(
            <div className="sort-by-line">
                {
                    _.map(this.props.items, item => 
                        <div
                            key={item.id}
                            className={`sort-by${
                                this.props.selectedId == item.id ? ' sort-by--selected' : ''
                            }${
                                (!this.props.desc && this.props.selectedId == item.id) ? ' sort-by--straight': ''
                            }`}
                            onClick={() => {this.handleClick(item.id)}}>
                                {item.title}
                    </div>)
                }
            </div>
        )
    }
}

export default Controller;