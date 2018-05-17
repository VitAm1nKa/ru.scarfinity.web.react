import React                        from 'react';
import {Link, Redirect}             from 'react-router-dom'
import Measure                      from 'react-measure'

import ImageContainer               from '../utility/image-container';

import ChevronLeft                  from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight                 from 'material-ui/svg-icons/navigation/chevron-right';
import ExpandLess                   from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore                   from 'material-ui/svg-icons/navigation/expand-more';
import IconButton                   from 'material-ui/IconButton';

import { ProductImage }				from '../../store/__models';

const style = {
    button: {
        width: 24,
        height: 24,
        padding: 1,
    },
    iconStyle: {
        width: 22,
        height: 22,
    }
}

class ProductCardImageContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleItems: 5,
            selectedIndex: props.selectedIndex || 0,
            offset: 0,
        }
    }

    handleOffsetChange(value) {
        this.setState({
            offset: Math.min(Math.max(this.state.offset + value, 0), this.props.imageGallery.images.length - this.state.visibleItems),
        });
    }

    handleItemClick(index) {
        this.setState({
            selectedIndex: index - this.state.offset,
        });
    }

    componentWillReceiveProps(newProps) {
        if(this.props.colorCode != newProps.colorCode) {
            this.setState({
                selectedIndex: 0,
                offset: 0,
            });
        }
    }

    handleResize({bounds}) {
        const {width} = bounds;

        const visibleItems =
            width > 570 ? 8 :
            width > 480 ? 7 :          
            width > 400 ? 6 :
            width > 330 ? 5 :
            width > 250 ? 4 :
            width > 190 ? 3 : 2;
        
        if(this.state.visibleItems != visibleItems) {
            this.setState({
                visibleItems,
                offset: Math.min(Math.max(this.props.imageGallery.images.length - visibleItems, 0), this.state.offset),
                selectedIndex: Math.min(this.state.selectedIndex, visibleItems - 1),
            });
        }
    }

    render() {
        const currentImage = this.props.imageGallery.getImage(this.state.selectedIndex + this.state.offset);
        return(
            <div className="product-card-image-container">
                <div className="product-card-image-container__main">
                    <ImageContainer imageUrl={currentImage.getMain()} />
                </div>
                <div className="product-card-image-container__galery">
                    <div className="product-card__image-gallery-container">
                        <IconButton
                            className="product-card__image-gallery-container__button"
                            onClick={() => {this.handleOffsetChange(-1)}}
                            disabled={this.state.offset == 0}
                            style={style.button}
                            iconStyle={style.iconStyle}>
                                <ChevronLeft />
                        </IconButton>
                        <Measure
                            bounds
                            onResize={this.handleResize.bind(this)}>
                                {({measureRef, contentRect}) => {
                                    const {width, height} = contentRect.entry;
                                    return(
                                        <div
                                            className={`product-card__image-gallery count-${this.state.visibleItems}`}
                                            ref={measureRef}>
                                            <div className="product-card__image-gallery__body">
                                                <div
                                                    className={`product-card__image-gallery__container offset-${this.state.offset}`}>
                                                    {
                                                        _.map(this.props.imageGallery.images, (image, index) =>
                                                            <div
                                                                key={image.id}
                                                                className="product-card__image-gallery__container__item"
                                                                onClick={() => {this.handleItemClick(index)}}>
                                                                    <div className="product-card__image-gallery__container__item__body">
                                                                        <ImageContainer
                                                                            imageUrl={image.getPreview()} />
                                                                    </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div className={`product-card__image-gallery__slider pos-${this.state.visibleItems}${this.state.selectedIndex}`}></div>
                                        </div>
                                    )
                                }}
                        </Measure>
                        <IconButton
                            className="product-card__image-gallery-container__button"
                            disabled={this.state.offset >= this.props.imageGallery.images.length - this.state.visibleItems}
                            onClick={() => {this.handleOffsetChange(1)}}
                            style={style.button}
                            iconStyle={style.iconStyle}>
                                <ChevronRight />
                        </IconButton>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProductCardImageContainer;