import { fetch, addTask }   from 'domain-task';
import update               from 'immutability-helper';
import { __review }         from './api-requests';

export const reviewActionCreators = {

};

const initialState = {
    reviews: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {

    }

    return state || initialState;
}