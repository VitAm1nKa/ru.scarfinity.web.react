import React                from 'react';
import { connect }          from 'react-redux';
import {  
    Route,
    NavLink,
    Switch,
    withRouter
}                           from 'react-router-dom';
import { withPage }         from './shared/Page';


import * as Grid            from '../lib/grid';
import qs                   from 'qs';

import { ProductModel }     from '../models/ProductModel';
import { CatalogPage }      from '../models/CatalogPage';
import {
    productModelActionCreators
}                           from '../store/productModel';
import {
    actionCreators as shoppingCartActionsCreators
}                           from '../store/shoppingCart'
import {
    actionCreators
}                           from '../store/catalog';
import {
    accountSocialActionCreators
}                           from '../store/accountSocial';

function productModelId(productModelNumber) {
    if(/^\d+$/g.test(productModelNumber)) {
        return parseInt(productModelNumber);
    }

    return null;
}

function productModelToPage(productModel) {
    const pageMeta = {
        title: productModel.title,
        seo: productModel.productModelId,
        description: productModel.description,
        image: productModel.thumbnail,
        url: productModel.Path
    }

    const breadCrumbs = _.map([...productModel.productCategoryPath.pathChain.nodes, {
        seo: productModel.productModelId,
        title: productModel.title
    }], b => ({ seo: b.seo, title: b.title, path: 'path' }));

    return ({ pageMeta, breadCrumbs });
}

