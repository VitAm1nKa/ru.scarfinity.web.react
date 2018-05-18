import React                    from 'react';
import { NavLink }              from 'react-router-dom';

import FlatButton               from 'material-ui/FlatButton';
import Paper                    from 'material-ui/Paper';
import ChevronLeft              from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight             from 'material-ui/svg-icons/navigation/chevron-right';
import ExpandLess               from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore               from 'material-ui/svg-icons/navigation/expand-more';
import IconButton               from 'material-ui/IconButton';
import ImageContainer           from './image-container';

import './recenly-viewed.less';

const style = {
    button: {
        width: 26,
        height: 30,
        padding: 3,
    }
}

const RecenlyViewedItem = (props) => {
    return(
        <NavLink
            to={props.path()} 
            className="recenly-viewed-item">
                <ImageContainer
                    imageUrl={props.image.getPreview()}/>
        </NavLink>
    )
}

const RecenlyViewed = (props) => {
    const itemWidth = 100 / props.items.length;
    const offset = props.offset * itemWidth;
    return(
        <div 
            className="ricenly-viewed-grid"
            ref={props.gridRef}
            style={{paddingTop: `${100 / props.maxVisibleItems}%`}}>
                <div 
                    className="ricenly-viewed-grid__container"
                    style={{
                        top: 0,
                        bottom: 0,
                        width: `${props.items.length / props.maxVisibleItems * 100}%`,
                        transform: `translate3d(${offset > 0 ? -offset : Math.abs(offset)}%, 0,0)`,
                    }}>
                        {
                            _.map(props.items, item => {
                                return(
                                    <div 
                                        key={item.id} 
                                        style={{width: `${itemWidth}%`}}>
                                            <RecenlyViewedItem {...item} />
                                        </div>
                                )
                            })
                        }
                </div>
        </div>
    )
}
RecenlyViewed.defaultProps = {
    items: [],
    maxVisibleItems: 1,
    offset: 0,
    gridRef: null,
}

const RecenlyViewedVertical = (props) => {
    const itemHeight = 100 / props.items.length;
    const offset = props.offset * itemHeight;
    return(
        <div 
            className="recenly-viewed-grid-vertical"
            ref={props.gridRef}
            style={{width: `100%`}}>
            <div 
                className="recenly-viewed-grid-vertical__container"
                style={{
                    top: 0,
                    bottom: 0,
                    width: `${props.itemSize}px`,
                    height: `${props.items.length * props.itemSize}px`,
                    transform: `translate3d(0, ${offset > 0 ? -offset : Math.abs(offset)}%,0)`,
                }}>
                    {
                        props.items.map((value, index) => 
                            <div 
                                key={index}
                                onClick={() => props.onItemClick(index - props.offset)}
                                style={{width: `${props.itemSize}px`, height: `${props.itemSize}px`}}>
                                    <RecenlyViewedItem/>
                                </div>
                        )
                    }
                </div>
                <div 
                    className="recenly-viewed-grid-vertical__select-block"
                    style={{
                        width: `${props.itemSize - 10}px`,
                        height: `${props.itemSize - 10}px`,
                        top: 5,
                        transform: `translate3d(0px, ${props.itemSize * props.selectedIndex}px, 0px)`,
                    }}
                ></div>
        </div>
    )
}
RecenlyViewedVertical.defaultProps = {
    itemSize: 0,
    selectedIndex: 0,
    items: ["", "", "", ""],
    maxVisibleItems: 1,
    offset: 0,
    gridRef: null,
    onItemClick: () => {},
}

export const RecenlyViewedBlock = (props) => {
    return(
        <Paper zDepth={1} style={{overflow: "auto", margin: "15px 0px"}}>
            <div className="recenly-viewed">
                <div className="recenly-viewed__head">
                    <span className="recenly-viewed-title">{props.title}</span>
                    <span className="recenly-viewed-more">{props.moreTitle}</span>
                </div>
                <RecenlyViewedGrid
                    items={props.items}/>
            </div>
        </Paper>
    )
}
RecenlyViewedBlock.defaultProps = {
    title: "Недавно просмотренные",
    moreTitle: "Посмотреть все",
}

export const ProductBlock = (props) => {
    return(
        <div className="product-block">
            <ProductBlockGrid />
            <div className="product-block__right">
                <Utility__ImageContainer />
            </div>
        </div>
    )
}
ProductBlock.defaultProps = {
    title: "Недавно просмотренные",
    moreTitle: "Посмотреть все",
}

class ProductBlockGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            leftToggle: false,
            rightToggle: false,
            offset: 0,
        }

        this.handleOffsetChange = this.handleOffsetChange.bind(this);
    }

    handleOffsetChange(data) {
        this.setState({
            leftToggle: !data.leftToggle,
            rightToggle: !data.rightToggle,
        });
    }

    render() {
        return(
            <div className="product-block__left">
                <IconButton 
                    className="product-block__left__button"
                    style={style.button}
                    disabled={this.state.leftToggle}
                    onClick={() => {this.grid.move(-1)}}>
                        <ExpandLess />
                </IconButton>
                <div className="product-block__left__grid">
                    <PreviewItemGridVertical onChange={this.handleOffsetChange} ref={grid => this.grid = grid} />
                </div>
                <IconButton 
                    className="product-block__left__button"
                    style={style.button}
                    disabled={this.state.rightToggle}
                    onClick={() => {this.grid.move()}}>
                        <ExpandMore />
                </IconButton>
            </div>
        )
    }
}

class RecenlyViewedGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            leftToggle: false,
            rightToggle: false,
            offset: 0,
        }

        this.handleOffsetChange = this.handleOffsetChange.bind(this);
    }

    handleOffsetChange(data) {
        this.setState({
            leftToggle: !data.leftToggle,
            rightToggle: !data.rightToggle,
        });
    }

    render() {
        return(
            <div className="recenly-viewed-grid-container">
                <IconButton 
                    className="recenly-viewed-grid-container__button"
                    style={style.button}
                    disabled={this.state.leftToggle}
                    onClick={() => {this.grid.move(-1)}}>
                        <ChevronLeft />
                </IconButton>
                <div className="recenly-viewed-grid-container__grid">
                    <PreviewItemGridHorisontal
                        onChange={this.handleOffsetChange}
                        ref={grid => this.grid = grid}
                        items={this.props.items}/>
                </div>
                <IconButton
                    className="recenly-viewed-grid-container__button"
                    style={style.button}
                    disabled={this.state.rightToggle}
                    onClick={() => {this.grid.move()}}>
                        <ChevronRight />
                </IconButton>
            </div>
        )
    }
}
RecenlyViewedGrid.defaultProps = {
    isLeftToggle: false,
    isRightToggle: false,
}

class RecenlyViewed__Shell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            itemsCount: 0,
            itemsCountV: 0,
            itemWidthV: 0,
            minItemHeight: 100,
            minItemWidth: 100,
            items: Array.apply(null, Array(9)).map(() => ""),
            offset: 0,
        }

        this.clientWidth = () => this.grid.getBoundingClientRect().width;
        this.clientHeight = () => this.grid1.getBoundingClientRect().height;

        this.handleResize = this.handleResize.bind(this);
        this.recalcItemsCount = this.recalcItemsCount.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.recalcItemsCount(this.clientWidth(), this.clientHeight());
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        this.recalcItemsCount(this.clientWidth(), this.clientHeight());
    }

    recalcItemsCount(width, height) {
        const minHeight = this.state.minItemHeight;
        const itemsCount = Math.floor(width / minHeight);
        const countDiff = this.state.items.length - itemsCount;


        const itemsCountV = Math.floor(height / this.state.minItemWidth);
        const countDiffV = this.state.items.length - itemsCountV;

        if(itemsCount !== this.state.itemsCount) {
            this.setState({
                itemsCount: Math.floor(width / minHeight),
                offset: this.state.offset > countDiff ? Math.max(countDiff, 0) : this.state.offset,
            });
        }

        console.log(height, itemsCountV, height / itemsCountV);

        this.setState({
                itemsCountV: itemsCountV,
                itemWidthV: height / itemsCountV,
                offset: this.state.offset > countDiffV ? Math.max(countDiffV, 0) : this.state.offset,
            }, () => console.log(this.state.itemWidthV, "123123123"));
    }

    handleClick(side) {
        let {offset, items, itemsCount} = this.state;

        if(side == "right") {
            if(offset < items.length - itemsCount) {
                this.setState({offset: offset + 1});
            }
        } else {
            if(offset > 0) {
                this.setState({offset: offset - 1});
            }
        }
    }


    render() {

        return(
            <section>
                <div>
                    <RecenlyViewed
                        gridRef={grid => this.grid = grid}
                        items={this.state.items}
                        maxVisibleItems={this.state.itemsCount}
                        offset={this.state.offset}/>
                    <FlatButton label="Left" secondary={true} onClick={() => this.handleClick("left")}/>
                    <FlatButton label="Right" secondary={true} onClick={() => this.handleClick("right")}/>
                    {/* <div className="ttt123">
                        <RecenlyViewedV
                            gridRef={grid => this.grid1 = grid}
                            items={this.state.items}
                            maxVisibleItems={this.state.itemsCountV}
                            itemWidth={this.state.itemWidthV}
                            offset={this.state.offset}/>
                    </div>  */}
                </div>
                <div className="grid-grid">
                    <div className="grid-grid__l" ref={grid => this.grid1 = grid}>
                        <RecenlyViewedVertical
                            items={this.state.items}
                            maxVisibleItems={this.state.itemsCountV}
                            itemWidth={this.state.itemWidthV}
                            offset={this.state.offset}/>
                    </div>
                    <div className="grid-grid__r">
                        <div className="rect"></div>
                    </div>
                </div>
            </section>
        )
    }
}

