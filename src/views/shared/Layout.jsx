import React                from 'react';
import {connect} 	        from 'react-redux';
import {
    Route,
    Redirect,
    Switch,
    NavLink
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
import Footer               from '../../components/navigation/footer';
import {
    actionCreators as navigationActions
}                           from '../../store/navigation';
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
        this.props.requestNavigation();

        // Получение информации о магазинах(на земле)
        this.props.getShops();

        // Получение данных о структуре каталога
        this.props.requestCatalogNodes();
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
                            catalogNodes={this.props.navigation.catalogNodes}
                            {...props}/>} />
                    <Route path='/' component={MobileMainMenu} />
                    <GridLine><BreadCrumbs /></GridLine>
                </header>
                {/* <Route path='/' render={props => <PageWrap children={this.props.children} {...props} /> } /> */}
                <main>
                    <Route path="/" component={ScrollToTop} />
                    <BreadCrumb seo='' title='Главная' />
                    {this.props.children}
                </main>
                <Footer />
            </div>
        )
    }
}

export default connect(state => ({
    navigation: state.navigation
}), Object.assign({},
    navigationActions,
    shopActions))
(Layout);