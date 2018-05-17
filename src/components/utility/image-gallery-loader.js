import React            from 'react';
import update           from 'immutability-helper';
import { fetchImage }   from '../../store/__request';

class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            images: {}
        }

        this.galleryLoad = this.galleryLoad.bind(this);
    }

    galleryLoad(imageGallery) {
        // this.state.images = _.map(imageGallery.images, (image, index) => {
        //     let img = new Image();
        //     img.onload = event => {
        //         this.setState({
        //             images: update(this.state.images, {[index]: {$merge: {
        //                 fetch: false,
        //                 error: false,
        //                 image: img
        //             }}})
        //         });
        //     }

        //     return {
        //         id: image.id,
        //         src: {
        //             preview: image.preview,
        //             main: image.main
        //         },
        //         fetch: true,
        //         error: false,
        //         image: img
        //     }
        // });

        // Загрузка изображений
        _.forEach(imageGallery.images, image => {
            // Добавление информации об фото в коллекцию
            // Содание изображения, в которое будет грузиться инфо
            this.state.images = update(this.state.images, {[`${image.id}`]: {$set: {
                src: null,
                fetch: true,
                error: false,
            }}});

            // Загрузка изображения
            fetchImage(image.main, {
                success: src => {
                    this.setState({
                        images: update(this.state.images, {[`${image.id}`]: {$merge: {
                            src: src,
                            fetch: false
                        }}})
                    })
                },
                error: e => {
                    this.setState({
                        images: update(this.state.images, {[`${image.id}`]: {$merge: {
                            fetch: false,
                            error: true,
                        }}})
                    });
                }
            });
        });

        this.forceUpdate();
    }

    componentWillMount() {
        // При первом маунте компонента, проверить передана ли на фход галерея
        // Если да, то начать грузить галерею
        if(this.props.imageGallery != null) {
            this.galleryLoad(this.props.imageGallery);
        }
    }

    componentWillReceiveProps(nextProps) {
        // Проверить, пришла ли на вход новая галерея
        if(this.props.imageGallery != nextProps.imageGallery) {
            // Прекратить загрузку старой, и на чать загрузку новой галереи
            this.galleryLoad(nextProps.imageGallery);
        }
    }
    
    render() {
        return(
            <div>
                {
                    React.Children.map(this.props.children, child => 
                        React.cloneElement(child, Object.assign({}, this.props, {images: this.state.images}))
                    )
                }
            </div>
        )
    }
}

export default Controller;