import React from 'react';

import './tab-view.less';

export const Tab = (props) => {
    return(
        <div className="tab-view__container__content">{props.children}</div>
    )
}

export class TabView extends React.Component {
    constructor(props) {
        super(props);

        this.state = { index: 0 };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(index) {
        if(index != this.state.index) {
            this.setState({index});
        }
    }

    render() {
        const navItems = _.map(this.props.children, (tab, index) =>
            <div 
                key={index} 
                className={`tab-view__navigation__item ${(this.state.index === index) ? "tab-view__navigation__item--active" : ""}`}
                onClick={() => {this.handleClick(index)}}>
                    {tab.props.title}
            </div>
        );

        return(
            <div className="tab-view">
                <div className="tab-view__navigation">
                    {navItems}
                </div>
                <div className="tab-view__paper">
                    <div className="tab-view__navigation tab-view__navigation--fake">
                        {navItems}
                    </div>
                    <div className={`tab-view__container${this.state.index === 0 ? " rao-border" : ""}`}>
                        {
                            this.props.children[this.state.index]
                        }
                    </div>
                </div>
            </div>
        );
    }
} 