class ProductCardController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productModelId: null,
            productModelFetch: false,
            productModel: null
        }

        this.initializePage = this.initializePage.bind(this);
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
    }

    initializePage(props) {
        // Парсим номер модели из параметров
        this.state.productModelId = productModelId(props.match.params['id']);
        if(this.state.productModelId != null) {
            props.initializePage({ seo: this.state.productModelId, breadCrumbs: { seo: 'productCard', title: 'Карточка товара' } }, (callback, onComplete) => {
                if(props.productModel == null || props.productModel.productModelId != this.state.productModelId) {
                    props.getProductModel(this.state.productModelId, 
                        data => {
                            this.state.productModel = new ProductModel(data);

                            // Необходимо вызвать каллбек инициализации страницы для уточнения меты
                            // Установить значения хлебных крошек
                            callback(productModelToPage(this.state.productModel));
                            onComplete();

                            // Форсим апдейт, так как метод асинхронный
                            this.forceUpdate();
                        }, 
                        error => {
                            console.warn('Product model not found!', error);
                            this.state.productModel = null;

                            // Необходимо вызвать каллбек инициализации страницы для уточнения меты
                            callback(null);
                            onComplete();

                            // Форсим апдейт, так как метод асинхронный
                            this.forceUpdate();
                        });
                } else {
                    console.warn('In store');
                    this.state.productModel = new ProductModel(props.productModel);
                    onComplete();
                }
            });
        } else {
            // force 404 page
        }
    }

    componentWillMount() {
        this.state.productModelId = productModelId(this.props.match.params['id']);
        if(this.state.productModelId != null) {
            this.initializePage(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        const nextProductModelId = productModelId(nextProps.match.params['id']);
        if(nextProductModelId != null && nextProductModelId != this.state.productModelId) {
            this.state.productModelId = nextProductModelId;
            this.initializePage(nextProps);
        }
    }

    handleAddProduct(productId) {
        this.props.setProductQty(productId, 1);
    }

    handleRemoveProduct(productId) {
        this.props.setProductQty(productId, 0);
    }

    render() {
        const productCard = this.props.productModelFetch ? (
            <div style={{textAlign: 'center', display: 'flex', height: 250, fontSize: 32}}>{'Loading.......'}</div>
        ) : this.state.productModel != null ? (
            <div style={{ display: 'flex' }}>
                <img></img>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2>{this.state.productModel.title || 'No title'}</h2>
                    <p>{this.state.productModel.description}</p>
                    <h3>{this.state.productModel.listPrice}</h3>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        {
                            _.map(this.state.productModel.products, product => {
                                return(
                                    <div style={{ margin: '0px 10px', border: '1px solid white' }}>
                                        <h4>{`#${product.productId}`}</h4>
                                        <div>{`color: ${product.colorCode}`}</div>
                                        <button onClick={() => {this.handleAddProduct(product.productId)}}>{'Добавить в корзину'}</button>
                                        <button onClick={() => {this.handleRemoveProduct(product.productId)}}>{'Удалить'}</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        ) : <div style={{textAlign: 'center', display: 'flex', height: 250, fontSize: 48}}>{'404'}</div>;

        return productCard;
    }
}

const ProductCard = connect(state => ({
    productModel: state.productModel.productModel,
    productModelFetch: state.productModel.productModelFetch
}), Object.assign({}, productModelActionCreators, shoppingCartActionsCreators))
(withPage(ProductCardController, '__productCard'));
//  -----------------------------------------------------------------


class CatalogPageController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            catalogPage: null
        }
    }

    componentWillMount() {
        this.props.initializePage({ seo: '' }, (callback) => {
            if(this.props.catalogPage == null) {
                this.props.loadCatalogPageInfo(null, 
                    data => {
                        this.state.catalogPage = new CatalogPage(data);
                        callback({pageMeta: { title: this.state.catalogPage.title }});
                        this.forceUpdate();
                    }, 
                    error => {
                        this.state.catalogPage = null;
                        callback(null);
                        this.forceUpdate();
                    });
            } else {
                this.state.catalogPage = new CatalogPage(this.props.catalogPage);
            }
        });
    }

    render() {
        if(this.props.catalogPageLoading) {
            return <div style={{textAlign: 'center', display: 'flex', height: 250, fontSize: 32}}>{'Loading.......'}</div>
        } else if(this.state.catalogPage != null) {
            return <div style={{ display: 'flex' }}>
                <h2>{this.state.catalogPage.title || 'No title'}</h2>
            </div>
        } else {
            return <div style={{textAlign: 'center', display: 'flex', height: 250, fontSize: 48}}>{'404'}</div>
        }
    }
}

const CatalogPageView = connect(state => ({
    catalogPage: state.catalog.catalogPage,
    catalogPageLoading: state.catalog.catalogPageLoading
}), Object.assign({}, actionCreators))
(withPage(CatalogPageController, '__catalogPage'));
//  -----------------------------------------------------------------

const AccountLoginCard = (props) => {
    return(
        <div style={{ background: '#f1f1f1', borderRadius: '2px', padding: '10px', margin: '0px 10px' }}>
            <img src={props.img} style={{ width: 150, height: 150 }}></img>
            <a href={props.link} style={{ display: 'block', color: '#808080', fontSize: '0.83em', margin: '7px 0px' }}><b>{props.id}</b></a>
            <h4 style={{ color: '#303030' }}>{`${props.firstName} ${props.lastName}`}</h4>
        </div>
    )
}

class AccountPageController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            view: 'main'
        }

        this.changeView = this.changeView.bind(this);
        this.authLink = this.authLink.bind(this);
        this.vkAuthorization = this.vkAuthorization.bind(this);
        this.handleAuthVK = this.handleAuthVK.bind(this);
    }

    getRedirectPath(location, params = {}, options = ['code', 'lp']) {
        const query = qs.parse(location.search, { ignoreQueryPrefix: true });
        const newQuery = qs.stringify(_.merge({}, _.omit(query, options), params), { addQueryPrefix: true });
        return `http://192.168.1.198:8096${location.pathname}${newQuery}`;
    }

    componentWillMount() {
        const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        if(query.code != null) {
            // this.vkAuthorization(query.code, this.getRedirectPath(this.props.location));
        }
    }

    componentWillReceiveProps(nextProps) {
        const query = qs.parse(nextProps.location.search, { ignoreQueryPrefix: true });
        if(query.code != null) {
            // this.vkAuthorization(query.code, this.getRedirectPath(nextProps.location));
        }
    }

    changeView(view) {
        this.setState({ view });
    }

    handleAuthVK() {

    }

    vkAuthorization(userCode, redirect) {
        if(!this.props.accountSocial.vkAuth && this.props.accountSocial.vkAuthError == null) {
            if(userCode != null) {
                this.props.vkAuth(userCode, redirect);
            }
        }
    }

    authLink(code) {
        const vkQuery = qs.stringify({ 
            'client_id': '6471031',
            'display': 'popup',
            'response_type': 'code',
            'redirect_uri': this.getRedirectPath(this.props.location, { lp: 'vk' })
        }, { addQueryPrefix: true });

        const fbQuery = qs.stringify({
            'client_id': '123328171731729',
            'response_type': 'code',
            'redirect_uri': this.getRedirectPath(this.props.location, { lp: 'fb' })
        }, { addQueryPrefix: true });

        switch(code) {
            case 'VK': return `https://oauth.vk.com/authorize${vkQuery}`;
            case 'FB': return `https://www.facebook.com/v3.0/dialog/oauth${fbQuery}`;
            default: return '';
        }
    }

    view(view) {
        switch(view) {
            case 'main': {
                return(
                    <div>
                        <h4>{'Основное'}</h4>
                    </div>
                )
            }
            case 'login': {
                return(
                    <div>
                        <h4>{'Login'}</h4>
                        <a href={this.authLink("VK")} style={{ padding: '5px 12px', margin: '0px 10px' }}>{"VK"}</a>
                        <a href={this.authLink("FB")} style={{ padding: '5px 12px', margin: '0px 10px' }}>{"Facebook"}</a>
                        <button disabled>{"Google"}</button>
                        <button disabled>{"OK"}</button>
                    </div>
                )
            }
        }
    }

    render() {
        let accountLogins = [];
        const vkData = this.props.accountSocial.vkAuthData;
        if(vkData != null) {
            accountLogins = [...accountLogins, {
                id: vkData['id'],
                firstName: vkData['first_name'],
                lastName: vkData['last_name'],
                img: vkData['photo_big'],
                link: `https://vk.com/${vkData['screen_name']}`
            }];
        }

        const accountLoginPages = accountLogins.length > 0 ? (
            <div style={{ display: 'flex', padding: '20px 0px', margin: '0px -20px' }}>
                {
                    _.map(accountLogins, aLogin => <AccountLoginCard {...aLogin}/>)
                }
            </div>
        ) : null;

        return(
            <Grid.Row style={{background: '#fefefe', padding: '12px 0px'}}>
                <Grid.Container>
                    <Grid.Col lg={4} md={4}>
                        <div style={{display: 'flex'}}>
                            <button onClick={() => {this.changeView('main')}}>{'Основное'}</button>
                            <button onClick={() => {this.changeView('login')}}>{'Login'}</button>
                        </div>
                    </Grid.Col>
                    <Grid.Col lg={12} md={12}>
                        <div>{`Account email: ${this.props.account.userEmail}`}</div>
                        <div>{`Account name: ${this.props.account.userName}`}</div>
                        {accountLoginPages}
                        {this.view(this.state.view)}
                    </Grid.Col>
                </Grid.Container>
            </Grid.Row>
        )
    }
}

