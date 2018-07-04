import update       from 'immutability-helper';
import { PageMeta } from '../models/PageMeta';

export const environmentActionCreators = {
    setPageMeta: (pageMeta) => (dispatch, getState) => {
        const currentMeta = getState().environment.meta;
        if(currentMeta.seo != pageMeta.seo || currentMeta.title != pageMeta.title) {
            dispatch({ type: 'ENVIRONMENT_SET', pageMeta });
        }
    },
    clearPageMeta: () => (dispatch) => {
        dispatch({ type: 'ENVIRONMENT_CLEAR' });
    }
};

const initialState = {
    meta: { seo: '' }
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'ENVIRONMENT_SET': {
            return update(state, {meta: {$set: action.pageMeta}});
        }
        case 'ENVIRONMENT_CLEAR': {
            return update(state, {meta: {$set: null}});
        }
    }

    return state || initialState;
}