import React                from 'react';
import { connect }          from 'react-redux';
import {  
    Route,
    NavLink,
    withRouter
}                           from 'react-router-dom';
import { withPage }         from './shared/Page';

import * as Grid            from '../lib/grid';

import { ProductModel }     from '../store/__models';
import { __productModel }   from '../store/api-requests';
import {
    productModelActionCreators
}                           from '../store/productModel';

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

    render() {
        const productCard = this.props.productModelFetch ? (
            <div style={{textAlign: 'center', display: 'flex', height: 250, fontSize: 32}}>{'Loading.......'}</div>
        ) : this.state.productModel != null ? (
            <div style={{ display: 'flex' }}>
                <img></img>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2>{this.state.productModel.title || 'No title'}</h2>
                    <p>{this.state.productModel.description}</p>
                    <h4>{this.state.productModel.listPrice}</h4>
                </div>
            </div>
        ) : <div style={{textAlign: 'center', display: 'flex', height: 250, fontSize: 48}}>{'404'}</div>;

        return productCard;
    }
}

const ProductCard = connect(state => ({
    productModel: state.productModel.productModel,
    productModelFetch: state.productModel.productModelFetch
}), Object.assign({}, productModelActionCreators))
(withPage(ProductCardController, '__productCard'));
//  -----------------------------------------------------------------

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
                </div>
                <div style={{ padding: '20px 0px' }}>
                    <Route path='/help/:id' component={ProductCard} />
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
        )
    }
}

export default withRouter(withPage(Controller, '__help'));