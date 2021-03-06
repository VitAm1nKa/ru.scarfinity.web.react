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

import {
    breadCrumbsActions
} from '../store/navigation';

import {
    BreadCrumb,
    BreadCrumbsBuilderController
}               from '../components/navigation/bread-crumbs';
import ReviewsContainer             from '../components/reviews/reviews-container';
import Product                      from '../components/product';
import * as TabView                 from '../components/utility/tab-view';
import InfoList                     from '../components/utility/info-list';
import ProductRow                   from '../components/utility/product-row';

import { Review }                   from '../models/Review';

import { __review, __relatedProductModel }                 from '../store/api-requests';
import { ProductModel } from '../models/ProductModel';
import { ShoppingCart } from '../models/ShoppingCart';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productModelFetch: false,


            reviewCollectionId: null,
            reviewsFetch: false,
            reviews: null,

            relatedProductModelFetch: false,
            relatedProductModel: []
        }

        console.warn("Product card: init");

        this.reloadProductModel = this.reloadProductModel.bind(this);
        this.loadReviews = this.loadReviews.bind(this);
        this.loadRelatedProductModel = this.loadRelatedProductModel.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleReviewPost = this.handleReviewPost.bind(this);
    }

    reloadProductModel(productModelNumber) {
        if(!this.state.productModelFetch) {
            this.setState({ productModelFetch: true }, () => {
                this.props.getProductModel(productModelNumber);
            });
        }
    }

    componentWillMount() {
        // Load product model
        var productModelNumber = _.last(this.props.location.pathname.substr(1).replace(/\/$/, "").split('/'));
        this.props.getProductModel(productModelNumber, (data) => {
            this.props.breadCrumbsPush({seo: 'gsdfgsdfg', title: 'FSDFG123'});
            // dispatch({ type: 'BREADCRUMBS__PUSH', node: {seo: 'gsdfgsdfg', title: 'FSDFG'} })
        });
        this.loadReviews(this.props);
        // this.loadReviews(this.props);
        // this.loadRelatedProductModel();
    }

    componentWillReceiveProps(nextProps) {
        // Update product model(reload)
        var productModelNumber = _.last(nextProps.location.pathname.substr(1).replace(/\/$/, "").split('/'));
        this.props.getProductModel(productModelNumber);
        // this.loadReviews(nextProps);
        // this.loadRelatedProductModel();
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

    loadReviews(props) {
        var reviewCollectionId = props.productModel.ReviewCollectionId;
        if(this.state.reviewCollectionId != reviewCollectionId) {
            this.setState({reviewsFetch: true, reviewCollectionId: reviewCollectionId}, () => {
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

    loadRelatedProductModel(productModelId) {
        if(!this.state.relatedProductModelFetch) {
            this.setState({ relatedProductModelFetch: true }, () => {
                __relatedProductModel.Get(productModelId)(
                    data => {
                        this.setState({
                            relatedProductModelFetch: false,
                            relatedProductModel: _.map(data, productModel => new ProductModel(productModel))
                        });
                    },
                    error => {
                        this.setState({
                            relatedProductModelFetch: false,
                            relatedProductModel: []
                        })
                    }
                )
            });
        }
    }

    handleReviewPost(postBody) {
        
    }

    render() {
        if(this.props.productModelFetch) {
            console.error("Product model loading...");
            return(
                <div>{"Product model loading..."}</div>
            )
        }
        else if (this.props.productModel == null) {
            return(
                <div>{"Product model not found!"}</div>
            )
        }
        else if(_.trimEnd(this.props.location.pathname, '/') != this.props.productModel.Path) {
            console.warn("Redirect product render", this.props.productModel);
            return <Redirect to={`${this.props.productModel.Path}${this.props.location.search}`} />
        }

        // this.props.breadCrumbsPush({seo: 'productCard', title: 'ProductCard'});

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
        const productQuantity = ShoppingCart.getProductQuantity(this.props.shoppingCart, selectedProduct.productId);
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

        const relatedProducts = <ProductRow title="Похожие товары" products={this.state.relatedProductModel}/>
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
    productModel: new ProductModel(state.productModel.productModel),
    productModelFetch: state.productModel.loading,
    shoppingCart: state.shoppingCart.shoppingCart
}), Object.assign({}, ProductModelActions, ShoppingCartActions, ReviewCollectionStore.actionCreators, breadCrumbsActions))(Controller);