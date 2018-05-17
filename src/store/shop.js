import update               from 'immutability-helper';
import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import qs                   from 'qs';

import { Shop }             from './__models';

export const actionCreators = {
    getShops: () => (dispatch, getState) => {
        const request = 
            __request({url: 'api/shop'})
            .then((response) => response.json())
            .then(({type, message, data}) => {
                if(type == 'success') {
                    dispatch({ type: 'SHOP__FETCH__SUCCESS', shops: data });
                } else {
                    dispatch({ type: 'SHOP__FETCH__ERROR', errors: [message] });
                }
            })

        addTask(request);
        dispatch({type: 'SHOP__FETCH__REQUEST'});
    }
};

const initialState = {
    fetch: false,
    fetchError: false,
    fetchErrors: [],
    shops: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'SHOP__FETCH__REQUEST': {
            return update(state, {$merge: {
                fetch: true,
                fetchError: false,
                fetchErrors: []
            }})
        }
        case 'SHOP__FETCH__SUCCESS': {
            return update(state, {$merge: {
                fetch: false,
                fetchError: false,
                fetchErrors: [],
                shops: _.map(action.shops, shop => new Shop(shop))
            }})
        }
        case 'SHOP__FETCH__ERROR': {
            return update(state, {$merge: {
                fetch: false,
                fetchError: true,
                fetchErrors: action.errors,
                shops: []
            }})
        }
    }

    return state || initialState;
}