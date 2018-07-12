import React            from 'react';
import { connect }      from 'react-redux';
import { matchPath }    from 'react-router';
import { 
    Route,
    Redirect,
    NavLink
}                       from 'react-router-dom';
import { withPage }     from './shared/Page';

import {
    StickyContainer
}                       from 'react-sticky';

import {
    actionCreators
}                       from '../store/catalog';
import {
    CatalogPageFilters
}                       from '../models/CatalogPageFilters';

import * as Grid        from '../lib/grid';
import { BreadCrumb }   from '../components/navigation/bread-crumbs';

import FiltersContainer from '../components/filters';
import CatalogList      from '../components/filters/catalog-list';
import PriceRange       from '../components/filters/price-range';
import ColorPicker      from '../components/filters/color-picker';
import SeasonList       from '../components/filters/chb-season';
import RatingSelect     from '../components/filters/rating-select';

import { PageHeader }   from '../components/utility/titles';
import CatalogHeader    from '../components/catalog/catalog-header';
import CatalogLoader    from '../components/catalog/catalog-loader';
import CatalogGrid      from '../components/catalog/catalog-grid';
import { CatalogPage }  from '../models/CatalogPage';
import { ProductModel } from '../store/__models';

function catalogPageToPageData(catalogPage) {
    if(catalogPage == null) return null;

    const pageMeta = {
        title: catalogPage.title,
        seo: catalogPage.seo,
        description: catalogPage.title,
        image: '',
        url: catalogPage.path
    }

    const breadCrumbs = _.map([...catalogPage.pathChain.nodes, {
        seo: pageMeta.seo,
        title: pageMeta.title
    }], b => ({ seo: b.seo, title: b.title, path: 'path' }));

    return ({ pageMeta, breadCrumbs });
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            catalogPage: null,
            catalogPageNumber: 0,
            catalogPageFilters: new CatalogPageFilters(),
            productModels: null
        }

        this.applyFilters = this.applyFilters.bind(this);
        this.handleCatalogSetFilter = this.handleCatalogSetFilter.bind(this);
        this.handleCatalogPageLoadMore = this.handleCatalogPageLoadMore.bind(this);
        this.handlePriceValueChange = this.handlePriceValueChange.bind(this);
        this.handlePriceReset = this.handlePriceReset.bind(this);
        this.handleSelectNode = this.handleSelectNode.bind(this);
        this.handleSelectNodeReset = this.handleSelectNodeReset.bind(this);
        this.handleColorCodesSelectChange = this.handleColorCodesSelectChange.bind(this);
        this.handleColorCodesReset = this.handleColorCodesReset.bind(this);
        this.handleSeasonsCodesChange = this.handleSeasonsCodesChange.bind(this);
        this.handleSeasonsCodesReset = this.handleSeasonsCodesReset.bind(this);
        this.handleRatingChange = this.handleRatingChange.bind(this);
        this.handleRatingReset = this.handleRatingReset.bind(this);
        this.handleSortByChange = this.handleSortByChange.bind(this);
        this.handleChangeItemsOnPage = this.handleChangeItemsOnPage.bind(this);
    }

    componentWillMount() {
        this.state.catalogPageFilters = this.analyzeFilters(this.props.location.pathname.substr(1).replace(/\/$/, "").split('/'));
        this.props.initializePage({ seo: 'catalog' }, (callback) => {
            // Информация о каталоге
            if(this.props.catalogPage == null/* || !CatalogPageFilters.isEqual(this.props.catalogPageFilters, this.state.catalogPageFilters)*/) {
                this.props.logMessage('Catalo info async start');
                this.props.loadCatalogPageInfo(this.state.catalogPageFilters,
                    data => {
                        this.props.logMessage('Catalo info async loading complete');
                        // Асинхронный колбек загрузки
                        this.state.catalogPage = new CatalogPage(data);

                        // Устанавливаем мету и хлебные крошки
                        callback(catalogPageToPageData(data));

                        // Форсим апдейт, так как метод асинхронный
                        this.forceUpdate();
                    }, 
                    error => {
                        // Ошибка агрузки, форсим 404
                        this.props.logMessage('Catalo info async loading complete ERROR');
                        this.state.catalogPage = null;
                        callback(null);
                        this.forceUpdate();
                    });
            } else {
                this.state.catalogPage = new CatalogPage(this.props.catalogPage);
                // Установить мету страницы и хлебные крошки
                callback(catalogPageToPageData(this.state.catalogPage));
            }

            // Список товарав для данного каталога
            if(this.props.productModels == null || !CatalogPageFilters.isEqualForProducts(this.props.catalogPageFilters, this.state.catalogPageFilters)) {
                // this.props.loadCatalogProductModels(this.state.catalogPageFilters, this.state.catalogPageNumber);
            } else {
                this.state.productModels = _.map(this.props.productModels, p => new ProductModel(p));
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        this.props.logMessage('Catalo receive props');
        if(_.trimEnd(this.props.location.pathname, '/') != _.trimEnd(nextProps.location.pathname, '/')) {
            this.state.catalogPageFilters = this.analyzeFilters(nextProps.location.pathname.substr(1).replace(/\/$/, "").split('/'));
            this.props.loadCatalogPageInfo(this.state.catalogPageFilters);
            // this.props.loadCatalogProductModels(this.state.catalogPageFilters, this.state.catalogPageNumber);
        }

        if(!nextProps.catalogPageLoading && this.props.catalogPageLoading) {
            // Изменилось состояние загрузки информации о каталоге
            // Загрузка закончилась
            this.props.logMessage('Catalo info loading complete');
            this.state.catalogPage = new CatalogPage(nextProps.catalogPage);

            // Установить мету страницы и хлебные крошки
            this.props.logMessage('Catalo set pageData');
            this.props.setPageData(catalogPageToPageData(this.state.catalogPage));
        }

        if(!nextProps.productModelsLoading && this.props.productModelsLoading) {
            // Загрузка списка товаров закончена
            this.state.productModels = _.map(nextProps.productModels, p => new ProductModel(p));
        }
    }

    //  #region Filters
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
    //  #endregion

    // Catalog Page handlers
    handleCatalogPageLoadMore() {
        this.props.loadCatalogProductModels(this.state.catalogPageFilters, this.state.catalogPageNumber++);
    }

    //  -- Хэндлеры событий ----------------
    handleChangeItemsOnPage(itemsOnPage) {
        if(this.state.catalogPageFilters.itemsOnPage != itemsOnPage) {
            this.props.onFilterSet({itemsOnPage: {$set: itemsOnPage}});
        }
    }

    handlePriceValueChange(values) {
        this.props.onFilterSet({$merge: {
            pricePerItemFrom: values.leftValue,
            pricePerItemTo: values.rightValue
        }});
    }

    handleSelectNode(nodeId, selected) {
        if(!selected) {
            this.props.onFilterSet({catalogIds: {$push: [nodeId]}});
        } else {
            this.props.onFilterSet({catalogIds: {$splice: [
                [_.findIndex(this.state.catalogPageFilters.catalogIds, x => x == nodeId), 1]
            ]}});
        }
    }

    handleSelectNodeReset() {
        this.props.onFilterSet({catalogIds: {$set: []}});
    }

    handleSeasonsCodesChange(seasonCode, selected) {
        if(!selected) {
            this.props.onFilterSet({seasonsCodes: {$set: this.state.catalogPageFilters.seasonsCodes | seasonCode}});
            console.error("TTTTTT", this.state.catalogPageFilters.seasonsCodes | seasonCode);
        } else {
            this.props.onFilterSet({seasonsCodes: {$set: this.state.catalogPageFilters.seasonsCodes & ~seasonCode}});
            console.error("EEEEEE", this.state.catalogPageFilters.seasonsCodes & ~seasonCode);
        }
    }

    handleSeasonsCodesReset() {
        this.props.onFilterSet({seasonsCodes: {$set: []}});
    }

    handlePriceReset() {
        this.props.onFilterSet({
            leftPrice: {$set: this.props.catalogPage.catalogPageInfo.minListPrice},
            rightPrice: {$set: this.props.catalogPage.catalogPageInfo.maxListPrice}
        });
    }

    handleColorCodesSelectChange(colorCode, selected) {
        const index = _.findIndex(this.state.catalogPageFilters.colorCodes, x => x == colorCode);

        if(index == -1) {
            this.props.onFilterSet({colorCodes: {$push: [colorCode]}})
        } else {
            this.props.onFilterSet({colorCodes: {$splice: [[index, 1]]}})
        }
    }

    handleColorCodesReset() {
        this.props.onFilterSet({colorCodes: {$set: []}});
    }

    handleRatingChange(newRating) {
        this.props.onFilterSet({rating: {$set: newRating}});
    }

    handleRatingReset() {
        this.props.onFilterSet({rating: {$set: 0}});
    }

    handleSortByChange(id) {
        if(this.state.catalogPageFilters.sortById == id) {
            this.props.onFilterSet({sortByDesc: {$set: !this.state.catalogPageFilters.sortByDesc}});
        } else {
            this.props.onFilterSet({$merge: {
                sortById: id,
                sortByDesc: false
            }});
        }
    }

    render() {
        if(this.props.catalogPageLoading) {
            return <div>{"Loading..."}</div>
        } else if(this.state.catalogPage != null) {
            return(
                <div className="catalog">
                    <Grid.VerticalGrid>
                        <Grid.GridLine>
                            <PageHeader title={this.props.catalogPage.title}/>
                        </Grid.GridLine>
                        <Grid.Row>
                            <Grid.Container>
                                <Grid.Col lg={3} md={3} sm={16} xs={16}>
                                    <FiltersContainer
                                        sortByItems={this.state.catalogPageFilters.sortByItems}
                                        sortBySelectedId={this.state.catalogPageFilters.sortById}
                                        sortByDesc={this.state.catalogPageFilters.sortByDesc}
                                        onSortByChange={this.handleSortByChange}>
                                            <Grid.VerticalGrid>
                                                {
                                                    this.props.catalogPage.catalogPageInfo.catalogSubPages &&
                                                    this.props.catalogPage.catalogPageInfo.catalogSubPages.length > 0 &&
                                                    <CatalogList
                                                        productSubCategories={this.props.catalogPage.catalogPageInfo.catalogSubPages}
                                                        selectedNodes={this.state.catalogPageFilters.catalogIds}
                                                        onSelectNode={this.handleSelectNode}
                                                        onReset={this.handleSelectNodeReset}/>
                                                }
                                                <PriceRange
                                                    minValue={this.props.catalogPage.catalogPageInfo.minListPrice}
                                                    maxValue={this.props.catalogPage.catalogPageInfo.maxListPrice}
                                                    leftValue={this.state.catalogPageFilters.pricePerItemFrom}
                                                    rightValue={this.state.catalogPageFilters.pricePerItemTo}
                                                    onValueChange={this.handlePriceValueChange}
                                                    onReset={this.handlePriceReset}/>
                                                <ColorPicker
                                                    selectedColors={this.state.catalogPageFilters.colorCodes}
                                                    avalibleColors={this.props.catalogPage.catalogPageInfo.ColorCodes}
                                                    onSelectChange={this.handleColorCodesSelectChange}
                                                    onReset={this.handleColorCodesReset}/>
                                                <SeasonList
                                                    seasons={this.props.catalogPage.catalogPageInfo.Seasons}
                                                    selectedSeasonsCodes={this.state.catalogPageFilters.seasonsCodes}
                                                    onSelectChange={this.handleSeasonsCodesChange}
                                                    onReset={this.handleSeasonsCodesReset}/>
                                                <RatingSelect
                                                    rating={this.state.catalogPageFilters.rating}
                                                    maxAverageRating={this.props.catalogPage.catalogPageInfo.maxAverageRating}
                                                    onRatingChange={this.handleRatingChange}
                                                    onReset={this.handleRatingReset}/>
                                            </Grid.VerticalGrid>
                                    </FiltersContainer>
                                </Grid.Col>
                                <Grid.Col lg={13} md={13} sm={16} xs={16}>
                                    <Grid.VerticalGrid>
                                        <CatalogHeader
                                            title={this.props.catalogPage.title}
                                            itemsOnPage={this.state.catalogPageFilters.itemsOnPage}
                                            itemsOnPageValues={this.state.catalogPageFilters.itemsOnPageValues}
                                            onItemsOnPageChange={this.handleChangeItemsOnPage}
                                            sortByItems={this.state.catalogPageFilters.sortByItems}
                                            sortBySelectedId={this.state.catalogPageFilters.sortById}
                                            sortByDesc={this.state.catalogPageFilters.sortByDesc}
                                            onSortByChange={this.handleSortByChange}/>
                                        <CatalogGrid
                                            catalogId={this.props.catalogPage.catalogPageId}
                                            productModels={this.props.productModels}
                                            loadMore={this.props.onLoadProductsModel}
                                            hasMore={this.props.productModelsHasMore}
                                            onCartAdd={this.props.setCartOrderProduct}/>
                                    </Grid.VerticalGrid>
                                </Grid.Col>
                            </Grid.Container>
                        </Grid.Row>
                    </Grid.VerticalGrid>
                </div>
            )
        } else {
            return <div>{"Error"}</div>
        }
    }
}

export default connect(state => ({
    catalogPageFilters: state.catalog.catalogPageFilters,
    catalogPage: state.catalog.catalogPage,
    catalogPageLoading: state.catalog.catalogPageLoading,
    productModels: state.catalog.productModels,
    productModelsLoading: state.catalog.productModelsLoading
}), Object.assign({}, actionCreators))
(withPage(Controller));