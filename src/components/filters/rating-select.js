import React                from 'react';
import { connect }          from 'react-redux';

import * as FilterSate      from '../../store/filter';

import RatinCheckBoxWidget  from '../utility/rating-check-box';
import FilterContainerView  from './filter-block';

const View = (props) => {
    return(
        <FilterContainerView
            title={"Рейтинг"}
            buttonTitle={"сброс"}
            buttonAction={props.onReset}>
                <RatinCheckBoxWidget
                    selectedIndex={props.rating}
                    maxAverageRating={props.maxAverageRating}
                    onIndexChange={props.onRatingChange}/>
        </FilterContainerView>
    )
}

export default View;