import React        from 'react';
import { connect }  from 'react-redux';
import {
    NavLink
}                   from 'react-router-dom';

import * as Grid    from '../../lib/grid';
import ValueSwitch  from '../utility/value-switch';
import SortBy       from '../utility/sort-by';

import './catalog-header.less';

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="catalog-header-line1">
                <SortBy
                    items={this.props.sortByItems}
                    selectedId={this.props.sortBySelectedId}
                    desc={this.props.sortByDesc}
                    handleSelectChange={this.props.onSortByChange}/>
                <ValueSwitch
                    selectedValue={this.props.itemsOnPage}
                    items={this.props.itemsOnPageValues}
                    onValueChange={this.props.onItemsOnPageChange}
                    title="Показывать по:"/>
            </div>
        )
    }
}

export default Controller;