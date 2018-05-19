import React                    from 'react';
import Measure                  from 'react-measure';

import CatalogProductCard       from './catalog-product-card';
import * as Grid                from '../../lib/grid';
import ChevronLeft              from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight             from 'material-ui/svg-icons/navigation/chevron-right';
import ExpandLess               from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore               from 'material-ui/svg-icons/navigation/expand-more';
import IconButton               from 'material-ui/IconButton';

import './item-row.less';

var iconStyle = {
    width: 20,
    height: 20,
}

const style = {
    button: {
        width: 26,
        height: 26,
        padding: 3,
    }
}

const View = (props) => {
    const items = _.map(props.items, (item, index) =>
        <div 
            key={index}
            className="item-row-content__container__item">
                {item}
        </div>
    )

    const itemWidth = Math.round(props.width / props.itemsCount);
    const containerWidth = itemWidth * items.length;
    const containerOffset = itemWidth * props.offset;

    return(
        <div 
            className="item-row-content"
            ref={props.measureRef}>
                <div 
                    className="item-row-content__container"
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

        this.itemsCount = () => (this.props.items || []).length;

        this.handleLeftClick = this.handleLeftClick.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentWillMount() {
        
    }

    handleLeftClick(callback) {
        this.setState({
            offset: this.state.offset - 1
        });
    }

    handleRightClick() {
        this.setState({
            offset: this.state.offset + 1
        });
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
            <div className="item-row">
                <IconButton 
                    style={style.button}
                    disabled={this.state.offset == 0}
                    onClick={this.handleLeftClick}>
                        <ChevronLeft />
                </IconButton>
                <Measure
                    bounds
                    onResize={this.handleResize}>
                        {({measureRef, contentRect}) => 
                            <View
                                width={contentRect.bounds.width}
                                measureRef={measureRef}
                                offset={this.state.offset}
                                items={this.props.items || []}
                                itemsCount={this.state.items}/>
                        }
                </Measure>
                <IconButton 
                    style={style.button}
                    disabled={this.state.offset >= this.itemsCount() - this.state.items}
                    onClick={this.handleRightClick}>
                        <ChevronRight />
                </IconButton>
            </div>
        )
    }
}
Controller.defaultProps = {
    minWidth: 170
}

export default Controller;