import { fetch, addTask }   from 'domain-task';
import update               from 'immutability-helper';
import { __productModel }   from './api-requests';
import { ProductModel }     from '../models/ProductModel';

export const actionCreators = {
    getProductModel: (productModelNumber) => (dispatch, getState) => {
        __productModel.Get.Single(productModelNumber)(
            data => {
                dispatch({ type: 'PRODUCTMODEL_RECEIVE', data })
            },
            error => {
                dispatch({ type: 'PRODUCTMODEL_RECEIVE_ERROR', error })
            },
            true
        )

        dispatch({ type: 'PRODUCTMODEL_REQUEST' });
    }
};

const initialState = {
    loading: false,
    result: {
        success: false,
        error: "no error"
    },
    productModel: new ProductModel()
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
                }
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
        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}