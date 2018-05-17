import React            from 'react';
import { connect }      from 'react-redux';
import { matchPath }    from 'react-router';
import { 
    Route,
    Redirect
}                       from 'react-router-dom';

import * as Grid        from '../lib/grid';
import * as DefPages    from './DefaultPages';

import CatalogList      from '../components/filters/catalog-list';
import PriceRange       from '../components/filters/price-range';
import ColorPicker      from '../components/filters/color-picker';
import SeasonList       from '../components/filters/chb-season';
import RatingSelect     from '../components/filters/rating-select';

import CatalogHeader    from '../components/catalog/catalog-header';
import CatalogLoader    from '../components/catalog/catalog-loader';
import CatalogGrid      from '../components/catalog/catalog-grid';

import * as Store       from '../store/catalog';

import ProductCard      from './ProductCard';

class MiddleSectionController extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Grid.VerticalGrid>
                <CatalogHeader title={this.props.title}/>
                <CatalogGrid />
            </Grid.VerticalGrid>
        )
    }
}

class LeftSectionController extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Grid.VerticalGrid>
                {
                    !this.props.nodes.lenth &&
                    <CatalogList nodes={this.props.nodes} />
                }
                <PriceRange />
                <ColorPicker />
                <SeasonList />
                <RatingSelect />
            </Grid.VerticalGrid>
        )
    }
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: []
        }
    }

    componentWillMount() {
        this.setState({
            history: [...history, null]
        })
        this.props.catalogLoad('catalog');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            history: [...history, nextProps.catalogInfo]
        })
    }

    render() {
        if(this.props.catalogInfo == null) {
            return(
                <div>{"Loading..."}</div>
            )
        }

        return(
            <Grid.Row>
                <Grid.Container>
                    <Grid.Col lg={3} md={3}>
                        <LeftSectionController
                            nodes={this.props.catalogInfo.getNodes()}/>
                    </Grid.Col>
                    <Grid.Col lg={13} md={13}>
                        <MiddleSectionController
                            title={this.props.catalogInfo.title}/>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}

const mstp = state => state.catalog;

export default connect(mstp, Store.actionCreators)(Controller);