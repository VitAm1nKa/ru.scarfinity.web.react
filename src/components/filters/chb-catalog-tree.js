import React                from 'react';
import { connect }          from 'react-redux';

import * as FilterSate      from '../../store/filter';

import LeftMenu             from '../navigation/left-menu';
import FilterContainerView  from './filter-block';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [
                {id: 1, title: 'Всесезон', count: 10},
                {id: 8, title: 'Демисезон', count: 1},
                {id: 5, title: 'Зима', count: 1},
                {id: 7, title: 'Лето', count: 2},
            ]
        }

        this.handleClear = this.handleClear.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentWillMount() {

    }

    handleChange(index, checked) {
        if(checked) {
            this.props.addSeason(index);
        } else {
            this.props.removeSeason(index);
        }
    }

    handleClear() {

    }

    render() {
        const items = _.map(this.state.items, item => {
            const disabled = item.count <= 0;
            const checked = _.findIndex(this.props.items, x => x === item.id) != -1;
            return {
                id: item.id,
                title: item.title,
                subTitle: item.count,
                checked,
                disabled
            }
        });
        return(
            <FilterContainerView
                title={"Сезон"}
                buttonTitle={"сброс"}
                buttonAction={this.handleClear}>
                    
            </FilterContainerView>
        )
    }
}

const mstp = (state, ownProps) => {
    return {
        items: state.filter.season
    }
}

const mdtp = FilterSate.actionCreators.season;

export default connect(mstp, mdtp)(Controller);