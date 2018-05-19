import React                from 'react';
import Measure              from 'react-measure';

import CatalogProductCard   from './catalog-product-card';
import * as Grid            from '../../lib/grid';
import ArrowForward         from 'material-ui/svg-icons/navigation/arrow-forward';
import ArrowBack            from 'material-ui/svg-icons/navigation/arrow-back';

import './product-row.less';

var iconStyle = {
    width: 20,
    height: 20,
}

const CatalogSectionHeader = (props) => {
    return(
        <div className="catalog-section-header">
            <div 
                className={`catalog-section-header__button ${props.leftToggle ? "catalog-section-header__button--disabled" : ""}`}
                onClick={() => {if(!props.leftToggle) props.onLeftClick()}}>
                    <ArrowBack style={iconStyle} />
            </div>
            <div className="catalog-section-header__spacer"></div>
            <div className="catalog-section-header__title">{props.title}</div>
            <div className="catalog-section-header__spacer"></div>
            <div 
                className={`catalog-section-header__button ${props.rightToggle ? "catalog-section-header__button--disabled" : ""}`}
                onClick={() => {if(!props.rightToggle) props.onRightClick()}}>
                    <ArrowForward style={iconStyle} />
            </div>
        </div>
    )
}

const View = (props) => {
    const items = _.map(props.products, (product) =>
        <div 
            key={product.productModelId}
            className="catalog-section-products__container__item">
                <CatalogProductCard
                    {...product}
                    onCartAdd={props.handleCartAdd}/>
        </div>
    )

    const itemWidth = Math.round(props.width / props.itemsCount);
    const containerWidth = itemWidth * props.products.length;
    const containerOffset = itemWidth * props.offset;

    return(
        <div 
            className="catalog-section-products"
            ref={props.measureRef}>
                <div 
                    className="catalog-section-products__container"
                    style={{
                        transform: `translate3d(-${containerOffset}px, 0, 0)`,
                        width: `${containerWidth}px`
                    }}>
                        {items}
                </div>
        </div>
    )
}

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            items: 0
        }

        this.itemsCount = () => (this.props.products || []).length;

        this.handleLeftClick = this.handleLeftClick.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentWillMount() {
        
    }

    handleLeftClick() {
        this.setState({
            offset: this.state.offset - 1
        })
    }

    handleRightClick() {
        this.setState({
            offset: this.state.offset + 1
        })
    }

    handleResize({bounds}) {
        const width = bounds.width;
        const minWidth = this.props.minWidth;
        const items = Math.floor(width / minWidth);
        if(this.state.items != items) {
            this.setState({
                items,
                offset: Math.min(Math.max(this.itemsCount() - items, 0), this.state.offset)
            });
        }
    }

    render() {
        return(
            <div className="catalog-section">
                <CatalogSectionHeader
                    title={this.props.title}
                    leftToggle={this.state.offset == 0}
                    rightToggle={this.state.offset >= this.itemsCount() - this.state.items}
                    onLeftClick={this.handleLeftClick}
                    onRightClick={this.handleRightClick}/>
                <Measure
                    bounds
                    onResize={this.handleResize}>
                        {({measureRef, contentRect}) => 
                            <View
                                width={contentRect.bounds.width}
                                measureRef={measureRef}
                                offset={this.state.offset}
                                products={this.props.products || []}
                                itemsCount={this.state.items}/>
                        }
                </Measure>
            </div>
        )
    }
}
Controller.defaultProps = {
    minWidth: 175
}

export default Controller;