import React                from 'react';
import { connect }          from 'react-redux';

import * as FilterSate      from '../../store/filter';

import CheckBoxList         from '../utility/check-box-list';
import FilterContainerView  from './filter-block';

const Seasons = [
    { code: '15', title: 'Всесезон', use: true },
    { code: '5', title: 'Демисезон', use: true },
    { code: '1', title: 'Осень', use: false },
    { code: '2', title: 'Зима', use: true },
    { code: '4', title: 'Весна', use: false },
    { code: '8', title: 'Лето', use: true },
    { code: '3', title: '', use: false },
    { code: '6', title: '', use: false },
    { code: '7', title: '', use: false },
    { code: '9', title: '', use: false },
    { code: '10', title: '', use: false },
    { code: '11', title: '', use: false },
    { code: '12', title: '', use: false },
    { code: '13', title: '', use: false },
    { code: '14', title: '', use: false },
];

class Controller extends React.Component {
    render() {
        const items = _.map(_.filter(Seasons, season => season.use), season => {
            const itemInfo = _.find(this.props.seasons, i => i.code == season.code) || { count: 0 };
            const selected = ((this.props.selectedSeasonsCodes & season.code) == season.code);// _.includes(this.props.selectedSeasonsCodes, season.code);

            return {
                id: season.code,
                title: season.title,
                subTitle: itemInfo.count.toString(),
                checked: selected,
                disabled: itemInfo.count == 0
            }
        })

        return(
            <FilterContainerView
                title={"Сезон"}
                buttonTitle={"сброс"}
                buttonAction={this.props.onReset}>
                    <CheckBoxList
                        items={items}
                        onChange={this.props.onSelectChange}/>
            </FilterContainerView>
        )
    }
}

export default Controller