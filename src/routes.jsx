import React                from 'react';
import { Switch, Route }    from 'react-router-dom';
import Layout               from './views/shared/Layout';
import ErrorPage            from './views/shared/Error';

// -- Views -------------------------------------------------
import Home                 from './views/Home';
import About                from './views/About';

export const routes = <Layout>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
        <Route component={ErrorPage} />
    </Switch>
</Layout>
