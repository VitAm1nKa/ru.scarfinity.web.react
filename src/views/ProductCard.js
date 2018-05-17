import React                        from 'react';
import { connect }                  from 'react-redux';
import qs                           from 'qs';
import { 
    Route,
    Redirect 
}                                   from 'react-router-dom';
import { actionCreators }	        from '../store/product';
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

class Controller extends React.Component {
    constructor(props) {
        super(props);

        console.log("Product card: init");
        console.log("Product card: load review collection")

        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleReviewPost = this.handleReviewPost.bind(this);
    }

    componentWillMount() {
        // Реквест на получение спика отзывов о товаре
        this.props.getReviewCollection(this.props.productData.reviewStats.reviewCollectionId);
    }

    componentWillReceiveProps(nextProps) {
        console.log("Product card: receive props", nextProps);
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

    handleReviewPost(postBody) {
        
    }

    render() {
        // Формирование карточки модели товара
        // Необходимо получить информацию об выбраном цвете товара и узоре
        const colorCode = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).cl || '';
        const patternCode = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).pt || '';

        // Необходимо знать, цвет который выбран
        // Это может быть либо, цвет полученный через строку браузера либо цвет первого(основного товара)
        // Исходя из этой логики, достаточно просто знать какой id товара выбран
        const selectedProduct = this.props.productData.selectedProduct({colorCode, patternCode});

        // Количество товара в корзине
        // Необходимо сделать запрос в корзину, для получения текущего количества
        const productQuantity = this.props.shoppingCart.getProductQuantity(selectedProduct.productId);
        const productInCart = productQuantity > 0;

        const productModelCard = <div className="product-card">
            <Product
                productModel={this.props.productData}
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
                    seo={this.props.productData.productModelId}
                    title={this.props.productData.title}
                    nodes={this.props.productData.productCategoryPath.pathChain.nodes}/>
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

const mstp = state => Object.assign({}, state.product, state.reviewCollection, state.shoppingCart);

export default connect(mstp, Object.assign({}, actionCreators, ShoppingCartActions, ReviewCollectionStore.actionCreators))(Controller);