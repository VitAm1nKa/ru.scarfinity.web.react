import { fetch, addTask }   from 'domain-task';
import update               from 'immutability-helper';
import __request            from './__request';

export const actionCreators = {
    getUserInfo: () => (dispatch, getState) => {
        __request({
            url: 'api/user'
        })
        .then(response => response.json())
        .then(({type, data}) => {
            if(type == 'success') {
                dispatch({ type: 'USER__INFORESPONSE', data })
            } else {
                dispatch({ type: 'USER__INFORESPONSEFAIL' })
            }
        });

        dispatch({ type: 'USER__INFOREQUEST' })
    }
};

const initialState = {
    userId: null
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'USER__INFORESPONSE': return update(state, {userId: {$set: action.data.userId}});
        case 'USER__INFORESPONSEFAIL': return update(state, {userId: {$set: null}});
    }

    return state || initialState;
}