import React                from 'react';
import { Switch, Route }    from 'react-router-dom';
import Layout               from './views/shared/Layout';
import ErrorPage            from './views/shared/Error';

// -- Views -------------------------------------------------
import * as DefPages        from './views/DefaultPages';
import Home                 from './views/Home';
import CatalogOverview      from './views/CatalogOverview';
import Catalog              from './views/Catalog';
import CatalogWrap          from './views/CatalogWrap';
import ProductCard          from './views/ProductCard';
import Cart                 from './views/Cart';
import Personal             from './views/Personal';
import Contacts             from './views/Contacts';
import Tmp                  from './views/Tmp';
import Login                from './views/Login';
import BreadCrumbs          from './views/BreadCrumbs';
import EmptyPage            from './views/Empty';
import Develop              from './develop';

// -- -------------------------------------------------------
// const muiTheme = getMuiTheme({userAgent: 'all'});

export const routes = <Layout>
    <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/dev' component={Develop} />
        <Route path='/catalog' exact component={CatalogOverview} />
        <Route path='/catalog/:search' component={CatalogWrap} />
        <Route path='/cart' component={Cart} />
        <Route path='/personal' component={Personal} />
        <Route path='/contacts' exact component={Contacts} />
        <Route path='/contacts/:id' component={Contacts} />
        <Route path='/tmp' component={Tmp} />
        <Route path='/login' component={Login} />
        <Route path='/bread' component={BreadCrumbs} />
        <Route path='/empty' component={EmptyPage} />
        <Route component={RouteComponents} />
    </Switch>
</Layout>
