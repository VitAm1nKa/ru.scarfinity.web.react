import React        from 'react';
import {connect}    from 'react-redux';
import { 
    Switch,
    Route,
    NavLink
}                   from 'react-router-dom';
import update       from 'immutability-helper';

import {
    BasicInput,
    PhoneInput,
    EmailInput
}                   from '../utility/input';
import {
    BasicButton
}                   from '../utility/buttons';
import {
    PageHeader
}                   from '../utility/titles';
import {
    BreadCrumb
}                   from '../navigation/bread-crumbs';

import Paper        from 'material-ui/Paper';

import Order        from './orders-history-order';
import OrderList    from './orders-history-orders';
import * as Grid    from '../../lib/grid';

import {
    actionCreators as SalesOrdersActions
}                   from '../../store/salesOrders';

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        // Загрузка заказов пользователя
        this.props.getSalesOrders();
    }

    handleChange(event) {
        const inputName = event.target.name;
        const inputValue = event.target.value;
    }

    render() {
        return(
            <Grid.VerticalGrid>
                <BreadCrumb seo='orders' title='Список заказов' />
                <PageHeader title="Мои заказы"/>  
                <Switch>
                    <Route exact path={this.props.match.path} component={OrderList} />
                    <Route path={`${this.props.match.path}/:id`} component={Order} />
                </Switch>
            </Grid.VerticalGrid>
        )
    }
}

export default connect(state => ({}), Object.assign({}, SalesOrdersActions))(Controller);