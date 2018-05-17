// Компонент который отображает список товаров в линию
// Это могут быть новинки, просмотренные товары, скидочные товары, имеющие лучшие продажи
//
// Список товаров формируется на основании данных полученых от api
// API отдает списки как анонимным польователям, так и зарегистрированным
// 
// Данные об списках хранятся в сторе
// Таких списков там должно быть несколько, по описанным выше типам
// Списки товаров реквестятся к api паралельно, поэтому необходимо отображать загруску данных

import React        from 'react';
import { connect }  from 'react-redux';
import {
    actionCreators as ProductCollectionActions
}                   from '../../store/productCollection';
import ProductRow   from '../utility/product-row';


class Controller extends React.Component {
    componentWillMount() {
        const productCollection = this.props.collections['new'];
        if(productCollection.fetchTime <= Date.now()) {
            this.props.collectionLoad('new');
        }
    }

    render() {
        const productCollection = this.props.collections['new'];

        if(productCollection.fetch == true) {
            return <div>Loading...</div>
        } else if(productCollection.fetch == false && productCollection.fetchError == true){
            return <div>Error...</div>
        } else {
            return <ProductRow
                title="Новинки"
                products={productCollection.productModels}/>
        }
    }
}

export default connect(state => ({
    collections: state.productCollection
}), Object.assign({}, 
    ProductCollectionActions))
(Controller);