import React                from 'react';
import { connect }          from 'react-redux';

import * as FilterSate      from '../../store/filter';

import LeftMenu             from '../utility/left-menu';
import FilterContainerView  from './filter-block';

class Controller extends React.Component {
    render() {
        return(
            <FilterContainerView
                title={"Категория"}
                buttonTitle={"сброс"}
                buttonAction={this.props.onReset}>
                    <LeftMenu
                        productSubCategories={this.props.productSubCategories}
                        selectedNodes={this.props.selectedNodes}
                        onClick={this.props.onSelectNode}/>
            </FilterContainerView>
        )
    }
}

export default Controller;