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

class Controller extends React.Component {
    constructor(props) {
        super(props);

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

    //  -- Хэндлеры событий ----------------
    handleChangeItemsOnPage(itemsOnPage) {
        if(this.props.catalogPageFilters.itemsOnPage != itemsOnPage) {
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
                [_.findIndex(this.props.catalogPageFilters.catalogIds, x => x == nodeId), 1]
            ]}});
        }
    }

    handleSelectNodeReset() {
        this.props.onFilterSet({catalogIds: {$set: []}});
    }

    handleSeasonsCodesChange(seasonCode, selected) {
        if(!selected) {
            this.props.onFilterSet({seasonsCodes: {$set: this.props.catalogPageFilters.seasonsCodes | seasonCode}});
            console.error("TTTTTT", this.props.catalogPageFilters.seasonsCodes | seasonCode);
        } else {
            this.props.onFilterSet({seasonsCodes: {$set: this.props.catalogPageFilters.seasonsCodes & ~seasonCode}});
            console.error("EEEEEE", this.props.catalogPageFilters.seasonsCodes & ~seasonCode);
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
        const index = _.findIndex(this.props.catalogPageFilters.colorCodes, x => x == colorCode);

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
        if(this.props.catalogPageFilters.sortById == id) {
            this.props.onFilterSet({sortByDesc: {$set: !this.props.catalogPageFilters.sortByDesc}});
        } else {
            this.props.onFilterSet({$merge: {
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
                        <BreadCrumb nodes={this.props.catalogPage.pathChain.nodes} />
                        <PageHeader title={this.props.catalogPage.title}/>
                    </Grid.GridLine>
                    <Grid.Row>
                        <Grid.Container>
                            <Grid.Col lg={3} md={3} sm={16} xs={16}>
                                <FiltersContainer
                                    sortByItems={this.props.catalogPageFilters.sortByItems}
                                    sortBySelectedId={this.props.catalogPageFilters.sortById}
                                    sortByDesc={this.props.catalogPageFilters.sortByDesc}
                                    onSortByChange={this.handleSortByChange}>
                                        <Grid.VerticalGrid>
                                            {
                                                this.props.catalogPage.catalogPageInfo.catalogSubPages &&
                                                this.props.catalogPage.catalogPageInfo.catalogSubPages.length > 0 &&
                                                <CatalogList
                                                    productSubCategories={this.props.catalogPage.catalogPageInfo.catalogSubPages}
                                                    selectedNodes={this.props.catalogPageFilters.catalogIds}
                                                    onSelectNode={this.handleSelectNode}
                                                    onReset={this.handleSelectNodeReset}/>
                                            }
                                            <PriceRange
                                                minValue={this.props.catalogPage.catalogPageInfo.minListPrice}
                                                maxValue={this.props.catalogPage.catalogPageInfo.maxListPrice}
                                                leftValue={this.props.catalogPageFilters.pricePerItemFrom}
                                                rightValue={this.props.catalogPageFilters.pricePerItemTo}
                                                onValueChange={this.handlePriceValueChange}
                                                onReset={this.handlePriceReset}/>
                                            <ColorPicker
                                                selectedColors={this.props.catalogPageFilters.colorCodes}
                                                avalibleColors={this.props.catalogPage.catalogPageInfo.ColorCodes}
                                                onSelectChange={this.handleColorCodesSelectChange}
                                                onReset={this.handleColorCodesReset}/>
                                            <SeasonList
                                                seasons={this.props.catalogPage.catalogPageInfo.Seasons}
                                                selectedSeasonsCodes={this.props.catalogPageFilters.seasonsCodes}
                                                onSelectChange={this.handleSeasonsCodesChange}
                                                onReset={this.handleSeasonsCodesReset}/>
                                            <RatingSelect
                                                rating={this.props.catalogPageFilters.rating}
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
                                        itemsOnPage={this.props.catalogPageFilters.itemsOnPage}
                                        itemsOnPageValues={this.props.catalogPageFilters.itemsOnPageValues}
                                        onItemsOnPageChange={this.handleChangeItemsOnPage}
                                        sortByItems={this.props.catalogPageFilters.sortByItems}
                                        sortBySelectedId={this.props.catalogPageFilters.sortById}
                                        sortByDesc={this.props.catalogPageFilters.sortByDesc}
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
    }
}

export default Controller;