import React                        from 'react';
import { connect }                  from 'react-redux';
import { matchPath }                from 'react-router';
import { 
    Route,
    Redirect
}                                   from 'react-router-dom';
import update                       from 'immutability-helper';

import * as Grid                    from '../lib/grid';
import * as DefPages                from './DefaultPages';
import ContentContainer             from '../components/utility/content-container';

import {
    actionCreators as catalgoPageActionCreators
}                                   from '../store/catalog';
import {
    actionCreators as productModelActionCreators
}                                   from '../store/productModel';
import * as ReviewCollectionStore   from '../store/reviewCollection';

import Catalog                      from './Catalog';
import ProductCard                  from './ProductCard';
import { BreadCrumb }               from '../components/navigation/bread-crumbs';

import { CatalogPageFilters }       from '../models/CatalogPageFilters';

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
            loading: false,

            catalogPageNumber: 0,
            catalogPageFilters: new CatalogPageFilters()
        }

        this.applyFilters = this.applyFilters.bind(this);
        this.handleCatalogSetFilter = this.handleCatalogSetFilter.bind(this);
        this.handleCatalogPageLoadMore = this.handleCatalogPageLoadMore.bind(this);
    }

    componentWillMount() {
        this.analyzePath(this.props.location);
    }
    
    componentWillReceiveProps(newProps) {
        console.log("Catalog wrap: Receive props");

        // Данные из стора о завершении загрузки данных
        if(_.trimEnd(this.props.location.pathname, '/') != _.trimEnd(newProps.location.pathname, '/')) {
            this.analyzePath(newProps.location);
        }

        if(newProps.productModelStore.loading == false && newProps.catalogStore.catalogInfoFetch == false) {
            // Анализ данных из стора
            if(this.props.catalogStore.catalogInfoFetch != newProps.catalogStore.catalogInfoFetch) {
                // Данные о каталоге загрузились
                return this.setState({ viewState: ViewState.Catalog, loading: false });
            }

            if(this.props.productModelStore.loading != newProps.productModelStore.loading) {
                // Данные о продукте загрузились
                return this.setState({ viewState: ViewState.Product, loading: false });
            }
        }
    }

    analyzePath({pathname, search}) {
        console.log("Catalog wrap: analyze path");
        const nodes = pathname.substr(1).replace(/\/$/, "").split('/');

        // Товар
        const lastNode = _.last(nodes);
        if(!isNaN(lastNode.charAt(0))) {
            if(this.props.productModelStore.productModel == null || lastNode != this.props.productModelStore.productModel.productModelId) {
                // Загрузка информации о товаре
                console.log("Catalog wrap: loading product info");
                this.props.getProductModel(lastNode);
                return this.setState({viewState: ViewState.Product, loading: true});
            }

            return this.setState({ viewState: ViewState.Product, loading: false });
        }

        // Каталог
        // Сочетание с фильтром: на любом этапе
        console.log("Catalog wrap: loading catalog info");
        const catalogPageFilters = this.analyzeFilters(nodes);
        this.props.loadCatalogPageInfo(catalogPageFilters);
        this.props.loadCatalogProductModels(catalogPageFilters, 0);
        this.setState({ viewState: ViewState.Catalog, catalogPageFilters, catalogPageNumber: 0 });
    }

    analyzeFilters(nodes) {
        console.warn(nodes);
        let catalogPageFilters = new CatalogPageFilters();

        // Установка базовых цен для ползунка
        catalogPageFilters.pricePerItemFrom = 0;
        catalogPageFilters.pricePerItemTo = 5000;
        catalogPageFilters.catalogPathNodes = nodes;

        var lastNode = _.last(catalogPageFilters.catalogPathNodes);

        // Проверка на наличее фильтров
        if(lastNode.length >= 2 && lastNode.charAt(0) === 'f' && lastNode.charAt(1) === '-') {
            catalogPageFilters.catalogPathNodes = _.initial(catalogPageFilters.catalogPathNodes);
            const filterProps = lastNode.substr(2).split('-');
            _.each(filterProps, filter => {
                // Протокол фильтра
                // Две лидирующие буквы - тип фильтра: bs(BS), ct(CT), ...
                // Остальные - тело фильтра: XX55 -> 55
                if(filter.length >= 3 && isNaN(filter.charAt(0)) && isNaN(filter.charAt(1))) {
                    const filterType = filter.substr(0, 2).toLowerCase();
                    const filterBody = filter.substr(2).toLowerCase();

                    console.log("Filter type: ", filterType);

                    // Установка значений
                    switch(filterType) {
                        case 'pp': {
                            catalogPageFilters.itemsOnPage = filterBody
                        }; break;
                        case 'rt': {
                            catalogPageFilters.rating = filterBody
                        }; break;
                        case 'cl': {
                            catalogPageFilters.colorCodes = [
                                ...catalogPageFilters.colorCodes, filterBody
                            ]
                        } break;
                        case 'dc': {
                            catalogPageFilters.sortById = Math.floor(filterBody / 10),
                            catalogPageFilters.sortByDesc = filterBody % 10
                        } break;
                        case 'pi': {
                            const values = filterBody.split('_');
                            const minValue = 0;
                            const maxValue = 5000;
                            const leftValue = Math.max(Math.abs(parseFloat(values[0]) || minValue), minValue);
                            const rightValue = Math.min(Math.abs(parseFloat(values[1]) || maxValue), maxValue);

                            const correctLeftValue = Math.min(leftValue, rightValue);
                            const correctRightValue = Math.max(leftValue, rightValue);

                            if(correctLeftValue > minValue) catalogPageFilters.pricePerItemFrom = correctLeftValue;
                            if(correctRightValue < maxValue) catalogPageFilters.pricePerItemTo = correctRightValue;
                        } break;
                        case 'ct': {
                            // Подкатегории товаров
                            catalogPageFilters.catalogIds = [
                                ...catalogPageFilters.catalogIds, filterBody
                            ]
                        } break;
                        case 'sn': {
                            // Сезонность (осень, весна...)
                            if(filterBody.length >= 1) {
                                var code = filterBody.toLowerCase().substr(0, 2);
                                if(code.match(/[0-9]/)) {
                                    catalogPageFilters.seasonsCodes = parseInt(code);
                                }
                            }
                        }
                    }
                }
            })
        }

        return catalogPageFilters;
    }

    applyFilters() {
        var path = this.props.location.pathname;
        var nodes = this.props.location.pathname.substr(1).replace(/\/$/, "").split('/');
        var lastNode = _.last(nodes);
        if(lastNode.length >= 2 && lastNode.charAt(0) === 'f' && lastNode.charAt(1) === '-') {
            path = '/' + _.join(_.initial(nodes), '/');
        }

        // Работа с фильтрами
        var filters = [];

        // Фильтр количества товаров на странице
        if(this.state.catalogPageFilters.itemsOnPage != 20) {
            filters = [...filters, {
                type: 'pp',
                body: this.state.catalogPageFilters.itemsOnPage
            }];
        }

        // Фильтр цветов
        filters = _.concat(filters, _.map(this.state.catalogPageFilters.colorCodes, colorCode => {
            return {
                type: 'cl',
                body: colorCode
            }
        }));

        // Рэйтинг
        if(this.state.catalogPageFilters.rating > 0) {
            filters = [...filters, {
                type: 'rt',
                body: this.state.catalogPageFilters.rating
            }]
        }

        // Сортировка
        filters = [...filters, {
            type: 'dc',
            body: `${this.state.catalogPageFilters.sortById}${this.state.catalogPageFilters.sortByDesc ? 1 : 0}`
        }];

        // Цена
        if(this.state.catalogPageFilters.pricePerItemFrom != this.state.catalogPageFilters.pricePerItemTo) {
            const minValue = (this.props.catalogStore.catalogPage.catalogPageInfo || { minListPrice: 0 }).minListPrice;
            const maxValue = (this.props.catalogStore.catalogPage.catalogPageInfo || { maxListPrice: 5000 }).maxListPrice;
            let values = '';

            if(this.state.catalogPageFilters.pricePerItemFrom > minValue)
                values += this.state.catalogPageFilters.pricePerItemFrom;
            if(this.state.catalogPageFilters.pricePerItemTo < maxValue)
                values += '_' + this.state.catalogPageFilters.pricePerItemTo;

            console.log("asdfasdfasdfasdfa", values, this.state.catalogPageFilters, this.props.catalogStore.catalogPage);

            if(values != '') {
                filters = [...filters, {
                    type: 'pi',
                    body: values
                }]
            }
        }

        // Каталог
        filters = _.concat(filters, _.map(this.state.catalogPageFilters.catalogIds, catalogId => {
            return {
                type: 'ct',
                body: catalogId
            }
        }));

        // Сезонность
        if(this.state.catalogPageFilters.seasonsCodes != 0) 
            filters = [...filters, {
                type: 'sn',
                body: this.state.catalogPageFilters.seasonsCodes
            }];

        // Обновление состояния компонента
        // И пуш нового пути (если он новый)
        if(filters.length == 0) {
            console.warn("Filters are crear");
        }

        var oldPath = this.props.location.pathname + this.props.location.search;
        var newPath = (() => {
            if(filters.length == 0) {
                console.warn("Filters are crear");
                return `${path}${this.props.location.search}`;
            } else {
                var filterQuery = `f-${_.join(_.map(_.compact(_.flatten(filters)), filter => `${filter.type}${filter.body}`), '-')}`;
                console.log("Filters query: ", filterQuery);
                return `${path}/${filterQuery}${this.props.location.search}`;
            }
        })();

        console.log("History: old location: ", oldPath);
        console.log("History: new location: ", newPath);

        var pathsIsMatch = matchPath(newPath, {
            path: oldPath,
            exact: true,
            strict: false
        });

        if(!pathsIsMatch) {
            console.log("History. Change location...");
            this.props.history.push(newPath);
            console.warn("History: location changed");
        } else {
            console.error("Locations is the same");
        }
    }

    handleCatalogSetFilter(newValue) {
        this.setState({catalogPageFilters: update(this.state.catalogPageFilters, newValue)}, () => {
            console.warn("Set filters", this.state.catalogPageFilters);
            this.applyFilters();
        });
    }

    // Catalog Page handlers
    handleCatalogPageLoadMore() {
        this.props.loadCatalogProductModels(this.state.catalogPageFilters, this.state.catalogPageNumber++);
    }

    render() {
        const content = () => {
            if(
                this.state.viewState == ViewState.Catalog && 
                this.props.catalogStore.catalogPage.catalogPageId != null
            ) {
                // Отобразить каталог
                console.log("Catalog render");
                return(
                    <Catalog
                        catalogPage={this.props.catalogStore.catalogPage}
                        catalogPageFilters={this.state.catalogPageFilters}
                        onFilterSet={this.handleCatalogSetFilter}
                        productModels={this.props.catalogStore.productModels}
                        productModelsHasMore={this.props.catalogStore.productModelsHasMore}
                        onLoadProductsModel={this.handleCatalogPageLoadMore} />)
            } else 
            if(
                this.state.viewState == ViewState.Product && 
                this.props.productModelStore.productModel.productModelId != null &&
                this.props.productModelStore.result.success == true
            ) {
                // Отобразить товар
                // Выполнить редирект если пути не совпадают
                // И если завершен процесс загрузки
                if(_.trimEnd(this.props.location.pathname, '/') != this.props.productModelStore.productModel.path() && this.state.loading == false) {
                    console.log("Redirect product render");
                    return <Redirect to={`${this.props.productModelStore.productModel.path()}${this.props.location.search}`} />
                }

                console.log("Product render");
                return(
                    <ProductCard
                        history={this.props.history}
                        match={this.props.match}
                        location={this.props.location}/>)
            } else if(
                this.props.catalogStore.catalogPageLoading == true ||
                this.props.productModelStore.loading == true
            ) {
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
        productModelStore: state.productModel
    }
}

export default connect(mstp, Object.assign({}, catalgoPageActionCreators, productModelActionCreators))(Controller);