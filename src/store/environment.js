import update       from 'immutability-helper';
import { PageMeta } from '../models/PageMeta';

export const environmentActionCreators = {
    addPageMeta: (pageMeta) => (dispatch) => {
        dispatch({ type: 'ENVIRONMENT_ADD', pageMeta });
    },
    updatePageMeta: (pageMeta) => (dispatch, getState) => {
        dispatch({ type: 'ENVIRONMENT_UPDATE', pageMeta });
    },
    removePageMeta: (pageMeta) => (dispatch) => {
        dispatch({ type: 'ENVIRONMENT_REMOVE', pageMeta });
    }
};

const initialState = {
    meta: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'ENVIRONMENT_ADD': {
            return update(state, {meta: {$push: [action.pageMeta]}});
        }
        case 'ENVIRONMENT_UPDATE': {
            const index = _.findIndex(state, p => p.pageId == action.pageMeta.pageId);
            return update(state, {meta: {[index]: {$set: action.pageMeta}}});
        }
        case 'ENVIRONMENT_REMOVE': {
            const index = _.findIndex(state, p => p.pageId == action.pageMeta.pageId);
            return update(state, {meta: {$splice: [[index, 1]]}});
        }
    }

    return state || initialState;
}