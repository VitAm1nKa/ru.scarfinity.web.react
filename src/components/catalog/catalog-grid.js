import React            from 'react';
import { connect }      from 'react-redux';
import InfiniteScroll   from 'react-infinite-scroller';
import update           from 'immutability-helper';
import qs               from 'qs';
import * as CartStore   from '../../store/cart';
import * as CatalStore  from '../../store/catalog';

import * as Grid        from '../../lib/grid';

import ProductCard      from '../utility/catalog-product-card';
import LazyLoader       from '../utility/lazy-loader';

class Controller extends React.Component {
    render() {
        const loader = <LazyLoader text={"Загрузка"} />

        return(
            <InfiniteScroll
                pageStart={0}
                initialLoad={true}
                loadMore={this.props.loadMore}
                hasMore={this.props.hasMore}
                loader={loader}>
                    <Grid.Row>
                        <Grid.Container>
                            {
                                _.map(this.props.products, (product, index) => {
                                    return(
                                        <Grid.Col
                                            grid={12} lg={3} md={3} sm={4} xs={6}
                                            key={index}>
                                                <ProductCard
                                                    {...product}
                                                    onCartAdd={this.props.onCartAdd}/>
                                        </Grid.Col>
                                    )
                                })
                            }
                        </Grid.Container>
                    </Grid.Row>
            </InfiniteScroll>
        )
    }
}

export default Controller;