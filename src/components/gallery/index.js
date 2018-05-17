import React            from 'react';
import { connect }      from 'react-redux';
import qs               from 'qs';
import { Route }        from 'react-router-dom';
import GalleryView      from '../utility/gallery-view';
import ImageGalleryView from '../utility/image-gallery-view';
import {
    actionCreators as ImageGalleryActions
}                       from '../../store/imageGallery';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            contentType: '',
            data: {}
        }

        this.navLinkLocation = this.navLinkLocation.bind(this);
        this.analyzePath = this.analyzePath.bind(this);
        this.content = this.content.bind(this);
    }

    componentDidMount() {
        this.analyzePath(this.props.location);
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props.location != nextProps.location, this.props.location, nextProps.location);
        if(this.props.location != nextProps.location) {
            this.analyzePath(nextProps.location);
        }
    }

    analyzePath(location) {
        console.warn(this.props);
        if(location != null) {
            // Галлерея открыта в том случае если в строке браузера есть ключевой символ - z,p
            // Тоесть в search локэйшна, должн быть параметр z для фото
            const search = qs.parse(location.search, { ignoreQueryPrefix: true });
            if(search.z != null) {
                // photo%2Fgallery
                const params = _.compact(_.split(search.z, '/', 2));
                if(params.length != 2) {
                    return this.setState({
                        open: false
                    })
                };

                const imageId = parseInt(params[0]);
                const imageGalleryId = parseInt(params[1]);

                // Загрузка(запрос на загрузку) галлереи изображений в стор
                // Если такая галерея уже загружена, то просто отобразить данные
                if(this.props.imageGallery.id != imageGalleryId) {
                    this.props.getImageGallery(imageGalleryId);
                }

                return this.setState({
                    open: true,
                    contentType: 'image-gallery',
                    data: {
                        'selected-image': imageId
                    }
                });
            }

            if(search.p != null) {
                // productModel%2Fproduct(cl)
                const params = _compact(_.split(search.p, '/', 2));
                if(params.length != 2) {
                    return this.setState({
                        open: false
                    })
                }

                const productModelId = parseInt(params[0]);
                const colorCode = parseInt(params[1]);

                // Загрузка информации о товаре в стор

                this.setState({
                    open: true,
                    contentType: 'product-model'
                });
            }
        }

        return this.setState({
            open: false
        })
    }

    navLinkLocation(searchParam) {
        return `${this.props.location.pathname}${qs.stringify(_.assign(qs.parse(this.props.location.search, { ignoreQueryPrefix: true }), searchParam), { addQueryPrefix: true })}`;
    }

    content() {
        if(this.state.open) {
            // В зависимости от того, какой content-type отобразить разные данные
            if(this.state.contentType == 'image-gallery') {
                return <ImageGalleryView
                    loading={this.props.imageGalleryFetch}
                    imageGallery={this.props.imageGallery}
                    selectedImageId={this.state.data['selected-image']}
                    navLinkLocation={this.navLinkLocation}/>
            }
        }

        return null;
    }

    render() {
        return(
            <GalleryView
                open={this.state.open}>
                    {this.content()}
            </GalleryView>
        )
    }
}

const ControllerWrap = connect(
    state => Object.assign({}, state.imageGallery),
    Object.assign({}, ImageGalleryActions)
)(Controller);

export default () => <Route path='/' component={ControllerWrap} />