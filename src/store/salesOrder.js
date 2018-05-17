import update               from 'immutability-helper';
import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import qs                   from 'qs';

import {
    SalesOrder
}                           from './__models';

export const actionCreators = {
    getSalesOrder: (salesOrderId) => (dispatch, getState) => {
        const request = 
        __request({url: `api/salesOrder/${salesOrderId}`})
        .then((response) => response.json())
        .then(({type, data}) => {
            switch(type) {
                case 'success': dispatch({ type: 'SALESORDER__RECEIVE', salesOrder: data }); break;
                case 'not_found': dispatch({ type: 'SALESORDER__RECEIVE__NOTFOUND' }); break;
            }
        })

        addTask(request);
        dispatch({type: 'SALESORDER__REQUEST'});
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
                    // В случае успешного проведения заказа, в ответ получаем информацию о вновь созданом заказе
                    case 'success': dispatch({ type: 'SALESORDERPOST__SUCCESS', salesOrder: data.salesOrder });
                    case 'OrderTypeNotProvided':
                    case 'OrderTypeNotExists':
                    case 'ShoppingCartNotProvided':
                    case 'ShoppingCartNotExists':
                    case 'ShoppingCartNoItems':
                    case 'ShipMethodNotProvided':
                    case 'ShipMethodNotExists':
                    case 'PersonFirstNameNotExists':
                    case 'PersonLastNameNotExists':
                    case 'PersonEmailNotExists':
                    case 'PersonPhoneNotExists':
                            dispatch({ type: 'SALESORDERPOST__ERROR', error: { type, message} });
                    default: ;
                }
            })

        dispatch({ type: 'SALESORDERPOST' });
    }
};

const initialState = {
    fetch: false,
    fetchError: false,
    post: false,
    postError: false,
    postErrorCode: '',
    postErrorMessage: '',
    salesOrder: new SalesOrder()
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'SALESORDER__REQUEST': {
            return update(state, {$merge: {
                fetch: true,
                fetchError: false
            }});
        }
        case 'SALESORDER__RECEIVE': {
            return update(state, {$merge: {
                fetch: false,
                fetchError: false,
                salesOrder: new SalesOrder(action.salesOrder)
            }});
        }
        case 'SALESORDER__RECEIVE__NOTFOUND': {
            return update(state, {$merge: {
                fetch: false,
                fetchError: true,
                salesOrder: new SalesOrder()
            }})
        }
        case 'SALESORDERPOST': {
            return update(state, {$merge: {
                post: true,
                postError: false,
                postErrorCode: '',
                postErrorMessage: '',
                salesOrder: null
            }});
        }
        case 'SALESORDERPOST__SUCCESS': {
            return update(state, {$merge: {
                post: false,
                postError: false,
                postErrorCode: '',
                postErrorMessage: '',
                salesOrder: action.salesOrder
            }})
        }
        case 'SALESORDERPOST__ERROR': {
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