import update               from 'immutability-helper';
import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import qs                   from 'qs';

import {
    Order, ShipMethod
}                           from './__models';

export const actionCreators = {
    getCartOrder: () => (dispatch, getState) => {
        const request = 
        __request({url: 'api/shoppingCart'})
        .then((response) => response.json())
        .then(({type, data}) => {
            if(type == 'success') {
                dispatch({ type: 'CART__ORDER__RECEIVE', cartOrder: data });
            }
        })

        addTask(request);
        dispatch({type: 'CART__ORDER__REQUEST'});
    },
    setCartOrderProduct: (params) => (dispatch, getState) => {
        // Изменение количества товара в корзине
        dispatch({ type: 'CART__PRODUCTSET', data: params });

        // Выгрузка корзины на сервер
        const request = __request({
            url: 'api/shoppingCart',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(response => response.json())
        .then(({type, data}) => {
            dispatch({ type: 'CART__ORDERSET__RECEIVE', cartOrder: data });
        });

        dispatch({ type: 'CART__ORDERSET__REQUEST' });
    },
    getShipMethods: () => (dispatch, getState) => {
        const request = __request({
            url: 'api/shippingMethod',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(({type, data}) => {
            dispatch({ type: 'CART__SHIPMETHODS__RECEIVE', shipMethods: data });
        });

        dispatch({ type: 'CART__SHIPMETHODS__REQUEST' });
    },
    getCartProductsTotal: () => () => {
        return 0;
    },
    getCartDeliveryTotal: () => (dispatch, getState) => {
        return 0;
    },
    getCartTotal: () => () => {
        return 0;
    }
};

const initialState = {
    loading: false,
    order: new Order(),
    shipMethods: [],
    localCart: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'CART__ORDER__REQUEST': return update(state, {loading: {$set: true}});
        case 'CART__ORDER__RECEIVE':
        case 'CART__ORDERSET__RECEIVE':
            return update(state, {$merge: {
                loading: false,
                order: new Order(action.cartOrder),
                localCart: updateLocalCart(new Order(action.cartOrder))
            }})
        case 'CART__PRODUCTSET': {
            // Поиск товара в корзине
            const index = _.findIndex(state.localCart, x => x.productId == action.data.productId);
            console.log(`Cart store: product set - `, action.data);

            if(index == -1) {
                // Такого товара нет в корзине, добавить
                // Если количесво больше 0
                if(action.data.quantity > 0) {
                    return update(state, {localCart: {$push: [action.data]}});
                }
            } else {
                // Тавар в корзине
                // Если количество больше 0, изменить количество в корзине
                if(action.data.quantity > 0) {
                    return update(state, {localCart: {[index]: {quantity: {$set: action.data.quantity}}}});
                } else {
                    // Удаление товара из корзины
                    console.log("Cart store: remove product - ", action.data.productId);
                    return update(state, {localCart: {$splice: [[index, 1]]}});
                }
            }
        }
        case 'CART__SHIPMETHODS__RECEIVE': {
            return update(state, {shipMethods: {$set: _.map(action.shipMethods.shipMethods, shipMethod => new ShipMethod(shipMethod))}})
        }
        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}

function updateLocalCart(order) {
    if(order == null) {
        return [];
    } else {
        // Обработка корзины с сервера
        return _.map(order.items, (item) => {
            return {
                productId: item.productId,
                quantity: item.quantity
            }
        })
    }
}


// const initialState = {
//     products: [],
//     deliveryInfo: {
//         userInfo: {
//             firstName: null,
//             lastName: null,
//             email: null,
//             phone: null,
//         },
//         addressInfo: {
//             country: null,
//             city: {
//                 name: null,
//                 formatted_address: null,
//                 placeId: null,
//                 id: null,
//                 address_components: null,
//             },
//             address: {
//                 name: null,
//                 formatted_address: null,
//                 placeId: null,
//                 id: null,
//                 address_components: null,
//             },
//         },
//     },
//     shippingMethod: {
//         id: -1,
//         cost: 0,
//     },

//     // methods
//     getProductsTotalSum,
//     getDeliveryTotalSum,
//     getCartTotalSum,
// }

const saveDeliveryInfo = (state, action) => {
    return Object.assign({}, state, action);
}

const addItem = (state, action) => {
    const isExsists = state.find(p => p.productId === action.productId);
    if(isExsists) {
        return state.map(p => p.productId === action.productId ?
            Object.assign({}, p, {
                quantity: p.quantity + action.quantity
            }) : p
        )
    }

    return [...state, action];
}

const removeItem = (state, action) => {
    return state.filter(p => p.productId !== action.productId);
}

const updateShippingMethod = (state, delivery) => {
    return Object.assign(state, {delivery});
}

const cart = (state = initialState, action) => {
    switch (action.type) {
        case "CART__ADD": return Object.assign({}, state, {
            products: addItem(state.products, action.data),
        })
        case "CART__REMOVE": return Object.assign({}, state, {
            products: removeItem(state.products, action.data),
        })
        case "CART__SAVE_DELIVERY_INFO": return Object.assign({}, state, {
            deliveryInfo: action.data
        });
        case "CART__SELECT_SM": return Object.assign({}, state, {
            shippingMethod: action.data,
        });
        default: 
            return state
    }
}

// export default cart;