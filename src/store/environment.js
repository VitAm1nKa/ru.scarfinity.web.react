import update       from 'immutability-helper';

export const environmentActionCreators = {
    pushPageMeta: (pageMeta) => (dispatch, getState) => {
        const index = _.findIndex(getState().environment.pageMetaList, p => p.pageId == pageMeta.pageId);
        if(index == -1) {
            dispatch({ type: 'ENVIRONMENT_PUSH', pageMeta });
        }
    },
    setPageMeta: (pageMeta) => (dispatch, getState) => {
        const index = _.findIndex(getState().environment.pageMetaList, p => p.pageId === pageMeta.pageId);
        if(index != -1) {
            dispatch({ type: 'ENVIRONMENT_SET', pageMeta, index });
        }
    },
    popPageMeta: (pageId) => (dispatch, getState) => {
        const index = _.findIndex(getState().environment.pageMetaList, p => p.pageId === pageId);
        if(index != -1) {
            dispatch({ type: 'ENVIRONMENT_POP', index });
        }
    },
    clearPageMeta: () => (dispatch) => {
        dispatch({ type: 'ENVIRONMENT_CLEAR' });
    }
};

const initialState = {
    pageMetaList: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'ENVIRONMENT_PUSH': {
            return update(state, {pageMetaList: {$push: [action.pageMeta]}});
        }
        case 'ENVIRONMENT_SET': {
            return update(state, {pageMetaList: {$splice: [[action.index, 1, action.pageMeta]]}});
        }
        case 'ENVIRONMENT_POP': {
            return update(state, {pageMetaList: {$splice: [[action.index, 1]]}});
        }
        case 'ENVIRONMENT_CLEAR': {
            return update(state, {pageMetaList: {$set: []}});
        }
    }

    return state || initialState;
}