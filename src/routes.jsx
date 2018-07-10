import React                from 'react';
import { Switch, Route }    from 'react-router-dom';
import Layout               from './views/shared/Layout';

// -- Views -------------------------------------------------
import Home                 from './views/Home';
import CatalogOverview      from './views/CatalogOverview';
import CatalogRedirect      from './views/CatalogRedirect';
import Cart                 from './views/Cart';
import Personal             from './views/Personal';
import Contacts             from './views/Contacts';
import Help                 from './views/Help';
import Tmp                  from './views/Tmp';
import Login                from './views/Login';
import BreadCrumbs          from './views/BreadCrumbs';
import EmptyPage            from './views/Empty';
import Develop              from './develop';
import CC                   from './views/CatalogPageTest';

// -- -------------------------------------------------------
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme      from 'material-ui/styles/getMuiTheme';
const muiTheme = getMuiTheme({userAgent: 'all'});

export const routes =
<MuiThemeProvider muiTheme={muiTheme}>
    <Layout>
        <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/dev' component={Develop} />
            <Route path='/catalog' exact component={CatalogOverview} />
            <Route path='/catalog/:search' component={CatalogRedirect} />
            <Route path='/cart' component={Cart} />
            <Route path='/personal' component={Personal} />
            <Route path='/contacts' exact component={Contacts} />
            <Route path='/help' component={Help} />
            <Route path='/contacts/:id' component={Contacts} />
            <Route path='/tmp' component={Tmp} />
            <Route path='/login' component={Login} />
            <Route path='/bread' component={BreadCrumbs} />
            <Route path='/empty' component={EmptyPage} />
            <Route path='/cc' component={CC} />
        </Switch>
    </Layout>
</MuiThemeProvider>
