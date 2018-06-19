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
import { useDOM }           from '../../lib/isomorphic';

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


const CatalogTopOffset = (props) => {
    return(
        <div className="catalog-top-offset"></div>
    )
}

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

class PageWrap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageNotFound: false
        }

        this.pageNotFound = this.pageNotFound.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.setState({pageNotFound: false});
        }
    }

    pageNotFound() {
        this.setState({pageNotFound: true});
    }

    render() {
        return(
            <main>
                <ScrollToTop location={this.props.location} />
                {
                    this.state.pageNotFound == false ?
                    React.Children.map(this.props.children, child => 
                        React.cloneElement(child, { pageNotFound: this.pageNotFound })
                    ) : <Default404 />
                }
            </main>
        )
    }
}

class Layout extends React.Component {
    componentWillMount() {
        // this.props.requestNavigation();

        // Получение информации о магазинах(на земле)
        // this.props.getShops();

        // Получение данных о структуре каталога
        this.props.loadCatalogPageSchema();

        // Создание ошибочной ситуации
        useDOM({clientSide: () => {
            var error = document.getElementById("id");
        }, serverSide: () => {
            // serverSide
        }, bothSides: () => {
            // bothSides
        }, onError: () => {
            // onError
        }, afterComplete: () => {
            // afterComplete  
        }})

        console.warn("Layout props", this.props);
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

export default withRouter(connect((state, ownProps) => ({
    catalogPageSchema: {
        schema: state.catalog.catalogPageSchema,
        fetch: state.catalog.catalogPageSchemaFetch,
        error: state.catalog.catalogPageSchemaError
    }
}), Object.assign({}, catalogSchemaActionCreators, shopActions))(Layout));