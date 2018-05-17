import update               from 'immutability-helper';
import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import qs                   from 'qs';

import {
    SalesOrder
}                           from './__models';

export const actionCreators = {
    getSalesOrders: () => (dispatch, getState) => {
        console.log("DAFASDFSAFSADFASDFASDFASFASDF");
        const request = 
            __request({url: `api/salesOrder`})
            .then((response) => response.json())
            .then(({type, data}) => {
                switch(type) {
                    case 'success': dispatch({ type: 'SALESORDERS__RECEIVE', salesOrders: data.salesOrders }); break;
                }
            })

            addTask(request);
            dispatch({type: 'SALESORDERS__REQUEST'});
    }
};

const initialState = {
    fetch: false,
    error: false,
    salesOrders: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'SALESORDERS__REQUEST': {
            return update(state, {$merge: {
                fetch: true,
                error: false
            }});
        }
        case 'SALESORDERS__RECEIVE': {
            return update(state, {$merge: {
                fetch: false,
                error: false,
                salesOrders: _.map(action.salesOrders, salesOrder => new SalesOrder(salesOrder))
            }});
        }
    }

    return state || initialState;
}