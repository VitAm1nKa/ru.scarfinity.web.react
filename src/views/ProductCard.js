import React                        from 'react';
import { connect }                  from 'react-redux';
import qs                           from 'qs';
import { 
    Route,
    Redirect 
}                                   from 'react-router-dom';
import { actionCreators }	        from '../store/product';
import {
    actionCreators as ProductModelActions 
}                                   from '../store/productModel';
import {
    actionCreators as ShoppingCartActions
}                                   from '../store/shoppingCart';
import * as ReviewCollectionStore   from '../store/reviewCollection';

import * as DefPages                from './DefaultPages';
import * as Grid                    from '../lib/grid';

import { BreadCrumb }               from '../components/navigation/bread-crumbs';
import ReviewsContainer             from '../components/reviews/reviews-container';
import Product                      from '../components/product';
import * as TabView                 from '../components/utility/tab-view';
import InfoList                     from '../components/utility/info-list';
import ProductRow                   from '../components/utility/product-row';

import { Review }                   from '../models/Review';

import { __review }                 from '../store/api-requests';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productModelFetch: false,
            reviewsFetch: false,
            reviews: []
        }

        console.warn("Product card: init");
        console.warn("Product card: load review collection")

        this.reloadProductModel = this.reloadProductModel.bind(this);
        this.loadReviews = this.loadReviews.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleReviewPost = this.handleReviewPost.bind(this);
    }

    reloadProductModel(peoductModelNumber) {
        if(!this.state.productModelFetch) {
            this.setState({ productModelFetch: true }, () => {
                this.props.getProductModel(peoductModelNumber);
            });
        }
    }

    componentWillMount() {
        this.reloadProductModel(_.last(this.props.location.pathname.substr(1).replace(/\/$/, "").split('/')));
    }

    componentWillReceiveProps(nextProps) {
        console.log("Product card: receive props", nextProps);
        if(nextProps.productModelFetch != this.props.productModelFetch && this.props.productModelFetch == true) {
            this.setState({ productModelFetch: false }, () => {
                if(nextProps.productModel.productModelId != null) {
                    // Реквест на получение спика отзывов о товаре
                    this.loadReviews(this.props.productModel.reviewStats.reviewCollectionId);
                }
            });
        }

        var lastNodeOld = _.last(this.props.location.pathname.substr(1).replace(/\/$/, "").split('/'));
        var lastNodeNew = _.last(nextProps.location.pathname.substr(1).replace(/\/$/, "").split('/'));
        if(lastNodeOld != lastNodeNew) {
            this.reloadProductModel(lastNodeNew);
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

    loadReviews(reviewCollectionId) {
        if(!this.state.reviewsFetch) {
            this.setState({reviewsFetch: true}, () => {
                __review.Get.Many(reviewCollectionId)(
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

    handleReviewPost(postBody) {
        
    }

    render() {
        if(this.state.productModelFetch) {
            console.error("Product model loading...");
            return(
                <div>{"Product model loading..."}</div>
            )
        }
        else if (this.props.productModel == null || this.props.productModel.productModelId == null) {
            return(
                <div>{"Product model not found!"}</div>
            )
        }
        else if(_.trimEnd(this.props.location.pathname, '/') != this.props.productModel.path()) {
            console.log("Redirect product render");
            return <Redirect to={`${this.props.productModel.path()}${this.props.location.search}`} />
        }

        // Формирование карточки модели товара
        // Необходимо получить информацию об выбраном цвете товара и узоре
        const colorCode = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).cl || '';
        const patternCode = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).pt || '';

        // Необходимо знать, цвет который выбран
        // Это может быть либо, цвет полученный через строку браузера либо цвет первого(основного товара)
        // Исходя из этой логики, достаточно просто знать какой id товара выбран
        const selectedProduct = this.props.productModel.selectedProduct({colorCode, patternCode});

        // Количество товара в корзине
        // Необходимо сделать запрос в корзину, для получения текущего количества
        const productQuantity = this.props.shoppingCart.getProductQuantity(selectedProduct.productId);
        const productInCart = productQuantity > 0;

        const productModelCard = <div className="product-card">
            <Product
                productModel={this.props.productModel}
                productSelected={selectedProduct}
                productQuantity={productQuantity}
                productInCart={productInCart}
                onColorChange={this.handleColorChange}
                onQuantityChange={quantity => this.props.setProductQty(selectedProduct.productId, quantity)}
                setUserProductModelPreferences={this.props.setUserProductModelPreferences}/>
        </div>;

        // Формирование отзывов
        const reviewsController = 
            <ReviewsContainer
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

        const relatedProducts = <ProductRow title="Похожие товары" products={[]}/>
        const additionalProducts = <ProductRow title="Сопутсвующие товары" products={[]}/>
        
        return(
            <Grid.GridLine>
                <BreadCrumb
                    seo={this.props.productModel.productModelId}
                    title={this.props.productModel.title}
                    nodes={this.props.productModel.productCategoryPath.pathChain.nodes}/>
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
    productModelFetch: state.productModel.loading,
    shoppingCart: state.shoppingCart.shoppingCart
}), Object.assign({}, ProductModelActions, ShoppingCartActions, ReviewCollectionStore.actionCreators))(Controller);