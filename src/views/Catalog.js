import React            from 'react';
import { connect }      from 'react-redux';
import { matchPath }    from 'react-router';
import { 
    Route,
    Redirect,
    NavLink
}                       from 'react-router-dom';
import {
    StickyContainer
}                       from 'react-sticky';
import update           from 'immutability-helper';

import * as Grid        from '../lib/grid';
import * as DefPages    from './DefaultPages';
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

import * as CatalogS    from '../store/catalog';
import * as CartS       from '../store/cart';

import {
    CatalogFiltersCollection,
    ProductModel,
    ProductCategory
}                       from '../store/__models';

import {
    __catalogPage,
    __productModel
}                       from '../store/api-requests';
import { CatalogPage } from '../models/CatalogPage';
import { CatalogPageFilters } from '../models/CatalogPageFilters';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageNumber: 0,

            catalogPage: new CatalogPage(),
            catalogPageLoading: false,

            productModels: [],
            productModelsHasMore: true,
            productModelsLoading: false,

            catalogPageFilters: new CatalogPageFilters()
        }

        this.loadProductModels = this.loadProductModels.bind(this);
        this.loadCatalogPageInfo = this.loadCatalogPageInfo.bind(this);
        this.reloadCatalog = this.reloadCatalog.bind(this);
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
        this.analyzeFilters = this.analyzeFilters.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.setStateFilters = this.setStateFilters.bind(this);
    }

    componentWillMount() {
        this.reloadCatalog(this.props.location);
    }

    componentWillReceiveProps(nextProps) {
        if(!matchPath(nextProps.location.pathname, {
            path: this.props.location.pathname,
            exact: true,
            strict: false
        })) {
            this.reloadCatalog(nextProps.location);
        }
    }

    //  -- Перезагрузка каталога
    reloadCatalog(location) {
        this.state.pageNumber = 0;
        this.state.productModels = [];
        this.analyzeFilters(location);
        this.loadCatalogPageInfo();
        this.loadProductModels();
    }

    //  -- Работа со списком товаров
    loadProductModels() {
        if(!this.state.productModelsLoading) {
            this.setState({ productModelsLoading: true }, () => {
                __productModel.Get.Many(this.state.catalogPageFilters, this.state.pageNumber)(data => {
                    this.setState({
                        productModels: _.concat(this.state.productModels, _.map(data, productModel => new ProductModel(productModel))),
                        productModelsHasMore: data != null && data.length == this.state.productsOnPage,
                        productModelsLoading: false,
                        pageNumber: this.state.pageNumber + 1
                    });
                });
            })
        }
    }

    //  -- Работа с информацией о каталоге
    loadCatalogPageInfo() {
        if(!this.state.cataloPageInfoLoading) {
            this.setState({ catalogPageLoading: true }, () => {
                __catalogPage.Get.Single(this.state.catalogPageFilters)(data => {
                    this.setState({
                        catalogPage: new CatalogPage(data),
                        catalogPageLoading: false,
                    });
                });
            });
        }
    }

    //  -- Работа с фильтрами --------------
    setStateFilters(newValue) {
        this.setState({catalogPageFilters: update(this.state.catalogPageFilters, newValue)}, () => {
            console.warn("R: 1.1", this.state.catalogPageFilters.pricePerItemTo);
            this.applyFilters();
        });
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
            const minValue = this.state.catalogPage.minPrice || 0;
            const maxValue = this.state.catalogPage.maxPrice || 5000;
            let values = '';

            if(this.state.catalogPageFilters.pricePerItemFrom > minValue)
                values += this.state.catalogPageFilters.pricePerItemFrom;
            if(this.state.catalogPageFilters.pricePerItemTo < maxValue)
                values += '_' + this.state.catalogPageFilters.pricePerItemTo;

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
        filters = _.concat(filters, _.map(this.state.catalogPageFilters.seasonsCodes, seasonCode => {
            return {
                type: 'sn',
                body: seasonCode
            }
        }));

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

    analyzeFilters(location) {
        console.warn("Analyze path: begin", location);
        let catalogPageFilters = new CatalogPageFilters();

        // Установка базовых цен для ползунка
        catalogPageFilters.pricePerItemFrom = this.state.catalogPage.minPrice || 0;
        catalogPageFilters.pricePerItemTo = this.state.catalogPage.maxPrice || 5000;
        catalogPageFilters.catalogPathNodes = location.pathname.substr(1).split('/');

        var lastNode = _.last(catalogPageFilters.catalogPathNodes);

        // Проверка на наличее фильтров
        if(lastNode.length >= 2 && lastNode.charAt(0) === 'f' && lastNode.charAt(1) === '-') {
            catalogPageFilters.catalogPathNodes = _.initial(catalogPageFilters.catalogPathNodes);
            console.warn('ANANANSDNASNDASNDASND', catalogPageFilters.catalogPathNodes);
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
                            const minValue = this.state.catalogPage.minPrice || 0;
                            const maxValue = this.state.catalogPage.maxPrice || 5000;
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
                                var code = filterBody.toLowerCase().substr(0, 1);
                                if(code.match(/[0-9a-f]/)) {
                                    catalogPageFilters.seasonsCodes = [
                                        ...catalogPageFilters.seasonsCodes, code
                                    ]
                                }
                            }
                        }
                    }
                }
            })
        }

        this.setState({catalogPageFilters});
    }

    //  -- Хэндлеры событий ----------------
    handleChangeItemsOnPage(itemsOnPage) {
        if(this.state.catalogPageFilters.itemsOnPage != itemsOnPage) {
            this.setStateFilters({itemsOnPage: {$set: itemsOnPage}});
        }
    }

    handlePriceValueChange(values) {
        this.setStateFilters({$merge: {
            pricePerItemFrom: values.leftValue,
            pricePerItemTo: values.rightValue
        }});
    }

    handleSelectNode(nodeId, selected) {
        if(!selected) {
            this.setStateFilters({catalogIds: {$push: [nodeId]}});
        } else {
            this.setStateFilters({catalogIds: {$splice: [
                [_.findIndex(this.state.catalogPageFilters.catalogIds, x => x == nodeId), 1]
            ]}});
        }
    }

    handleSelectNodeReset() {
        this.setStateFilters({catalogIds: {$set: []}});
    }

    handleSeasonsCodesChange(seasonCode, selected) {
        if(!selected) {
            this.setStateFilters({seasonsCodes: {$push: [seasonCode]}});
        } else {
            this.setStateFilters({seasonsCodes: {$splice: [
                [_.findIndex(this.state.catalogPageFilters.seasonsCodes, x => x == seasonCode), 1]
            ]}});
        }
    }

    handleSeasonsCodesReset() {
        this.setStateFilters({seasonsCodes: {$set: []}});
    }

    handlePriceReset() {
        this.setState({
            leftPrice: this.state.catalogPage.catalogPageInfo.minListPrice,
            rightPrice: this.state.catalogPage.catalogPageInfo.maxListPrice
        });
    }

    handleColorCodesSelectChange(colorCode, selected) {
        const index = _.findIndex(this.state.catalogPageFilters.colorCodes, x => x == colorCode);

        if(index == -1) {
            this.setStateFilters({colorCodes: {$push: [colorCode]}})
        } else {
            this.setStateFilters({colorCodes: {$splice: [[index, 1]]}})
        }
    }

    handleColorCodesReset() {
        this.setStateFilters({colorCodes: {$set: []}});
    }

    handleRatingChange(newRating) {
        this.setStateFilters({rating: {$set: newRating}});
    }

    handleRatingReset() {
        this.setStateFilters({rating: {$set: 0}});
    }

    handleSortByChange(id) {
        if(this.state.catalogPageFilters.sortById == id) {
            this.setStateFilters({sortByDesc: {$set: !this.state.catalogPageFilters.sortByDesc}});
        } else {
            this.setStateFilters({$merge: {
                sortById: id,
                sortByDesc: false
            }});
        }
    }

    render() {
        return(
            <div className="catalog">
                <Grid.VerticalGrid>
                    <Grid.GridLine>
                        <BreadCrumb nodes={this.state.catalogPage.pathChain.nodes} />
                        <PageHeader title={this.state.catalogPage.title}/>
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
                                                this.state.catalogPage.catalogPageInfo.catalogSubPages &&
                                                this.state.catalogPage.catalogPageInfo.catalogSubPages.length > 0 &&
                                                <CatalogList
                                                    productSubCategories={this.state.catalogPage.catalogPageInfo.catalogSubPages}
                                                    selectedNodes={this.state.catalogPageFilters.catalogIds}
                                                    onSelectNode={this.handleSelectNode}
                                                    onReset={this.handleSelectNodeReset}/>
                                            }
                                            <PriceRange
                                                minValue={this.state.catalogPage.catalogPageInfo.minListPrice}
                                                maxValue={this.state.catalogPage.catalogPageInfo.maxListPrice}
                                                leftValue={this.state.catalogPageFilters.pricePerItemFrom}
                                                rightValue={this.state.catalogPageFilters.pricePerItemTo}
                                                onValueChange={this.handlePriceValueChange}
                                                onReset={this.handlePriceReset}/>
                                            <ColorPicker
                                                selectedColors={this.state.catalogPageFilters.colorCodes}
                                                avalibleColors={this.state.catalogPage.catalogPageInfo.ColorCodes}
                                                onSelectChange={this.handleColorCodesSelectChange}
                                                onReset={this.handleColorCodesReset}/>
                                            <SeasonList
                                                seasons={this.state.catalogPage.catalogPageInfo.Seasons}
                                                selectedSeasonsCodes={this.state.catalogPageFilters.seasonsCodes}
                                                onSelectChange={this.handleSeasonsCodesChange}
                                                onReset={this.handleSeasonsCodesReset}/>
                                            <RatingSelect
                                                rating={this.state.catalogPageFilters.rating}
                                                maxAverageRating={this.state.catalogPage.catalogPageInfo.maxAverageRating}
                                                onRatingChange={this.handleRatingChange}
                                                onReset={this.handleRatingReset}/>
                                        </Grid.VerticalGrid>
                                </FiltersContainer>
                            </Grid.Col>
                            <Grid.Col lg={13} md={13} sm={16} xs={16}>
                                <Grid.VerticalGrid>
                                    <CatalogHeader
                                        title={this.state.catalogPage.title}
                                        itemsOnPage={this.state.catalogPageFilters.itemsOnPage}
                                        itemsOnPageValues={this.state.catalogPageFilters.itemsOnPageValues}
                                        onItemsOnPageChange={this.handleChangeItemsOnPage}
                                        sortByItems={this.state.catalogPageFilters.sortByItems}
                                        sortBySelectedId={this.state.catalogPageFilters.sortById}
                                        sortByDesc={this.state.catalogPageFilters.sortByDesc}
                                        onSortByChange={this.handleSortByChange}/>
                                    <CatalogGrid
                                        catalogId={this.state.catalogPage.catalogPageId}
                                        productModels={this.state.productModels}
                                        loadMore={this.loadProductModels}
                                        hasMore={this.state.productModelsHasMore}
                                        onCartAdd={this.props.setCartOrderProduct}/>
                                </Grid.VerticalGrid>
                            </Grid.Col>
                        </Grid.Container>
                    </Grid.Row>
                </Grid.VerticalGrid>
            </div>
        )
    }
}

const mstp = state => state.catalog;

export default connect(mstp, Object.assign({}, CatalogS.actionCreators, CartS.actionCreators))(Controller);