import update from 'immutability-helper';

export const environmentActionCreators = {
    setPageTitle: (title) => (dispatch, getState) => {
        dispatch({ type: 'ENVIRONMENT_TITLE_SET', title });
    }
};

const initialState = {
    pageTitle: 'Scarfinity Site',
    pageMetaTags: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'ENVIRONMENT_TITLE_SET': {
            return update(state, {pageTitle: {$set: action.title}});
        }
        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}