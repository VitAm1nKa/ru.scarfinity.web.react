import React                from 'react';
import { connect } 	        from 'react-redux';
import { 
    Route,
    withRouter
}                           from 'react-router-dom';
import { withPage }         from './Page';

import { GridLine }         from '../../lib/grid';

import Account              from '../Account';
import TopMenu              from '../../components/navigation/top-menu';
import InfoMenu             from '../../components/navigation/info-menu';
import MainMenu             from '../../components/navigation/main-menu';
import MobileMainMenu       from '../../components/navigation/mobile-main-menu';
import LoadingBar           from '../../components/navigation/loading-bar';
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
    breadCrumbsActions
}                           from '../../store/navigation';
import {
    catalogSchemaActionCreators
}                           from '../../store/catalog';
import {
    actionCreators as shopActions                     
}                           from '../../store/shop';

class Layout extends React.Component {
    componentWillMount() {
        // Инициализация приложения
        // Записать/обновить информацию о клиенте из стора в куки
        

        // this.props.requestNavigation();

        // Получение информации о магазинах(на земле)
        // this.props.getShops();

        // Получение данных о структуре каталога
        // this.props.loadCatalogPageSchema();
    }

    componentDidMount() {
        scroll(0, 0);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            // console.clear();
            console.warn('Page changed.');
            scroll(0, 0);
        }
    }

    render() {
        return(
            <div className="site-layout">
                <header>
                    <Route path='/' component={Account} />
                    <InfoMenu />
                    <Route path='/' component={TopMenu} />
                    <Route path='/' component={MainMenu} />
                    <Route path='/' component={MobileMainMenu} />
                    <GridLine><BreadCrumbs /></GridLine>
                    <EnvironmentCore />
                    {/* <LoadingBar /> */}
                </header>
                <main>
                    {this.props.children}
                </main>
                <Footer />
            </div>
        )
    }
}

export default withRouter(connect(state => ({

}), Object.assign({},
    breadCrumbsActions,
    catalogSchemaActionCreators,
    shopActions
))(withPage(Layout), 'root'));