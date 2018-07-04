import update               from 'immutability-helper';
import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import qs                   from 'qs';

import { ShoppingCart }     from '../models/ShoppingCart';
import { __shoppingCart }   from './api-requests';

export const actionCreators = {
    getShoppingCart: (createNewIsNull = false) => (dispatch, getState) => {
        __shoppingCart.Get()(data => {
            if(data == null && createNewIsNull) {
                actionCreators.postShoppingCart()(dispatch, getState);
            } else {
                dispatch({ type: 'SHOPPINGCART__RECEIVE', shoppingCartData: data });
            }
        }, error => {});

        dispatch({type: 'SHOPPINGCART__REQUEST'});
    },
    postShoppingCart: () => (dispatch, getState) => {
        __shoppingCart.Post()(data => {
            dispatch({ type: 'SHOPPINGCART__RECEIVE', shoppingCartData: data });
        }, error => {});

        dispatch({ type: 'SHOPPINGCART__POST' });
    },
    setProductQty: (productId, quantity) => (dispatch, getState) => { 
        __shoppingCart.Put(productId, quantity)(data => {
            dispatch({ type: 'SHOPPINGCART__RECEIVE', shoppingCartData: data });
        }, error => {});

        dispatch({ type: 'SHOPPINGCART__SETPRODUCTQTY' });
    }
};

const initialState = {
    loading: false,
    shoppingCart: new ShoppingCart(),
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'SHOPPINGCART__REQUEST': return update(state, {loading: {$set: true}});
        case 'SHOPPINGCART__POST': return update(state, {loading: {$set: true}});
        case 'SHOPPINGCART__RECEIVE': {
            return update(state, {$merge: {
                loading: false,
                shoppingCart: new ShoppingCart(action.shoppingCartData || {})
            }});
        }
        // Фетч спосбов доставки
        case 'SHOPPINGCART__SHIPMETHODS__REQUEST': {
            return update(state, {$merge: {
                shipMethodsFetch: true,
                shipMethods: []
            }});
        }
        case 'SHOPPINGCART__SHIPMETHODS__RECEIVE': {
            return update(state, {$merge: {
                shipMethodsFetch: false,
                shipMethods: _.map(action.shipMethods, shipMethod => new ShipMethod(shipMethod))
            }});
        }
        case 'SHOPPINGCART__POSTSALESORDER': {
            return update(state, {$merge: {
                post: true,
                postError: false,
                postErrorCode: '',
                postErrorMessage: '',
                salesOrder: null
            }});
        }
        case 'SHOPPINGCART__POSTSALESORDER__SUCCESS': {
            return update(state, {$merge: {
                // Очистка инфо о корзине
                shoppingCart: new ShoppingCart(),
                post: false,
                postError: false,
                postErrorCode: '',
                postErrorMessage: '',
                salesOrder: action.salesOrder
            }})
        }
        case 'SHOPPINGCART__POSTSALESORDER__ERROR': {
            return update(state, {$merge: {
                post: false,
                postError: true,
                postErrorCode: action.error.type,
                postErrorMessage: action.error.message,
                salesOrder: null
            }})
        }
    }

    return state || initialState;
}