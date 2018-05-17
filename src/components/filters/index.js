import React            from 'react';
import {
    Sticky
}                       from 'react-sticky';
import SlideContainer   from '../utility/slide-container';
import { Filter }       from '../utility/icons';
import { Dropdown }     from '../utility/input';

const FilterToggleButton = (props) => {
    return(
        <div
            onClick={props.onClick}
            className={`filter-toggle-button${
                props.toggle ? ' filter-toggle-button--active' : ''}`}>
                    <Filter />
        </div>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }

        this.handleFilterToggle = this.handleFilterToggle.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentWillMount() {
        document.addEventListener("resize", this.handleResize);
    }

    handleResize() {
        if(document.documentElement.clientWidth >= 768 && this.state.open == true) {
            this.setState({open: false});
        } 
    }

    handleFilterToggle() {
        this.setState({open: !this.state.open});
    }

    componentWillUnmount() {
        document.removeEventListener("resize", this.handleResize)
    }

    render() {
        console.log(this.props);
        return(
            <div className={'filters-container filters-container--sticky'}>
                <div className="filters-container__navigation">
                    <FilterToggleButton
                        toggle={this.state.open}
                        onClick={this.handleFilterToggle}/>
                    <span className="filters-container__navigation__title">{"Сортировать:"}</span>
                    <div className="filters-container__navigation__dropdown">
                        <Dropdown
                            white
                            options={_.map(this.props.sortByItems, item => ({
                                id: item.id,
                                value: `${item.title} ${item.id == this.props.sortBySelectedId && !this.props.sortByDesc ? '↑' : '↓'}`
                            }))}
                            value={`${this.props.sortByItems[this.props.sortBySelectedId].title} ${this.props.sortByDesc ? '↑' : '↓'}`}
                            onSelect={option => this.props.onSortByChange(option.id)}/>
                    </div>
                </div>
                <div className={`filters-container__filters${
                    !this.state.open ? ' filters-container__filters--close' : ''
                }`}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Controller;