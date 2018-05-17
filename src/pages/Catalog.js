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
    CatalogFiltersCollection
}                       from '../store/__models';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            infinityScrollIndex: 0,
            catalogFiltersCollection: new CatalogFiltersCollection()
        }

        this.handleLoadMore = this.handleLoadMore.bind(this);
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
        this.state.catalogFiltersCollection = this.analyzeFilters(this.props.location);
    }

    componentWillReceiveProps(nextProps) {
        if(!matchPath(nextProps.location.pathname, {
            path: this.props.location.pathname,
            exact: true,
            strict: false
        })) {
            // Проанализтровать фильтры, только в случае нового пути
            this.state.catalogFiltersCollection = this.analyzeFilters(nextProps.location);
            this.state.infinityScrollIndex = 0;
            this.forceUpdate();
        }
    }

    //  -- Работа с фильтрами --------------
    setStateFilters(newValue) {
        this.setState({catalogFiltersCollection: update(this.state.catalogFiltersCollection, newValue)}, () => {
            console.warn("R: 1.1", this.state.catalogFiltersCollection.pricePerItemTo);
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
        if(this.state.catalogFiltersCollection.itemsOnPage != 20) {
            filters = [...filters, {
                type: 'pp',
                body: this.state.catalogFiltersCollection.itemsOnPage
            }];
        }

        // Фильтр цветов
        filters = _.concat(filters, _.map(this.state.catalogFiltersCollection.colorCodes, colorCode => {
            return {
                type: 'cl',
                body: colorCode
            }
        }));

        // Рэйтинг
        if(this.state.catalogFiltersCollection.rating > 0) {
            filters = [...filters, {
                type: 'rt',
                body: this.state.catalogFiltersCollection.rating
            }]
        }

        // Сортировка
        filters = [...filters, {
            type: 'dc',
            body: `${this.state.catalogFiltersCollection.sortById}${this.state.catalogFiltersCollection.sortByDesc ? 1 : 0}`
        }];

        // Цена
        if(this.state.catalogFiltersCollection.pricePerItemFrom != this.state.catalogFiltersCollection.pricePerItemTo) {
            const minValue = this.props.catalogInfo.minPrice || 0;
            const maxValue = this.props.catalogInfo.maxPrice || 5000;
            let values = '';

            if(this.state.catalogFiltersCollection.pricePerItemFrom > minValue)
                values += this.state.catalogFiltersCollection.pricePerItemFrom;
            if(this.state.catalogFiltersCollection.pricePerItemTo < maxValue)
                values += '_' + this.state.catalogFiltersCollection.pricePerItemTo;

            if(values != '') {
                filters = [...filters, {
                    type: 'pi',
                    body: values
                }]
            }
        }

        // Каталог
        filters = _.concat(filters, _.map(this.state.catalogFiltersCollection.catalogIds, catalogId => {
            return {
                type: 'ct',
                body: catalogId
            }
        }));

        // Сезонность
        filters = _.concat(filters, _.map(this.state.catalogFiltersCollection.seasonsCodes, seasonCode => {
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
        let catalogFiltersCollection = new CatalogFiltersCollection();

        // Установка базовых цен для ползунка
        catalogFiltersCollection.pricePerItemFrom = this.props.catalogInfo.minPrice || 0;
        catalogFiltersCollection.pricePerItemTo = this.props.catalogInfo.maxPrice || 5000;

        var nodes = location.pathname.substr(1).replace(/\/$/, "").split('/');
        var lastNode = _.last(nodes);

        // Проверка на наличее фильтров
        if(lastNode.length >= 2 && lastNode.charAt(0) === 'f' && lastNode.charAt(1) === '-') {
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
                            catalogFiltersCollection.itemsOnPage = filterBody
                        }; break;
                        case 'rt': {
                            catalogFiltersCollection.rating = filterBody
                        }; break;
                        case 'cl': {
                            catalogFiltersCollection.colorCodes = [
                                ...catalogFiltersCollection.colorCodes, filterBody
                            ]
                        } break;
                        case 'dc': {
                            catalogFiltersCollection.sortById = Math.floor(filterBody / 10),
                            catalogFiltersCollection.sortByDesc = filterBody % 10
                        } break;
                        case 'pi': {
                            const values = filterBody.split('_');
                            const minValue = this.props.catalogInfo.minPrice || 0;
                            const maxValue = this.props.catalogInfo.maxPrice || 5000;
                            const leftValue = Math.max(Math.abs(parseFloat(values[0]) || minValue), minValue);
                            const rightValue = Math.min(Math.abs(parseFloat(values[1]) || maxValue), maxValue);

                            const correctLeftValue = Math.min(leftValue, rightValue);
                            const correctRightValue = Math.max(leftValue, rightValue);

                            if(correctLeftValue > minValue) catalogFiltersCollection.pricePerItemFrom = correctLeftValue;
                            if(correctRightValue < maxValue) catalogFiltersCollection.pricePerItemTo = correctRightValue;
                        } break;
                        case 'ct': {
                            // Подкатегории товаров
                            catalogFiltersCollection.catalogIds = [
                                ...catalogFiltersCollection.catalogIds, filterBody
                            ]
                        } break;
                        case 'sn': {
                            // Сезонность (осень, весна...)
                            if(filterBody.length >= 1) {
                                var code = filterBody.toLowerCase().substr(0, 1);
                                if(code.match(/[0-9a-f]/)) {
                                    catalogFiltersCollection.seasonsCodes = [
                                        ...catalogFiltersCollection.seasonsCodes, code
                                    ]
                                }
                            }
                        }
                    }
                }
            })
        }

        // console.warn("After analyze: ", catalogFiltersCollection);
        return catalogFiltersCollection;
    }

    //  -- Хэндлеры событий ----------------
    handleChangeItemsOnPage(itemsOnPage) {
        if(this.state.catalogFiltersCollection.itemsOnPage != itemsOnPage) {
            this.setStateFilters({itemsOnPage: {$set: itemsOnPage}});
        }
    }

    handleLoadMore() {
        if(!this.props.fetchCatalogProducts) {
            console.log("Infinity scroll: ", this.state.infinityScrollIndex);
            this.props.catalogLoadProducts({
                query: _.join(_.tail(this.props.location.pathname.substr(1).split('/')), '/'),
                page: this.state.infinityScrollIndex++
            });
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
                [_.findIndex(this.state.catalogFiltersCollection.catalogIds, x => x == nodeId), 1]
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
                [_.findIndex(this.state.catalogFiltersCollection.seasonsCodes, x => x == seasonCode), 1]
            ]}});
        }
    }

    handleSeasonsCodesReset() {
        this.setStateFilters({seasonsCodes: {$set: []}});
    }

    handlePriceReset() {
        this.setState({
            leftPrice: this.props.catalogInfo.minPrice,
            rightPrice: this.props.catalogInfo.maxPrice
        });
    }

    handleColorCodesSelectChange(colorCode, selected) {
        const index = _.findIndex(this.state.catalogFiltersCollection.colorCodes, x => x == colorCode);

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
        if(this.state.catalogFiltersCollection.sortById == id) {
            this.setStateFilters({sortByDesc: {$set: !this.state.catalogFiltersCollection.sortByDesc}});
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
                        <BreadCrumb nodes={this.props.catalogInfo.pathChain.nodes} />
                        <PageHeader title={this.props.catalogInfo.title}/>
                    </Grid.GridLine>
                    <Grid.Row>
                        <Grid.Container>
                            <Grid.Col lg={3} md={3} sm={16} xs={16}>
                                <FiltersContainer
                                    sortByItems={this.state.catalogFiltersCollection.sortByItems}
                                    sortBySelectedId={this.state.catalogFiltersCollection.sortById}
                                    sortByDesc={this.state.catalogFiltersCollection.sortByDesc}
                                    onSortByChange={this.handleSortByChange}>
                                        <Grid.VerticalGrid>
                                            {
                                                this.props.catalogInfo.subCategories &&
                                                this.props.catalogInfo.subCategories.length > 0 &&
                                                <CatalogList
                                                    productSubCategories={this.props.catalogInfo.subCategories}
                                                    selectedNodes={this.state.catalogFiltersCollection.catalogIds}
                                                    onSelectNode={this.handleSelectNode}
                                                    onReset={this.handleSelectNodeReset}/>
                                            }
                                            <PriceRange
                                                minValue={this.props.catalogInfo.listPrice.minListPrice}
                                                maxValue={this.props.catalogInfo.listPrice.maxListPrice}
                                                leftValue={this.state.catalogFiltersCollection.pricePerItemFrom}
                                                rightValue={this.state.catalogFiltersCollection.pricePerItemTo}
                                                onValueChange={this.handlePriceValueChange}
                                                onReset={this.handlePriceReset}/>
                                            <ColorPicker
                                                selectedColors={this.state.catalogFiltersCollection.colorCodes}
                                                avalibleColors={this.props.catalogInfo.getColorCodes()}
                                                onSelectChange={this.handleColorCodesSelectChange}
                                                onReset={this.handleColorCodesReset}/>
                                            <SeasonList
                                                seasonsCodes={this.props.catalogInfo.seasons}
                                                selectedSeasonsCodes={this.state.catalogFiltersCollection.seasonsCodes}
                                                onSelectChange={this.handleSeasonsCodesChange}
                                                onReset={this.handleSeasonsCodesReset}/>
                                            <RatingSelect
                                                rating={this.state.catalogFiltersCollection.rating}
                                                maxAverageRating={this.props.catalogInfo.rating.maxAverageRating}
                                                onRatingChange={this.handleRatingChange}
                                                onReset={this.handleRatingReset}/>
                                        </Grid.VerticalGrid>
                                </FiltersContainer>
                            </Grid.Col>
                            <Grid.Col lg={13} md={13} sm={16} xs={16}>
                                <Grid.VerticalGrid>
                                    <CatalogHeader
                                        title={this.props.catalogInfo.title}
                                        itemsOnPage={this.state.catalogFiltersCollection.itemsOnPage}
                                        itemsOnPageValues={this.state.catalogFiltersCollection.itemsOnPageValues}
                                        onItemsOnPageChange={this.handleChangeItemsOnPage}
                                        sortByItems={this.state.catalogFiltersCollection.sortByItems}
                                        sortBySelectedId={this.state.catalogFiltersCollection.sortById}
                                        sortByDesc={this.state.catalogFiltersCollection.sortByDesc}
                                        onSortByChange={this.handleSortByChange}/>
                                    <CatalogGrid
                                        catalogId={this.props.catalogInfo.productCategoryId}
                                        products={this.props.catalogProducts}
                                        loadMore={this.handleLoadMore}
                                        hasMore={this.props.catalogProductsHasMore}
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