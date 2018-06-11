import update               from 'immutability-helper';
import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import qs                   from 'qs';

import { SalesOrder }       from '../models/SalesOrder';
import { __salesOrder }     from './api-requests';
import {
    actionCreators 
} from './shoppingCart';

export const salesOrderActionCreators = {
    getSalesOrder: (salesOrderId) => (dispatch, getState) => {
        __salesOrder.Get.Single(salesOrderId)(data => {
            dispatch({ type: 'SALESORDER__RECEIVE', salesOrder: data });
        }, error => {
            dispatch({ type: 'SALESORDER__RECEIVE__NOTFOUND' })
        });

        dispatch({type: 'SALESORDER__REQUEST'});
    },
    postSalesOrder: (salesOrderPost) => (dispatch, getState) => {
        console.warn("Sales order Post: ", salesOrderPost);
        // самый важный метод на всем сайте
        // подойти с максимальной ответсвенностью
        __salesOrder.Post(salesOrderPost)(data => {
            // В случае успешного проведения заказа, в ответ получаем информацию о вновь созданом заказе
            dispatch({ type: 'SALESORDER__POST__SUCCESS', salesOrder: data });
            // Так же следует, обновить информацию о корзине.
            // На стороне сервера, она очищается после размещения заказа
            // После диспатча события о успешном размещении заказа, локальный стейте Redux очищает инфо о корзине
            // И делается запрос на сервер, за обновленной информацией
            actionCreators.getShoppingCart()(dispatch, getState);
        }, (type, message) => {
            // В случае, неудачного размещения зака, обрабоать все ошибки
            // Данная реализация упрощена, и все ошибки обрабатываются одним диспатчем
            // За анализ ошибки отвечает компонент, которыйй и отоброжает инфо об ошибках
            dispatch({ type: 'SALESORDER__POST__ERROR', error: { type, message} });
        });

        dispatch({ type: 'SALESORDER__POST' });
    }
};

const initialState = {
    post: false,
    postError: false,
    postErrorCode: '',
    postErrorMessage: '',
    salesOrder: new SalesOrder()
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'SALESORDER__POST': {
            return update(state, {$merge: {
                post: true,
                postError: false,
                postErrorCode: '',
                postErrorMessage: '',
                salesOrder: null
            }});
        }
        case 'SALESORDER__POST__SUCCESS': {
            return update(state, {$merge: {
                post: false,
                postError: false,
                postErrorCode: '',
                postErrorMessage: '',
                salesOrder: action.salesOrder
            }})
        }
        case 'SALESORDER__POST__ERROR': {
            return update(state, {$merge: {
                post: false,
                postError: true,
                postErrorCode: action.error.type,
                postErrorMessage: action.error.message,
                salesOrder: null
            }})
        }













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