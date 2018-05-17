import update               from 'immutability-helper';
import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import qs                   from 'qs';

import {
    ShoppingCart,
    SalesOrder,
    ShipMethod
}                           from './__models';

export const actionCreators = {
    getShoppingCart: () => (dispatch, getState) => {
        const request = 
            __request({url: 'api/shoppingCart'})
            .then((response) => response.json())
            .then(({type, data}) => {
                if(type == 'success') {
                    dispatch({ type: 'SHOPPINGCART__RECEIVE', shoppingCartData: data });
                }
            })

        addTask(request);
        dispatch({type: 'SHOPPINGCART__REQUEST'});
    },
    setProductQty: (productId, quantity) => (dispatch, getState) => { 
        const request = 
            __request({
                url: 'api/shoppingCart',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({productId, quantity})
            })
            .then((response) => response.json())
            .then(({type, message, data}) => {
                if(type == 'success') {
                    dispatch({ type: 'SHOPPINGCART__RECEIVE', shoppingCartData: data });
                }
            });

        dispatch({ type: 'SHOPPINGCART__SETPRODUCTQTY' });
    },
    getShipMethods: () => (dispatch, getState) => {
        const request = 
            __request({url: 'api/shipMethods'})
            .then((response) => response.json())
            .then(({type, data}) => {
                if(type == 'success') {
                    dispatch({ type: 'SHOPPINGCART__SHIPMETHODS__RECEIVE', shipMethods: data.shipMethods });
                }
            })

        addTask(request);
        dispatch({type: 'SHOPPINGCART__SHIPMETHODS__REQUEST'});
    },
    postSalesOrder: (salesOrderPost) => (dispatch, getState) => {
        // самый важный метод на всем сайте
        // подойти с максимальной ответсвенностью
        const request = 
            __request({
                url: 'api/salesOrder',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(salesOrderPost)
            })
            .then((response) => response.json())
            .then(({type, message, data}) => {
                switch(type) {
                    case 'success': {
                        // В случае успешного проведения заказа, в ответ получаем информацию о вновь созданом заказе
                        dispatch({ type: 'SHOPPINGCART__POSTSALESORDER__SUCCESS', salesOrder: data });

                        // Так же следует, обновить информацию о корзине.
                        // На стороне сервера, она очищается после размещения заказа
                        // После диспатча события о успешном размещении заказа, локальный стейте Redux очищает инфо о корзине
                        // И делается запрос на сервер, за обновленной информацией
                        actionCreators.getShoppingCart()(dispatch, getState);
                    } break;
                    default: {
                        // В случае, неудачного размещения зака, обрабоать все ошибки
                        // Данная реализация упрощена, и все ошибки обрабатываются одним диспатчем
                        // За анализ ошибки отвечает компонент, которыйй и отоброжает инфо об ошибках
                        dispatch({ type: 'SHOPPINGCART__POSTSALESORDER__ERROR', error: { type, message} });
                    }
                        
                }
            })

        dispatch({ type: 'SHOPPINGCART__POSTSALESORDER' });
    }
};

const initialState = {
    loading: false,
    shoppingCart: new ShoppingCart(),
    shipMethodsFetch: false,
    shipMethods: [],
    post: false,
    postError: false,
    postErrorCode: '',
    postErrorMessage: '',
    salesOrder: new SalesOrder()
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'SHOPPINGCART__REQUEST': return update(state, {loading: {$set: true}});
        case 'SHOPPINGCART__RECEIVE': {
            return update(state, {$merge: {
                loading: false,
                shoppingCart: new ShoppingCart(action.shoppingCartData)
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
        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}