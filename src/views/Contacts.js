import React        from 'react';
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

import MainContacts                 from '../components/contacts/main-contacts';

class Controller extends React.Component {
    componentWillMount() {
        if(this.props.match.params.id == 4) {
            // Сообщить о том что данная страница не существет
            // К примеру товарас Id 4 нет в базе данных
            if(this.props.onPageNotFound) {
                this.props.onPageNotFound();
            }
        }
    }

    componentWillReceiveProps() {

    }

    render() {
        return <DefPages.Default404 />;
    }
}

export default connect(state => ({
    shop: state.shop
}), {})(Controller);