import React        from 'react';
import update       from 'immutability-helper';
import CheckBox     from './check-box';
import {
    NavLink
}                   from 'react-router-dom';

import './left-menu.less';

const LeftMenuItem = (props) => {
    return(
        <div className={`left-menu__item${
            !props.productModelCount ? ' left-menu__item--disabled' :
            props.selected ? ' left-menu__item--selected' : ''
        }`}>
            <NavLink 
                to={`${props.path}`}
                className="left-menu__item__title">
                    {props.title}
                    <span>{`(${props.productModelCount || 0})`}</span>
            </NavLink>
            <div className="left-menu__item__right">
                <CheckBox
                    checked={props.selected}
                    onChange={props.onClick}/>
            </div>
        </div>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(index, selected) {
        if(this.props.onClick) {
            this.props.onClick(index, selected);
        }
    }

    render() {
        return(
            <div className="left-menu">
                <div className="left-menu__container">
                    {
                        _.map(this.props.productSubCategories, productSubCategory => {
                            const selected = _.includes(this.props.selectedNodes, (productSubCategory.productCategoryId || 0).toString());
                            return(
                                <LeftMenuItem
                                    key={productSubCategory.productCategoryId}
                                    {...productSubCategory}
                                    selected={selected}
                                    onClick={() => {this.handleClick(productSubCategory.productCategoryId, selected)}}/>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Controller;