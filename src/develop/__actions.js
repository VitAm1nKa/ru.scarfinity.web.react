import __request from '../store/__request';

export const ProductModelActions = {
    all: (callback) => {
        let fetchTask =
            __request({
                method: 'GET',
                url: `api/productModel`
            })
            .then(response => response.json())
            .then(callback);
    },
    get: (prductModelId, callback) => {
        let fetchTask =
            __request({
                method: 'GET',
                url: `api/productModel/${prductModelId}`
            })
            .then(response => response.json())
            .then(callback);
    },
    post: (productModel, callback) => {
        let fetchTask =
            __request({
                method: 'POST',
                url: `api/productModel`,
                body: productModel
            })
            .then(response => response.json())
            .then(callback);
        
        // addTask(fetchTask);
    },
    saveOrCreate: (modelData, products, complete, error) => {
    }
};

export const ProductActions = {
    post: (product, callback) => {
        let fetchTask =
            __request({
                method: 'POST',
                url: `api/product`,
                body: product
            })
            .then(response => response.json())
            .then(callback);
        
        // addTask(fetchTask);
    }
};

export const ImageGalleryActions = {
    post: (imageGallery, imageGalleryId, callback) => {
        let fetchTask =
            __request({
                method: 'POST',
                url: `api/imageGallery/?id=${imageGalleryId || 0}`,
                bodyType: 'form',
                body: imageGallery
            })
            .then(response => response.json())
            .then(callback);
        
        // addTask(fetchTask);
    }
};