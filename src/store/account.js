import update               from 'immutability-helper';
import { 
    __authentication, 
    __authenticationSocial 
}                           from './api-requests';
import { addTask } from 'domain-task';

export const actionCreators = {
    getUserInformation: () => (dispatch, getState) => {
        if(!getState().account.userInfoFetch) {
            let fetchTask = dispatch(__authentication.Me())
                .then(response => response.json())
                .then(({ type, data }) => {
                    dispatch({ type: 'ACCOUNT_USERINFO_FETCH_SUCCESS', data: {} });
                    if(type == 'success') {
                        if(data.loginProviders.vkUserInfo != null) {
                            dispatch({ type: 'ACCOUNT_SOCIAL_VK_USERDATA', data: data.loginProviders.vkUserInfo });
                        }
                    }
                })
                .catch(error => {
                    dispatch({ type: 'ACCOUNT_USERINFO_FETCH_ERROR', error });
                });

            dispatch({ type: 'ACCOUNT_USERINFO_FETCH' });
            addTask(fetchTask);
        }
    },
    continue: (role) => (dispatch, getState) => {
        dispatch({ type: 'ACCOUNT__AUTH__CONTINUE', role });
    },
    authenticate: (email) => (dispatch) => {
        dispatch(__authentication.Authenticate(email))
            .then(response => response.json())
            .then(({ type, data }) => {
                if(type == 'success') {
                    dispatch({ type: 'ACCOUNT__AUTH__SUCCESS', data, anonymous: true });
                } else {
                    dispatch({ type: 'ACCOUNT__AUTH__ERROR', error })
                }
            })
            .catch(e => {
                dispatch({ type: 'ACCOUNT__AUTH__ERROR', error })
            });

        dispatch({ type: 'ACCOUNT__AUTH__REQUEST' });
    },
    registration: (model) => (dispatch, getState) => {
        __authentication.SignUp(model.name, model.email, model.password)(data => {
            dispatch({ type: 'ACCOUNT__REGISTRATION__SUCCESS'});
            dispatch({ type: 'ACCOUNT__SIGNIN__SUCCESS', accountData: data });
        }, error => {
            dispatch({ type: 'ACCOUNT__REGISTRATION__ERROR', error: { type, message } });
        });

        dispatch({ type: 'ACCOUNT__REGISTRATION__REQUEST' });
    },
    signIn: (model) => (dispatch, getState) => {
        __authentication.SignIn(model.email, model.password)(data => {
            dispatch({ type: 'ACCOUNT__SIGNIN__SUCCESS', accountData: data });
        }, (type, message) => {
            dispatch({ type: 'ACCOUNT__SIGNIN__ERROR', error: { type, message } });
        });

        dispatch({ type: 'ACCOUNT__SIGNIN__REQUEST' });
    },
    signOut: (model) => (dispatch, getState) => { 
        
        // При разлогинивании пользователя, необходима взять инфрмацию и стора
        // Необходимо поле name, в нем хранится информация о предыдущем анонимном пользователе
        // Это делается во избежании многократного создания пользователей в случае разлогинивания неанонимного пользователя
        __authentication.Authenticate(anonymousEmail)(data => {
            dispatch({ type: 'ACCOUNT__AUTH__SUCCESS', data: data, anonymous: true });
        }, error => {
            dispatch({ type: 'ACCOUNT__AUTH__ERROR' });
        })

        dispatch({ type: 'ACCOUNT__SIGNOUT' });
        dispatch({ type: 'ACCOUNT__AUTH__REQUEST' })
    }
};

const initialState = {
    headers: [],

    authFetch: false,
    auth: false,
    authError: null,

    userEmail: null,
    userName: null,
    userToken: null,

    userInfo: null,
    userInfoFetch: false,
    userInfoError: null,

    signIn: false,
    signInFetch: false,
    signInError: null,
    signInErrorMessages: [],

    registrationFetch: false,
    registrationError: false,
    registrationErrorMessages: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'ACCOUNT_INITIALIZE': {
            const headers = {
                ['Authorization']: `Bearer ${action.data['user-token']}`
            };

            return update(state, {$merge: {
                headers,
                authFetch: false,
                auth: true,
                authError: null,
                userEmail: action.data['user-email'],
                userName: action.data['user-name'],
                userToken: action.data['user-token']
            }});
        }
        case 'ACCOUNT_USERINFO_FETCH': {
            return update(state, {$merge: {
                userInfoFetch: true
            }});
        }
        case 'ACCOUNT_USERINFO_FETCH_SUCCESS': {
            return update(state, {$merge: {
                userInfoFetch: false,
                userInfo: action.data
            }});
        }
        case 'ACCOUNT_USERINFO_FETCH_ERROR': {
            return update(state, {$merge: {
                userInfoFetch: false,
                userInfo: null,
                userInfoError: action.error
            }});
        }
        case 'ACCOUNT__AUTH__CONTINUE': {
            switch(action.role) {
                case 'ANONYMOUS': return update(state, {auth: {$set: true}});
                default: return update(state, {signIn: {$set: true}});
            }
        }
        case 'ACCOUNT__AUTH__REQUEST': {
            return update(state, {$merge: {
                authFetch: true,
                authError: null
            }});
        }
        case 'ACCOUNT__AUTH__SUCCESS': {
            const headers = {
                ['Authorization']: `Bearer ${action.data.token}`
            };

            return update(state, {$merge: {
                headers: headers,
                authFetch: false,
                auth: true,
                authError: null,
                userEmail: action.data.email,
                userName: action.data.email,
                userToken: action.data.token
            }})
        }
        case 'ACCOUNT__AUTH__ERROR': {
            return update(state, {$merge: {
                authFetch: false,
                auth: false,
                authError: action.error,
                userName: null,
                userToken: null
            }})
        }
        case 'ACCOUNT__SIGNIN__REQUEST': {
            return update(state, {$merge: {
                signInFetch: true,
                signInError: null
            }});
        }
        case 'ACCOUNT__SIGNIN__SUCCESS': {
            return update(state, {$merge: {
                signInFetch: false,
                signInError: false,
                signInErrorMessages: [],
                signIn: true,
                auth: true,
                email: action.accountData.email,
                token: action.accountData.token
            }});
        }
        case 'ACCOUNT__SIGNIN__ERROR': {
            return update(state, {$merge: {
                signInFetch: false,
                signIn: false,
                signInError: true,
                signInErrorMessages: [action.error.message]
            }});
        }
        case 'ACCOUNT__REGISTRATION__REQUEST': {
            return update(state, {$merge: {
                registrationFetch: true,
                registrationError: false,
                registrationErrorMessages: []
            }})
        }
        case 'ACCOUNT__REGISTRATION__SUCCESS': {
            return update(state, {$merge: {
                registrationFetch: false,
                registrationError: false,
                registrationErrorMessages: []  
            }})
        }
        case 'ACCOUNT__REGISTRATION__ERROR': {
            return update(state, {$merge: {
                registrationFetch: false,
                registrationError: true,
                registrationErrorMessages: [action.error.message]
            }})
        }
        case 'ACCOUNT__SIGNOUT': {
            if(state.signIn) {
                return update(state, {$merge: {
                    auth: false,
                    signIn: false
                }});
            }
        }
    }

    return state || initialState;
}