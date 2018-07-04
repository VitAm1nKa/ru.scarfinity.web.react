import { fetch, addTask }   from 'domain-task';
import update               from 'immutability-helper';
import { 
    __productModel,
    __relatedProductModel 
}                           from './api-requests';
import { ProductModel }     from '../models/ProductModel';

export const actionCreators = {
    getProductModel: (productModelId, callback) => (dispatch, getState) => {
        if(productModelId !== getState().productModel.productModelId) {
            __productModel.Get.Single(productModelId)(
                data => {
                    dispatch({ type: 'PRODUCTMODEL_RECEIVE', data });
                    if(callback) callback(data, dispatch);
                },
                error => {
                    dispatch({ type: 'PRODUCTMODEL_RECEIVE_ERROR', error })
                }
            )

            dispatch({ type: 'PRODUCTMODEL_REQUEST', productModelId });
        }
    },
    getRelatedProductModels: (productModelId) => (dispatch, getState) => {
        if(productModelId !== getState().productModel.relatedProductModelsForId) {
            __relatedProductModel.Get(productModelId)(
                data => {
                    dispatch({ type: 'PRODUCTMODEL_RELATED_RECEIVE', data });
                },
                error => {
                    dispatch({ type: 'PRODUCTMODEL_RELATED_ERROR', error });
                }
            )

            dispatch({ type: 'PRODUCTMODEL_RELATED_REQUEST', relatedProductModelsForId: productModelId });
        }
    }
};

const initialState = {
    loading: false,
    result: {
        success: false,
        error: "no error"
    },

    productModelId: null,
    productModel: null,

    relatedProductModelsFetch: false,
    relatedProductModelsForId: null,
    relatedProductModels: null
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'PRODUCTMODEL_REQUEST': {
            return update(state, {$merge: {
                loading: true,
                result: {
                    success: false,
                    error: ''
                },
                productModelId: action.productModelId
            }});
        }
        case 'PRODUCTMODEL_RECEIVE': {
            return update(state, {$merge: {
                loading: false,
                result: {
                    success: true,
                    error: ''
                },
                productModel: new ProductModel(action.data)
            }});
        } 
        case 'PRODUCTMODEL_RECEIVE_ERROR': {
            return update(state, {$merge: {
                loading: false,
                result: {
                    success: false,
                    error: action.error
                }
            }});
        } 
        case 'PRODUCTMODEL_RELATED_REQUEST': {
            return update(state, {$merge: {
                relatedProductModelsFetch: true,
                relatedProductModelsForId: action.relatedProductModelsForId
            }});
        }
        case 'PRODUCTMODEL_RELATED_RECEIVE': {
            return update(state, {$merge: {
                relatedProductModelsFetch: false,
                relatedProductModels: action.data
            }})
        }
        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}