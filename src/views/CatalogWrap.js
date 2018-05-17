import React                        from 'react';
import { connect }                  from 'react-redux';
import { matchPath }                from 'react-router';
import { 
    Route,
    Redirect
}                                   from 'react-router-dom';

import * as Grid                    from '../lib/grid';
import * as DefPages                from './DefaultPages';
import ContentContainer             from '../components/utility/content-container';

import * as CatalogStore            from '../store/catalog';
import * as ProductStore            from '../store/product';
import * as ReviewCollectionStore   from '../store/reviewCollection';

import Catalog                      from './Catalog';
import ProductCard                  from './ProductCard';
import { BreadCrumb }               from '../components/navigation/bread-crumbs';

var ViewState = {
    None: 0,
    Catalog: 1,
    Product: 2
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewState: ViewState.None,
            loading: false
        }
    }

    componentWillMount() {
        this.analyzePath(this.props.location);
    }
    
    componentWillReceiveProps(newProps) {
        console.log("Catalog wrap: Receive props");
        // this.setState({loading: this.props.productStore.fetchProduct || this.props.catalogStore.fetchCatalog});

        // Данные из стора о завершении загрузки данных
        if(_.trimEnd(this.props.location.pathname, '/') != _.trimEnd(newProps.location.pathname, '/')) {
            this.analyzePath(newProps.location);
        }

        if(newProps.productStore.fetchProduct == false && newProps.catalogStore.catalogInfoFetch == false) {
            // Анализ данных из стора
            if(this.props.catalogStore.catalogInfoFetch != newProps.catalogStore.catalogInfoFetch) {
                // Данные о каталоге загрузились
                return this.setState({ viewState: ViewState.Catalog, loading: false });
            }

            if(this.props.productStore.fetchProduct != newProps.productStore.fetchProduct) {
                // Данные о продукте загрузились
                return this.setState({ viewState: ViewState.Product, loading: false });
            }
        }
    }

    analyzePath({pathname, search}) {
        console.log("Catalog wrap: analyze path");
        const nodes = pathname.substr(1).replace(/\/$/, "").split('/');

        //  -- Каталог
        //  ----------------------------------------------------------------   
        // Карточка товара
        // Поиск товара по номеру модели
        // Фильтр: f-clf0-cl00 f-(тип)-(значение)
        const lastNode = _.last(nodes);
        const firstNode = _.first(_.tail(nodes));
        let catalogPath = '/catalog';
        let filterQuery = null;
        let filterSet = false;

        // Товар
        if(!isNaN(lastNode.charAt(0))) {
            if(lastNode != this.props.productStore.productData.id) {
                // Загрузка информации о товаре
                console.log("Catalog wrap: loading product info");
                this.props.getProductModel(lastNode);
                return this.setState({loading: true});
            }

            return this.setState({viewState: ViewState.Product, loading: false});
        }

        // Фильтры
        if(lastNode.length >= 2 && lastNode.charAt(0) === 'f' && lastNode.charAt(1) === '-') {
            // ../f-
            const filterProps = lastNode.substr(2).split('-');
            filterSet = true;

            let filters = [];
            _.each(filterProps, filter => {
                // Протокол фильтра
                // Две лидирующие буквы - тип фильтра: bs(BS), ct(CT), ...
                // Остальные - тело фильтра: XX55 -> 55
                if(filter.length >= 3 && isNaN(filter.charAt(0)) && isNaN(filter.charAt(1))) {
                    filters = [...filters, {
                        type: filter.substr(0, 2).toLowerCase(),
                        body: filter.substr(2).toLowerCase()
                    }]
                }
            })

            if(filters.length > 0) {
                filterQuery = `f-${_.join(_.map(filters, filter => `${filter.type}${filter.body}`), '-')}`;
                // dispatch()
            }
        }

        // Каталог
        // Сочетание с фильтром: на любом этапе
        const catalogQuery = _.tail(nodes);
        if(catalogQuery.length > 0) {
            // Загрука каталога
            console.log("Catalog wrap: loading catalog info");
            this.props.catalogLoad(_.join(catalogQuery, '/'));
            return this.setState({loading: true});
        }
    }

    render() {
        const content = () => {
            if(this.state.viewState == ViewState.Catalog && this.props.catalogStore.catalogInfo.productCategoryId != null) {
                // Отобразить каталог
                console.log("Catalog render");
                return(
                    <Catalog
                        history={this.props.history}
                        match={this.props.match}
                        location={this.props.location}/>
                )
            } else 
            if(this.state.viewState == ViewState.Product && this.props.productStore.productData.productModelId != null) {
                // Отобразить товар
                // Выполнить редирект если пути не совпадают
                // И если завершен процесс загрузки
                if(_.trimEnd(this.props.location.pathname, '/') != this.props.productStore.productData.path() && this.state.loading == false) {
                    console.log("Redirect product render");
                    return <Redirect to={`${this.props.productStore.productData.path()}${this.props.location.search}`} />
                }

                console.log("Product render");
                return(
                    <ProductCard
                        history={this.props.history}
                        match={this.props.match}
                        location={this.props.location}/>)
            } else if(this.state.loading == true) {
                console.log("Empty render");
                // Пустая страница
                return(<div>{"Загрузка..."}</div>);
            } else {
                // Страница 404
                console.log("404");
                return(<DefPages.Default404 />);
            }
        }
        return(
            <ContentContainer loading={this.state.loading}>
                {content()}
            </ContentContainer>
        )
    }
}

const mstp = state => {
    return {
        catalogStore: state.catalog,
        productStore: state.product 
    }
}

export default connect(mstp, Object.assign({},
    ProductStore.actionCreators,
    CatalogStore.actionCreators,
    ReviewCollectionStore.actionCreators
))(Controller);