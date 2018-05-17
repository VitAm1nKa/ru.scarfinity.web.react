import React                from 'react';

import PriceRange           from '../utility/price-range';
import FilterContainerView  from './filter-block';

class Controller extends React.Component {
    render() {
        return(
            <FilterContainerView
                title="Цена"
                buttonTitle={"сброс"}
                buttonAction={this.props.onReset}>
                    <PriceRange
                        leftValue={this.props.leftValue}
                        rightValue={this.props.rightValue}
                        minValue={this.props.minValue}
                        maxValue={this.props.maxValue}
                        onValueChange={this.props.onValueChange}/>
            </FilterContainerView>
        )
    }
}

export default Controller;