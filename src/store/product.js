import { fetch, addTask }   from 'domain-task';
import update               from 'immutability-helper';
import __request            from './__request';
import { 
    ProductModel, UserProductModelPreferences
}                           from './__models';

export const actionCreators = {
    getProductModel: (model) => (dispatch, getState) => {
        console.log("MODEL:", model);
        let fetchTask = __request({
            mehod: 'GET',
            url: `api/productModel/${model}`
        })
        .then(response => response.json())
        .then(({type, data}) => {
            console.log(data, type);
            if(type == 'success')
                dispatch({ type: 'RECEIVE_PRODUCT_MODEL', productData: data });
            else if(type == 'not_found') {
                dispatch({ type: 'RECEIVE_PRODUCT_MODEL_NOTFOUND' });
            }
        });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_PRODUCT_MODEL', model });
    },
    getProductModelTest: (productId) => (dispatch, getState) => {
        let request = __request({
            url: `api/values/product/${productId}`
        })
        .then(response => response.json())
        .then(({type, data}) => {
            dispatch({ type: "TEST__PRODUCT__RECEIVE", productData: data });
        });

        dispatch({ type: "TEST__PRODUCT__FETCH" });
    },
    setUserProductModelPreferences: (inFavorite = false, inWish = false) => (dispatch, getState) => {
        var userProductModelPreferences = getState().product.productData.userProductModelPreferences;

        let request = __request({
            url: `api/userProductModelPreferences`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productModelId: userProductModelPreferences.productModelId,
                inFavorite: inFavorite ? !userProductModelPreferences.inFavorite : userProductModelPreferences.inFavorite,
                inWish: inWish ? !userProductModelPreferences.inWish : userProductModelPreferences.inWish
            })
        })
        .then(response => response.json())
        .then(({type, data}) => {
            dispatch({ type: "PRODUCTMODEL__PRFERENCES__SET", userProductModelPreferences: data });
        });
    }
};

//  ----------------
//  REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const initialState = {
    productData: new ProductModel(),
    fetchProduct: false
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case "TEST__PRODUCT__FETCH":
            return update(state, {$merge: {
                fetchProduct: true,
                productData: {$merge: {id: null}}
            }});
        case "TEST__PRODUCT__RECEIVE": 
            return update(state, {$merge: {
                productData: action.productData,
                fetchProduct: false
            }});
        case "REQUEST_PRODUCT_MODEL": {
            return update(state, {$merge: {
                fetchProduct: true
            }});}
        case "RECEIVE_PRODUCT_MODEL":
            return update(state, {$merge: {
                fetchProduct: false,
                productData: new ProductModel(action.productData)
            }});
        case "RECEIVE_PRODUCT_MODEL_NOTFOUND":
            return update(state, {$set: {
                fetchProduct: false,
                productData: null
            }})
        case 'PRODUCTMODEL__PRFERENCES__SET': {
            return update(state, {productData: {userProductModelPreferences: {$set: new UserProductModelPreferences(action.userProductModelPreferences)}}})
        }
        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}