class PreviewItemGridHorisontal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            itemsCount: 1,
            minItemHeight: 100,
            offset: 0,
        }

        this.onChange = props.onChange;

        this.clientWidth = () => this.grid.getBoundingClientRect().width;

        this.handleResize = this.handleResize.bind(this);
        this.recalcItemsCount = this.recalcItemsCount.bind(this);
        this.doOnChange = this.doOnChange.bind(this);
        this.move = this.move.bind(this);
    }
    
    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.recalcItemsCount(this.clientWidth(), true);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        this.recalcItemsCount(this.clientWidth());
    }

    move(direction = 1) {
        const newOffset = this.state.offset + direction;
        const countDiff = Math.max(this.props.items.length - this.state.itemsCount, 0);
        this.setState({offset: newOffset > countDiff ? countDiff : newOffset}, this.doOnChange);
    }

    recalcItemsCount(width, update = true) {
        const minHeight = this.state.minItemHeight;
        const itemsCount = Math.floor(width / minHeight);
        const countDiff = this.props.items.length - itemsCount;

        this.state.itemsCount = Math.floor(width / minHeight);
        this.state.offset = this.state.offset > countDiff ? Math.max(countDiff, 0) : this.state.offset;

        if(update) this.forceUpdate(this.doOnChange);
    }

    doOnChange() {
        const offset = this.state.offset;
        const leftToggle = this.state.offset > 0;
        const rightToggle = offset + this.state.itemsCount < this.props.items.length;
        this.onChange({leftToggle, rightToggle, offset});
    }

    render() {
        return(
            <RecenlyViewed
                gridRef={grid => this.grid = grid}
                items={this.props.items}
                maxVisibleItems={this.state.itemsCount}
                offset={this.state.offset}/>
        )
    }
}
PreviewItemGridHorisontal.defaultProps = {
    onChange: () => {},
    items: []
}

export class PreviewItemGridVertical extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            itemsCount: 5,
            itemBasis: 100,
            itemSize: 0,
            items: Array.apply(null, Array(9)).map(() => ""),
            offset: 0,
            selectedIndex: 0,
        }

        this.onChange = props.onChange;

        this.clientBounds = () => this.grid.getBoundingClientRect();

        this.handleResize = this.handleResize.bind(this);
        this.recalcItemsCount = this.recalcItemsCount.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.doOnChange = this.doOnChange.bind(this);
        this.move = this.move.bind(this);
    }
    
    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.recalcItemsCount(this.clientBounds());
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        this.recalcItemsCount(this.clientBounds());
    }

    handleItemClick(selectedIndex) {
        this.setState({selectedIndex});
    }

    move(direction = 1) {
        const newOffset = this.state.offset + direction;
        const countDiff = Math.max(this.state.items.length - this.state.itemsCount, 0);
        this.setState({offset: newOffset > countDiff ? countDiff : newOffset}, this.doOnChange);
    }

    doOnChange() {
        const offset = this.state.offset;
        const leftToggle = this.state.offset > 0;
        const rightToggle = offset + this.state.itemsCount < this.state.items.length;
        this.onChange({leftToggle, rightToggle, offset});
    }

    recalcItemsCount(bounds, update = true) {
        const itemSize = Math.round(Math.min(bounds.height / 5, bounds.width));

        const countDiff = this.state.items.length - 5;
        this.state.itemsCount = 5;
        this.state.itemSize = itemSize,
        this.state.offset = this.state.offset > countDiff ? Math.max(countDiff, 0) : this.state.offset;

        if(update) this.forceUpdate(this.doOnChange);
    }

    render() {
        return(
            <RecenlyViewedVertical
                gridRef={grid => this.grid = grid}
                items={this.state.items}
                itemSize={this.state.itemSize}
                maxVisibleItems={this.state.itemsCount}
                offset={this.state.offset}
                selectedIndex={this.state.selectedIndex}
                onItemClick={this.handleItemClick}/>
        )
    }
}
PreviewItemGridVertical.defaultProps = {
    onChange: () => {},
}


export default RecenlyViewed__Shell;