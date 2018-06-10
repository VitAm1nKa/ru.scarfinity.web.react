import { Image } from './Image';

export class ImageGallery {
    constructor(props = {}) {
        this.id = props.id;
        this.images = _.map(props.images, (image, index) => new Image(image, index));

        this.chain = this.chain.bind(this);
        this.thumbnail = this.thumbnail.bind(this);
        this.getImageById = this.getImageById.bind(this);
    }

    get Count() {
        return this.images.length || 0;
    }

    chain(imageId) {
        // Получение информации о запрашиваемом изображении
        // Так же вовращение id предыдущего и следующего изображения
        const currentImage = _.find(this.images, i => i.id == imageId);
        if(currentImage != null) {
            const count = this.Count;
            const index = currentImage.index;
            return {
                image: currentImage,
                prevId: this.images[(index + count - 1) % count].id,
                nextId: this.images[(index + 1) % count].id
            }
        }

        return null;
    }

    thumbnail() {
        return (_.first(this.images) || new Image()).getPreview();
    }

    getImageById(imageId) {
        return _.find(this.images, i => i.id == imageId) || new Image();
    }

    getImage(index) {
        const image = this.images[index];
        if(image != null) {
            return image;
        }

        return new Image();
    }
}