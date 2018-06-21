import React                from 'react';
import {connect} 	        from 'react-redux';
import {
    Route,
    Redirect,
    Switch,
    NavLink,
    withRouter
}                           from 'react-router-dom';
import { GridLine }         from '../../lib/grid';

import Account              from '../Account';
import TopMenu              from '../../components/navigation/top-menu';
import InfoMenu             from '../../components/navigation/info-menu';
import MainMenu             from '../../components/navigation/main-menu';
import MobileMainMenu       from '../../components/navigation/mobile-main-menu';
import {
    BreadCrumb,
    BreadCrumbs
}                           from '../../components/navigation/bread-crumbs'
import {
    EnvironmentCore,
    EnvironmentMeta
}                           from '../../components/navigation/page-meta';
import Footer               from '../../components/navigation/footer';

import { 
    catalogSchemaActionCreators 
}                           from '../../store/catalog';

import {
    actionCreators as shopActions                     
}                           from '../../store/shop';
import { Default404 }       from '../DefaultPages';


class ScrollToTop extends React.Component {
    componentDidMount() {
        scroll(0, 0);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            //console.clear();
            console.warn('Page changed.');
            scroll(0, 0);
        }
    }

    render() {
        return null;
    }
}

class Layout extends React.Component {
    componentWillMount() {
        // this.props.requestNavigation();

        // Получение информации о магазинах(на земле)
        // this.props.getShops();

        // Получение данных о структуре каталога
        this.props.loadCatalogPageSchema();
    }

    render() {
        return(
            <div className="site-layout">
                <header>
                    <Route path='/' component={Account} />
                    <InfoMenu />
                    <Route path='/' component={TopMenu} />
                    <Route
                        path='/'
                        render={props => <MainMenu
                            catalogNodes={this.props.catalogPageSchema.schema}
                            {...props}/>} />
                    <Route path='/' component={MobileMainMenu} />
                    <GridLine><BreadCrumbs /></GridLine>
                    <EnvironmentCore />
                </header>
                {/* <Route path='/' render={props => <PageWrap children={this.props.children} {...props} /> } /> */}
                <main>
                    <Route path="/" component={ScrollToTop} />
                    <EnvironmentMeta title="Главная страница Scarfinity Site" />
                    <BreadCrumb seo='' title='Главная' />
                    {this.props.children}
                </main>
                <Footer />
            </div>
        )
    }
}

export default withRouter(connect(state => ({
    catalogPageSchema: {
        schema: state.catalog.catalogPageSchema,
        fetch: state.catalog.catalogPageSchemaFetch,
        error: state.catalog.catalogPageSchemaError
    }
}), Object.assign({}, catalogSchemaActionCreators, shopActions))(Layout));