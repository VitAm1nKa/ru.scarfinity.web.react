import update               from 'immutability-helper';
import {
    __authenticationSocial 
}                           from './api-requests';

export const accountSocialActionCreators = {
    vkAuth: (code, redirect) => (dispatch, getState) => {
        if(!getState().accountSocial.vkAuthFetch) {
            dispatch(__authenticationSocial.VK.auth(code, redirect))
                .then(response => response.json())
                .then(({ type, data }) => {
                    if(type == 'success') {
                        dispatch({ type: 'ACCOUNT_SOCIAL_VK_AUTH_SUCCESS', data });
                    } else {
                        dispatch({ type: 'ACCOUNT_SOCIAL_VK_AUTH_ERROR', error: data });
                    }
                })
                .catch(error => { dispatch({ type: 'ACCOUNT_SOCIAL_VK_AUTH_ERROR', error }); });

            dispatch({ type: 'ACCOUNT_SOCIAL_VK_AUTH', code });
        }
    }
}

const initialState = {
    vkAuth: false,
    vkAuthData: null,
    vkAuthError: null,
    fbAuth: false,
    fbAuthData: null,
    fbAuthError: null
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        // #region VK
        case 'ACCOUNT_SOCIAL_VK_AUTH': {
            return update(state, {$merge: {
                vkAuthError: null
            }});
        }
        case 'ACCOUNT_SOCIAL_VK_AUTH_SUCCESS': {
            return update(state, {$merge: {
                vkAuthError: null
            }});
        }
        case 'ACCOUNT_SOCIAL_VK_AUTH_ERROR': {
            return update(state, {$merge: {
                vkAuthError: action.error
            }});
        }
        case 'ACCOUNT_SOCIAL_VK_USERDATA': {
            return update(state, {$merge: {
                vkAuth: true,
                vkAuthData: action.data
            }});
        }
        // #endregion
        
        // #region FB
        case 'ACCOUNT_SOCIAL_FB_AUTH': {
            return update(state, {$merge: {
                fbAuth: false,
                fbAuthError: null
            }});
        }
        case 'ACCOUNT_SOCIAL_FB_AUTH_SUCCESS': {
            return update(state, {$merge: {
                fbAuth: true,
                fbAuthError: null,
                fbAuthData: action.data
            }});
        }
        case 'ACCOUNT_SOCIAL_FB_AUTH_ERROR': {
            return update(state, {$merge: {
                fbAuth: false,
                fbAuthError: action.error,
                fbAuthData: null
            }});
        }
        // #endregion
    }
    return state || initialState;
}