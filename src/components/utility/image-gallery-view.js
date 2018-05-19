import React                from 'react';
import NavLink              from 'react-router-dom/NavLink';
import Measure              from 'react-measure';
import ImageGalleryLoader   from './image-gallery-loader';
import {
    ChevronLeft,
    ChevronRight
}                           from './icons';
import { ImageGallery }     from '../../store/__models';

import './image-gallery-view.less';

class ImageView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: false,
            image: { src: null, width: 0, height: 0 }
        }

        this.handleResize = this.handleResize.bind(this);
        this.generateImage = this.generateImage.bind(this);
        this.loadImage = this.loadImage.bind(this);
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleResize);
        this.loadImage(this.props.images, this.props.imageId);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.imageId != nextProps.imageId) {
            this.setState({
                loading: true,
                error: false
            })
        }

        this.loadImage(nextProps.images, nextProps.imageId);
    }

    shouldComponentUpdate(nextPros, nextState) {
        if(this.state != nextState) {
            return true;
        }

        return false;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    handleResize(contentRect) {
        this.forceUpdate();
    }

    generateImage(src) {
        if(src != null) {
            var image = new Image();
            image.onload = () => {
                const clientWidth = document.documentElement.clientWidth;
                const clientHeight = document.documentElement.clientHeight;
                const maxClientWidth = clientWidth * 0.94;
                const maxClientHeight = clientHeight * 0.895 - 34;
                const ratio = Math.min(maxClientWidth / image.width, maxClientHeight / image.height);
                this.setState({
                    loading: false,
                    error: false,
                    image: {
                        src: src,
                        width: image.width * ratio,
                        height: image.height * ratio
                    }
                });
            };
            image.src = src;
        } else {
            this.setState({
                loading: false,
                error: true,
                image: {
                    src: null,
                    width: 0,
                    height: 0
                }
            });
        }
    }

    loadImage(images, imageId) {
        const imageInfo = images[`${imageId}`];
        if(imageInfo != null) {
            if(imageInfo.fetch == true) {
                if(!this.state.loading) {
                    this.setState({ loading: true });
                }
            } else if(imageInfo.fetch == false) {
                if(this.image == null) {
                    this.generateImage(imageInfo.src);
                }
            }
        }
    }

    render() {
        return(
            <Measure
                bounds
                onResize={this.handleResize}>
                    {({measureRef}) => 
                        <div
                            ref={measureRef}
                            className="image-gallery-image">
                                <img
                                    src={this.state.image.src}
                                    style={{
                                        width: this.state.image.width,
                                        height: this.state.image.height
                                    }}/>
                        </div>
                    }
            </Measure>
        )
    }
}

class Controller extends React.Component {
    render() {
        if(this.props.loading == true) {
            return (<div>{"Loading..."}</div>);
        }

        // Обработка галлереи изображений
        // Необходимо знать: количество, порядковый номер, предыдущи и следующий id
        const chain = this.props.imageGallery.chain(this.props.selectedImageId);

        return(
            <div className="image-gallery-view">
                <div
                    className="image-gallery-view__body">
                        <ImageGalleryLoader imageGallery={this.props.imageGallery}>
                            <ImageView imageId={chain.image.id}/>
                        </ImageGalleryLoader>
                    <div
                        className="image-gallery-view__body__buttons">
                            <NavLink
                                to={this.props.navLinkLocation({z: `${chain.prevId}/${this.props.imageGallery.id}`})}
                                className="image-gallery-view__body__buttons__button prev">
                                    <ChevronLeft />
                            </NavLink>
                            <NavLink
                                to={this.props.navLinkLocation({z: `${chain.nextId}/${this.props.imageGallery.id}`})}
                                className="image-gallery-view__body__buttons__button next">
                                    <ChevronRight />
                            </NavLink>
                    </div>
                </div>
                <div 
                    className="image-gallery-view__footer">
                        <NavLink
                            to="/"
                            className="image-gallery-view__footer__title">
                                {`Галлерея: перд:${chain.prevId} след:${chain.nextId}`}
                        </NavLink>
                        <span
                            className="image-gallery-view__footer__counter">
                                {`Фото ${chain.image.index + 1} из ${this.props.imageGallery.Count}`}
                        </span>
                </div>
            </div>
        )
    } 
}

export default Controller;