import React        from 'react';
import { connect }  from 'react-redux';
import * as Grid    from '../../lib/grid';
import StoreBage    from '../utility/store-bage';
import Loader       from '../utility/loader';          

import './stores-line.less';

class Controller extends React.Component {
    render() {
        const state = (() => {
            if(this.props.shop.fetch == true) return 'loading'
            else if(this.props.shop.fetch == false && this.props.shop.fetchError == false) return 'success'
            else return 'error';
        })();

        return(
            <Grid.Row className="stores-line">
                <Grid.Container>
                    <Grid.Col>
                        <Grid.VerticalGrid>
                            <span className="stores-line-title">{"Наши магазины"}</span>
                            <Grid.Row>
                                <Grid.Container className="stores-line__container">
                                    {
                                        state == 'loading' ? <Loader /> :
                                        state == 'success' ? _.map(this.props.shop.shops, shop => {
                                            return(
                                                <Grid.Col key={shop.shopId} lg={4} md={4} sm={16} xs={16}>
                                                    <StoreBage
                                                        store={shop}
                                                        path={`/contacts/${shop.shopId}`}/>
                                                </Grid.Col>
                                            )
                                        }) : "Errors..."
                                    }
                                </Grid.Container>
                            </Grid.Row>
                        </Grid.VerticalGrid>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}

export default connect(state => ({
    shop: state.shop
}), {})(Controller);