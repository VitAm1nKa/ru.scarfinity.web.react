import React            from 'react';
import { connect }      from 'react-redux';
import { withRouter }   from 'react-router-dom';
import qs               from 'qs';

import { withPage }     from './shared/Page';

import {
    actionCreators
}                       from '../store/productModel';
import {
    actionCreators as ShoppingCartActions
}                       from '../store/shoppingCart';
import {
    breadCrumbsActions
}                       from '../store/navigation';

import {
    __review
}                       from '../store/api-requests';

import { ProductModel } from '../models/ProductModel';
import { Review }       from '../models/Review';
import { ShoppingCart } from '../models/ShoppingCart';

import * as Grid        from '../lib/grid';
import Product          from '../components/product';
import ReviewsContainer from '../components/reviews/reviews-container';
import * as TabView     from '../components/utility/tab-view';
import InfoList         from '../components/utility/info-list';
import ProductRow       from '../components/utility/product-row';
import { OpenGraphMeta } from '../models/PageMeta';

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

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productModelId: null,
            productModel: null,
            reviewCollectionId: null,
            reviewsFetch: false,
            reviews: [],
            relatedProductModelFetch: false,
            relatedProductModels: []
        }

        this.initializePage = this.initializePage.bind(this);
        this.loadReviews = this.loadReviews.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    initializePage(props) {
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

                            // Проверка на редирект
                            if(_.trimEnd(props.location.pathname, '/') != this.state.productModel.Path) {
                                props.history.push(`${this.state.productModel.Path}${props.location.search}`);
                            }

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
                    this.state.productModel = new ProductModel(props.productModel);
                    onComplete();

                    // Проверка на редирект
                    if(_.trimEnd(props.location.pathname, '/') != this.state.productModel.Path) {
                        props.history.push(`${this.state.productModel.Path}${props.location.search}`);
                    }
                }
            });
        } else {
            // force 404 page
        }
    }

    componentWillMount() {
        this.state.productModelId = productModelId(_.last(this.props.location.pathname.substr(1).replace(/\/$/, "").split('/')));
        if(this.state.productModelId != null) {
            this.initializePage(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        const nextProductModelId = productModelId(_.last(nextProps.location.pathname.substr(1).replace(/\/$/, "").split('/')));
        if(nextProductModelId != null && nextProductModelId != this.state.productModelId) {
            this.state.productModelId = nextProductModelId;
            this.initializePage(nextProps);
        }
    }

    //  #region Reviews
    loadReviews() {
        if(this.state.productModel != null) {
            if(this.state.productModel.ReviewCollectionId != this.state.reviewCollectionId) {
                this.setState({reviewsFetch: true, reviewCollectionId: this.state.productModel.ReviewCollectionId}, () => {
                    __review.Get.Many(this.state.reviewCollectionId)(
                        data => {
                            // console.log("SDFGSDFGSDFGSDFGSDFGSDFGSDFGSDFG");
                            this.setState({
                                reviewsFetch: false,
                                reviews: _.map(data, review => new Review(review))
                            });
                        },
                        error => {
                            // console.log("ERROROROROROROR");
                            this.setState({
                                reviewsFetch: false,
                                reviews: []
                            });
                        }
                    )
                });
            }
        }
    }
    //  #endregion

    handleColorChange(colorCode) {
        // При выборе цвета, необходимо перейти на другой путь
        // Характеристика цвет: cl = 'colorCode'
        // Необходимо проверить, не пытается ли пользователь перейти на тот же самый цвет
        const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        if(query.cl != colorCode) {
            // Сформировать новый путь, сохраняя все предыдущие параметры строки поиска
            query.cl = colorCode;
            this.props.history.push(`${this.props.location.pathname}${qs.stringify(query, { addQueryPrefix: true })}`);
        }
    }

    render() {
        if(this.props.productModelFetch) {
            return(<div>Loading...</div>)
        } else if(this.state.productModel != null) {
            // Формирование карточки модели товара
            // Необходимо получить информацию об выбраном цвете товара и узоре
            const colorCode = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).cl || '';
            const patternCode = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).pt || '';

            // Необходимо знать, цвет который выбран
            // Это может быть либо, цвет полученный через строку браузера либо цвет первого(основного товара)
            // Исходя из этой логики, достаточно просто знать какой id товара выбран
            // Количество товара в корзине
            // Необходимо сделать запрос в корзину, для получения текущего количества
            let selectedProduct = -1;
            let productQuantity = 0;
            let productInCart = false;

            if(this.state.productModel != null ) {
                selectedProduct = this.state.productModel.selectedProduct({colorCode, patternCode});
                productQuantity = ShoppingCart.getProductQuantity(this.props.shoppingCart, selectedProduct.productId);
                productInCart = productQuantity > 0;
            }

            const productModelCard = <div className="product-card">
                <Product
                    productModel={this.state.productModel}
                    productSelected={selectedProduct}
                    productQuantity={productQuantity}
                    productInCart={productInCart}
                    onColorChange={this.handleColorChange}
                    onQuantityChange={quantity => this.props.setProductQty(selectedProduct.productId, quantity)}
                    setUserProductModelPreferences={this.props.setUserProductModelPreferences}/>
            </div>

            // Формирование отзывов
            const reviewsController = 
                <ReviewsContainer
                    reviews={this.state.reviews}
                    reviewsFetch={this.state.reviewsFetch}
                    reviewCollection={this.props.reviewCollection}
                    handleReviewPost={this.handleReviewPost}/>

            const infoListItems = [
                {title: "Категория", value: "Женщинам"},
                {title: "Пол", value: "Женский"},
                {title: "Артикул", value: "АРТ123"},
                {title: "Страна производства", value: "Китай"}
            ]
            
            const infoList = <InfoList items={infoListItems}></InfoList>;

            const tabView = 
                <TabView.TabView>
                    <TabView.Tab title={"Отзывы"}>{reviewsController}</TabView.Tab>
                    <TabView.Tab title={"Характеристики"}>{infoList}</TabView.Tab>
                    <TabView.Tab title={"Описание"}>3</TabView.Tab>
                </TabView.TabView>;

            const relatedProducts = <ProductRow title="Похожие товары" products={this.state.relatedProductModels}/>
            const additionalProducts = <ProductRow title="Сопутсвующие товары" products={[]}/>

            return(
                <Grid.GridLine>
                    <Grid.VerticalGrid>
                        {productModelCard}
                        {tabView}
                        {relatedProducts}
                        {additionalProducts}
                    </Grid.VerticalGrid>
                </Grid.GridLine>
            )
        } else {
            return(<div>Not found 404</div>)
        }
    }
}

export default connect(state => ({
    productModel: state.productModel.productModel,
    productModelId: state.productModel.productModelId,
    productModelFetch: state.productModel.productModelFetch,
    relatedProductModels: state.productModel.relatedProductModels,
    shoppingCart: state.shoppingCart.shoppingCart
}), Object.assign({}, actionCreators, ShoppingCartActions))
(withPage(Controller, '__productPage'));