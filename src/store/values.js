import update               from 'immutability-helper';
import { __catalogPage } from './api-requests';

export const reduxLog = {
    reduxLog: (message) => (dispatch) => { dispatch({ type: message }) } 
};

export const valuesActionCreators = {
    loadCatalogPageInfo: (catalogPageFilters, onSuccess, onError) => (dispatch, getState) => {
        // Token
        const token = getState().account.userToken;

        // Create request
        __catalogPage.Get.Single();        
    }
}

export const reducer = (state = [], incomingAction) => {
    console.log(incomingAction.type);
    return update(state, {$push: [incomingAction.type]});
}