import React            from 'react';
import { connect }      from 'react-redux';
import { withRouter }   from 'react-router-dom';
import qs               from 'qs';
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
        this.setBreadCrumbs = this.setBreadCrumbs.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    productModelId(productModelNumber) {
        if(/^\d+$/g.test(productModelNumber)) {
            return parseInt(productModelNumber);
        }

        return null;
    }

    setBreadCrumbs(nodes) {
        this.props.breadCrumbsPush(nodes);
    }

    //  #region Reviews
    loadReviews() {
        if(this.state.productModel != null) {
            if(this.state.productModel.ReviewCollectionId != this.state.reviewCollectionId) {
                this.setState({reviewsFetch: true, reviewCollectionId: this.state.productModel.ReviewCollectionId}, () => {
                    __review.Get.Many(this.state.reviewCollectionId)(
                        data => {
                            this.setState({
                                reviewsFetch: false,
                                reviews: _.map(data, review => new Review(review))
                            });
                        },
                        error => {
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
        this.setBreadCrumbs([...this.state.productModel.productCategoryPath.pathChain.nodes, {
            seo: this.state.productModel.productModelId,
            title: this.state.productModel.title
        }]);

        // Реквестим загрузку отзывов
        this.loadReviews();

        // Проверка на редирект
        if(_.trimEnd(props.location.pathname, '/') != this.state.productModel.Path) {
            props.history.push(`${this.state.productModel.Path}${props.location.search}`);
        }
    }

    componentWillMount() {
        // Первая загрузка. Получаем номер модели и реквестим в сторе запрос на данную модель
        this.state.productModelId = this.productModelId(_.last(this.props.location.pathname.substr(1).replace(/\/$/, "").split('/')));
        if(this.state.productModelId != null) {
            this.props.getProductModel(this.state.productModelId, data => {
                // Поскольку асинхронные запросы на сервере не форсят апдейт
                // Необходимо обновить данные об странице колбеком из стора
                if(data != null && this.state.productModelId == data.productModelId) {
                    this.setBreadCrumbs([...data.productCategoryPath.pathChain.nodes, {
                        seo: data.productModelId,
                        title: data.title
                    }]);
                }
            });

            this.props.getRelatedProductModels(this.state.productModelId);

            // Сравниваем с текущим номером
            if(this.props.productModelId == this.state.productModelId) {
                // Если в сторе уже есть данные о моделе
                if(this.props.productModel != null) {
                    this.state.productModel = new ProductModel(this.props.productModel);
                    this.proccessProductModel(this.props);
                }

                if(this.props.relatedProductModels != null) {
                    this.state.relatedProductModels = _.map(this.props.relatedProductModels, pm => new ProductModel(pm));
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        // Получен новый номер модели
        var nextProductModelId = this.productModelId(_.last(nextProps.location.pathname.substr(1).replace(/\/$/, "").split('/')));
        if(nextProductModelId != null) {
            if(this.state.productModelId != nextProductModelId) {
                this.state.productModelId = nextProductModelId;
                // Реквест на загрузку модели
                this.props.getProductModel(this.state.productModelId);
                this.props.getRelatedProductModels(this.state.productModelId);
            }

            // Сравниваем с текущим номером
            if(this.props.productModelId == this.state.productModelId) {
                if(this.props.productModel != null) {
                    if(this.state.productModel == null || this.state.productModel.productModelId != this.props.productModel.productModelId) {
                        this.state.productModel = new ProductModel(this.props.productModel);
                        this.proccessProductModel(this.props);
                    }
                }

                if(this.props.relatedProductModels != null) {
                    this.state.relatedProductModels = _.map(this.props.relatedProductModels, pm => new ProductModel(pm));
                }
            }
        }
    }

    componentWillUnmount() {
        if(this.state.productModel != null) {
            this.props.breadCrumbsPop([...this.state.productModel.productCategoryPath.pathChain.nodes, {
                seo: this.state.productModel.productModelId
            }]);
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

        const productModelCard = this.state.productModel == null ?
            <div>{"Loading..."}</div> :        
            <div className="product-card">
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
    }
}

export default connect(state => ({
    productModel: state.productModel.productModel,
    productModelId: state.productModel.productModelId,
    relatedProductModels: state.productModel.relatedProductModels,
    shoppingCart: state.shoppingCart.shoppingCart
}), Object.assign({}, actionCreators, ShoppingCartActions, breadCrumbsActions))(withRouter(Controller));