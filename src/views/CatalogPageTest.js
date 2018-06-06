import React                from 'react';
import PropTypes            from 'prop-types';
import { connect }          from 'react-redux';
import { Route }            from 'react-router-dom';
import { fetch, addTask }   from 'domain-task';
import InfiniteScroll       from 'react-infinite-scroller';

import * as Grid            from '../lib/grid';
import ProductCard          from '../components/utility/catalog-product-card';
import LazyLoader           from '../components/utility/lazy-loader';

import { ProductModel }     from '../store/__models';

import { 
    __productModel,
    __catalogPage
}   from '../store/api-requests';

import Catalog              from './Catalog';

import { actionCreators }   from '../store/values';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageNumber: 0,
            productsOnPage: 20,
            productModels: [],
            hasMore: true,
            loading: false,
            data: []
        }
        this.handleProductOnCartAdd = this.handleProductOnCartAdd.bind(this);
    }

    componentWillMount() {
        this.props.getValues();
    }

    componentWillReceiveProps(props) {
        console.log(props);
        this.setState({
            data: props.values
        })
    }

    handleProductOnCartAdd(productModelId, productId) {

    }

    render() {
        return(
            <div>
                {
                    _.map(this.props.values, d => {
                        return(<h1>{d}</h1>)
                    })
                }
            </div>
        )
    }
}

export default connect(state => ({
    values: state.values
}), Object.assign({}, actionCreators))(Controller);