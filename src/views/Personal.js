import React                        from 'react';
import { connect }                  from 'react-redux';
import { 
    Switch,
    Route,
    Redirect, 
    NavLink
}                                   from 'react-router-dom';
import {SiteRoutes}                 from "../store/__routes";

import * as DefPages                from './DefaultPages';
import * as Grid                    from '../lib/grid';

import { BreadCrumb }               from '../components/navigation/bread-crumbs';
import ReviewsContainer             from '../components/reviews/reviews-container';

import PersonalMenu                 from '../components/utility/personal-menu';

import PersonalData                 from '../components/personal/personal-data';
import OrdersHistory                from '../components/personal/orders-history';
import ChangePassword               from '../components/personal/change-password';


class Controller extends React.Component {
    constructor(props) {
        super(props);

        console.log("Personal: init");
    }

    componentWillReceiveProps(nextProps) {
        console.log("Personal: receive props", nextProps);
    }

    render() {  
        return(
            <Grid.Row>
                <Grid.Container>
                    <BreadCrumb seo='personal' title='Аккаунт'/>
                    <Grid.Col lg={3} md={3} sm={16} xs={16}>
                        <PersonalMenu
                            links={[
                                {title: 'Персональные данные', path: SiteRoutes.presonal.personalData.path, use: true, badge: 0},
                                {title: 'Мои заказы', path: SiteRoutes.presonal.oredersHistory.path, use: true, badge: 0},
                                {title: 'Рекомендации', path: '/', use: true, badge: 0},
                                {title: 'Сообщения', path: '/', use: true, badge: 5},
                                {title: 'Список желаний', path: '/cart/wishlist', use: true, badge: 0},
                                {title: 'Сменить пароль', path: SiteRoutes.presonal.changePassword.path, use: true, badge: 0},
                            ]}/>
                    </Grid.Col>
                    <Grid.Col lg={13} md={13} sm={16} xs={16}>
                        <Switch>
                            <Route path={SiteRoutes.presonal.personalData.path} component={PersonalData} />
                            <Route path={SiteRoutes.presonal.oredersHistory.path} component={OrdersHistory} />
                            <Route path={SiteRoutes.presonal.changePassword.path} component={ChangePassword} />
                        </Switch>
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}

const mstp = state => {}

export default Controller;