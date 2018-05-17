import { fetch, addTask }       from 'domain-task';
import update                   from 'immutability-helper';
import __request                from './__request';
import { ProductModelSmall }    from './__models';

export const actionCreators = {
    getRecenlyViewed: () => (dispatch, getState) => {
        const request = 
        __request({url: 'api/recenlyViewed'})
        .then((response) => response.json())
        .then(({type, data}) => {
            switch(type) {
                case 'success': dispatch({ type: 'RECENLYVIEWED__RECEIVE', productModels: data.productModels }); break;
            }
        })

        addTask(request);
        dispatch({type: 'RECENLYVIEWED__REQUEST'});
    }
};

const initialState = {
    fetch: false,
    productModels: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'RECENLYVIEWED__REQUEST': return update(state, {fetch: {$set: true}});
        case 'RECENLYVIEWED__RECEIVE': return update(state, {$set: {
            fetch: false,
            productModels: _.map(action.productModels, model => new ProductModelSmall(model))
        }});
    }

    return state || initialState;
}