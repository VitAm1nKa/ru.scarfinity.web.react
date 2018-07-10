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

        this.proccessProductModel = this.proccessProductModel.bind(this);
        this.loadReviews = this.loadReviews.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    productModelId(productModelNumber) {
        if(/^\d+$/g.test(productModelNumber)) {
            return parseInt(productModelNumber);
        }

        return null;
    }

    productModelToPageMeta(data) {
        var productModel = new ProductModel(data);
        return ({
            title: productModel.title,
            seo: productModel.productModelId,
            description: productModel.description,
            openGraphMeta: new OpenGraphMeta({
                title: productModel.title,
                description: productModel.description,
                image: productModel.thumbnail,
                url: productModel.Path
            })
        });
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

    proccessProductModel(props) {
        this.props.updateBreadCrumbs([...this.state.productModel.productCategoryPath.pathChain.nodes, {
            seo: this.state.productModel.productModelId,
            title: this.state.productModel.title
        }]);

        // Установить значения мета тегов страницы
        this.props.updatePageMeta(this.productModelToPageMeta(this.state.productModel));

        // Реквестим загрузку отзывов
        this.loadReviews();

        this.props.pageLoadingProcess(null, 70);

        // Проверка на редирект
        if(_.trimEnd(props.location.pathname, '/') != this.state.productModel.Path) {
            props.history.push(`${this.state.productModel.Path}${props.location.search}`);
            this.props.pageLoadingProcess(null, 85);
        } else {
            this.props.pageLoadingProcess(null, 100);
            this.props.pageLoadingEnd();
        }
    }

    componentWillMount() {
        
    }

    componentWillMount() {
        // Первая загрузка. Получаем номер модели и реквестим в сторе запрос на данную модель
        this.props.pageLoadingStart();
        this.state.productModelId = this.productModelId(_.last(this.props.location.pathname.substr(1).replace(/\/$/, "").split('/')));
        if(this.state.productModelId != null) {
            // Модель не грузится в стор
            if(this.props.productModelFetch == false) {
                // Модель в сторе отсутствует, начать загружать
                if(this.props.productModel == null) {
                    this.props.getProductModel(this.state.productModelId, data => {
                        // Поскольку асинхронные запросы на сервере не форсят апдейт
                        // Необходимо обновить данные об странице колбеком из стора
                        if(data != null && this.state.productModelId == data.productModelId) {
                            // Установить значения мета тегов страницы
                            this.props.setPageMeta(this.productModelToPageMeta(data));
                            // Установить значения хлебных крошек
                            this.props.setBreadCrumbs([...data.productCategoryPath.pathChain.nodes, {
                                seo: data.productModelId,
                                title: data.title
                            }]);
                        }
                    });
                } else {
                    this.state.productModel = new ProductModel(this.props.productModel);
                    this.proccessProductModel(this.props);
                }
            }

            if(this.props.relatedProductModels == null) {
                this.props.getRelatedProductModels(this.state.productModelId);
            } else {
                this.state.relatedProductModels = _.map(this.props.relatedProductModels, pm => new ProductModel(pm));
            }
        } else {

        }
    }

    componentWillReceiveProps(nextProps) {
        // Получен новый номер модели
        var nextProductModelId = this.productModelId(_.last(nextProps.location.pathname.substr(1).replace(/\/$/, "").split('/')));
        if(nextProductModelId != null) {
            if(this.state.productModelId != nextProductModelId) {
                this.props.pageLoadingStart();
                this.state.productModelId = nextProductModelId;
                // Реквест на загрузку модели
                this.props.getProductModel(this.state.productModelId);
                this.props.getRelatedProductModels(this.state.productModelId);
            }

            // Сравниваем с текущим номером
            if(this.props.productModelId == this.state.productModelId) {
                if(nextProps.productModelFetch == false) {
                    this.setState({ productModelFetch: false }, () => {
                        if(nextProps.productModel != null) {
                            if(this.state.productModel == null || this.state.productModel.productModelId != this.props.productModel.productModelId) {
                                this.state.productModel = new ProductModel(this.props.productModel);
                                this.proccessProductModel(this.props);
                            }
                        } else {
                            this.state.productModel = null;
                        }
                    });
                }
            }

            if(this.props.relatedProductModels != null) {
                this.state.relatedProductModels = _.map(this.props.relatedProductModels, pm => new ProductModel(pm));
            }
        }
    }

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
        const productModelLoading = this.props.productModelFetch;
        const productModelNotFound = !productModelLoading && this.state.productModel == null;

        if(productModelNotFound == false) {
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
        } else if(productModelLoading) {
            return(<div>Loading...</div>)
        } else {
            return(<div>Not found 404</div>)
        }
    }
}

export default withRouter(connect(state => ({
    productModel: state.productModel.productModel,
    productModelId: state.productModel.productModelId,
    productModelFetch: state.productModel.loading,
    relatedProductModels: state.productModel.relatedProductModels,
    shoppingCart: state.shoppingCart.shoppingCart
}), Object.assign({}, actionCreators, ShoppingCartActions))
(withPage(Controller, 'productPage')));