const AccountPage = withRouter(connect(state => ({
    account: state.account,
    accountSocial: state.accountSocial
}), Object.assign({}, accountSocialActionCreators))
(AccountPageController));

const navLinkStyle = {
    display: 'block',
    lineHeight: '24px',
    flexGrow: 1,
    color: '#303030',
    textAlign: 'center',
    fontSize: '16px'
};

class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.initializePage({ seo: 'help' }, () => {

        });
    }

    render() {
        return(
            <React.Fragment>
                <AccountPage />
                <Grid.GridLine>
                    <h1>Help page</h1>
                    <div style={{ display: 'flex' }}>
                        <NavLink style={navLinkStyle} to='/help/32'>{'32'}</NavLink>
                        <NavLink style={navLinkStyle} to='/help/28'>{'28'}</NavLink>
                        <NavLink style={navLinkStyle} to='/help/34'>{'34'}</NavLink>
                        <NavLink style={navLinkStyle} to='/help/35'>{'35'}</NavLink>
                        <NavLink style={navLinkStyle} to='/help/12'>{'12'}</NavLink>
                        <NavLink style={navLinkStyle} to='/help/48'>{'48'}</NavLink>
                        <NavLink style={navLinkStyle} to='/help/36'>{'36'}</NavLink>
                        <NavLink style={navLinkStyle} to='/help/catalog/1'>{'catalog'}</NavLink>
                    </div>
                    <div style={{ padding: '20px 0px' }}>
                        <Switch>
                            <Route path='/help/catalog' component={CatalogPageView} />
                            <Route path='/help/:id' component={ProductCard} />
                        </Switch>
                    </div>
                    <hr />
                    <p>
                        Mollit nisi laboris consequat anim sit velit dolor non magna enim fugiat deserunt id laborum. 
                        Culpa minim amet minim laborum laborum. Reprehenderit in sit esse exercitation nostrud ea voluptate duis. 
                        Lorem id incididunt magna nostrud proident adipisicing nostrud. Duis eu ea mollit aute amet nisi. 
                        Deserunt voluptate irure tempor nulla nulla commodo amet esse deserunt exercitation sint. 
                        Eiusmod nulla enim laborum est veniam adipisicing fugiat esse exercitation aute.
                        Velit nulla eiusmod sint Lorem. Laborum elit do id est officia reprehenderit pariatur officia aliquip consequat voluptate et dolore incididunt. 
                        Eu consectetur ut labore nulla do voluptate qui do ipsum. Reprehenderit consequat sit qui aliquip Lorem culpa elit.
                    </p>
                </Grid.GridLine>
            </React.Fragment>
        )
    }
}

export default withRouter(withPage(Controller, '__help'));