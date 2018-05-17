import React            from 'react';
import { 
    Switch,
    Route
}                       from 'react-router';

import * as Grid        from '../lib/grid';

import Catalog          from './catalog';
import Category         from './category';
import Products         from './products';
import Product          from './product';
import Images           from './images';
import Orders           from './orders';
import Order            from './order';
import StickyTest       from './sticky-test';
import Inputs           from './inputs';
import Navigations      from './navigations';
import Fetch            from './fetch';
//
import Sandbox          from './sandbox';

class Develop extends React.Component {
    render() {
        return(
            <div className="develop">
                <Grid.Row>
                    <Grid.Container>
                        <Grid.Col lg={3} md={3} sm={16}></Grid.Col>
                        <Grid.Col lg={13} md={13} sm={16}>
                            <Switch>
                                <Route path={`${this.props.match.path}/catalog`} exact component={Catalog}/>
                                <Route path={`${this.props.match.path}/category/:id`} exact component={Category}/>
                                <Route path={`${this.props.match.path}/catalog/:id`} component={Catalog}/>
                                <Route path={`${this.props.match.path}/images`} component={Images}/>
                                <Route path={`${this.props.match.path}/product`} exact component={Products}/>
                                <Route path={`${this.props.match.path}/product/:id`} component={Product}/>
                                <Route path={`${this.props.match.path}/order`} exact component={Orders}/>
                                <Route path={`${this.props.match.path}/order/:id`} component={Order}/>
                                <Route path={`${this.props.match.path}/sandbox`} exact component={Sandbox}/>
                                <Route path={`${this.props.match.path}/sticky`} exact component={StickyTest}/>
                                <Route path={`${this.props.match.path}/inputs`} exact component={Inputs}/>
                                <Route path={`${this.props.match.path}/navs`} exact component={Navigations}/>
                                <Route path={`${this.props.match.path}/fetch`} exact component={Fetch}/>
                            </Switch>
                        </Grid.Col>
                    </Grid.Container>
                </Grid.Row>
            </div>
        )
    }
}

export default Develop;