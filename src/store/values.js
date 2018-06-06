import { fetch, addTask }   from 'domain-task';
import update               from 'immutability-helper';
import __request            from './__request';

export const actionCreators = {
    getValues: () => (dispatch, getState) => {
        let task = fetch('api/values', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(response => response.json())
        .then(data => {
            dispatch({ type: 'VALUES', data })
        })

        addTask(task);
    }
};

const initialState = {
    values: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'VALUES': return state.values = action.data;
    }

    return state || initialState;
}