import React                from 'react';
import { connect }          from 'react-redux';
import { GridLine }         from '../lib/grid';
import { BreadCrumb }       from '../components/navigation/bread-crumbs';

import CatalogHeader        from '../components/catalog/catalog-header';
import Cart                 from '../components/cart';
import RecenlyViewvedSmall  from '../components/recenly-viewed/recenly-viewed-small';
import {
    Switch,
    Route 
}                           from 'react-router-dom';

const WishList = (props) => {
    return(
        <GridLine>
            <BreadCrumb seo={'wishlist'} title={'Список желаний'} />
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 400,
                fontSize: 48,
                color: '#303030'
            }}>
                {"WISHLIST"}
                <T><Empty /></T>
            </div>
        </GridLine>
    )
}

const T = (props) => {
    console.log(_.flatten([props.children]));
    <div>
        {
            React.Children.map(props.children, ch => {
                console.log(ch);
                return(React.cloneElement(ch, ch.props));
            })
        }
    </div>

    return null;
}

const Empty = (props) => {
    return null;
}

class Controller extends React.Component {
    render() {
        return(
            <GridLine>
                <BreadCrumb seo={'cart'} title={'Корзина'} />
                <Switch>
                    <Route path='/cart' exact component={Cart} />
                    <Route path='/cart/wishlist' exact component={WishList} />
                    <Route path='/cart/:step' component={Cart} />
                </Switch>
                <RecenlyViewvedSmall />
            </GridLine>
        )
    }
}

export default Controller;