import update               from 'immutability-helper';
import { ShoppingCart }     from '../models/ShoppingCart';
import { __shoppingCart }   from './api-requests';

export const actionCreators = {
    getShoppingCart: (createNewIsNull = false) => (dispatch, getState) => {
        if(!getState().shoppingCart.loading) {
            dispatch(__shoppingCart.Get())
                .then(response => response.json())
                .then(({ type, data }) => {
                    if(type == 'success') {
                        if(data == null && createNewIsNull) {
                            dispatch(actionCreators.postShoppingCart());
                        } else {
                            dispatch({ type: 'SHOPPINGCART__RECEIVE', shoppingCartData: data });
                        }
                    } else {
                        throw new Error(type);
                    }
                })
                .catch(e => {
                    dispatch({ type: 'SHOPPINGCART__RECEIVE__ERROR', error }); 
                });

            dispatch({type: 'SHOPPINGCART__REQUEST'});
        }
    },
    postShoppingCart: () => (dispatch, getState) => {
        dispatch(__shoppingCart.Post())
            .then(response => response.json())
            .then(({ type, data }) => {
                if(type == 'success') {
                    dispatch({ type: 'SHOPPINGCART__RECEIVE', shoppingCartData: data });
                } else {
                    throw new Error(type);
                }
            })
            .catch(error => { 
                dispatch({ type: 'SHOPPINGCART__RECEIVE__ERROR', error }); 
            });
        
        dispatch({ type: 'SHOPPINGCART__POST' });
    },
    setProductQty: (productId, quantity) => (dispatch, getState) => { 
        dispatch(__shoppingCart.Put(productId, quantity))
            .then(response => response.json())
            .then(({ type, data }) => {
                if(type == 'success') {
                    dispatch({ type: 'SHOPPINGCART__RECEIVE', shoppingCartData: data });
                } else {
                    throw new Error(type);
                }
            })
            .catch(error => {
                dispatch({ type: 'SHOPPINGCART__RECEIVE__ERROR', error }); 
            });

        dispatch({ type: 'SHOPPINGCART__SETPRODUCTQTY' });
    }
};

const initialState = {
    loading: false,
    shoppingCart: null,
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'SHOPPINGCART__REQUEST': return update(state, {loading: {$set: true}});
        case 'SHOPPINGCART__POST': return update(state, {loading: {$set: true}});
        case 'SHOPPINGCART__RECEIVE': {
            return update(state, {$merge: {
                loading: false,
                shoppingCart: action.shoppingCartData
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