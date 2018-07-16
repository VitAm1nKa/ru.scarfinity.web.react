import update               from 'immutability-helper';
import { 
    __productModel,
    __relatedProductModel, 
    makeRequest
}                           from './api-requests';
import { addTask } from 'domain-task';

export const actionCreators = {
    getProductModel: (productModelId, onSucess, onError) => (dispatch, getState) => {
        if(productModelId !== getState().productModel.productModelId) {
            __productModel.Get.Single(productModelId)(
                data => {
                    dispatch({ type: 'PRODUCTMODEL_RECEIVE', data });
                    if(onSucess) onSucess(data);
                },
                error => {
                    dispatch({ type: 'PRODUCTMODEL_RECEIVE_ERROR', error });
                    if(onError) onError(error);
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

export const productModelActionCreators = {
    getProductModel: (productModelId, onSucess, onError) => (dispatch, getState) => {
        if(productModelId !== getState().productModel.productModelId) {
            let fetchTask = dispatch(__productModel.Get.Single(productModelId))
                .then(response => response.json())
                .then(({type, data}) => {
                    if(type == 'success') {
                        dispatch({ type: 'PRODUCTMODEL_RECEIVE', data });
                        if(onSucess) onSucess(data);
                    } else {
                        throw new Error('error');
                    }
                })
                .catch(error => {
                    dispatch({ type: 'PRODUCTMODEL_RECEIVE_ERROR', error });
                    if(onError) onError();
                });

            addTask(fetchTask);
            dispatch({ type: 'PRODUCTMODEL_REQUEST', productModelId });
        }
    }
}

const initialState = {
    loading: false,
    result: {
        success: false,
        error: "no error"
    },

    productModelId: null,
    productModelFetch: false,
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
                productModelFetch: true,
                result: {
                    success: false,
                    error: ''
                },
                productModelId: action.productModelId
            }});
        }
        case 'PRODUCTMODEL_RECEIVE': {
            return update(state, {$merge: {
                productModelFetch: false,
                result: {
                    success: true,
                    error: ''
                },
                productModel: action.data
            }});
        } 
        case 'PRODUCTMODEL_RECEIVE_ERROR': {
            return update(state, {$merge: {
                productModelFetch: false,
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