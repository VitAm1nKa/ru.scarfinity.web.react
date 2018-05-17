import { fetch, addTask }   from 'domain-task';
import update               from 'immutability-helper';
import __request            from './__request';
import jwtDecoder           from 'jwt-decode';

function login(email, onSuccess, onError) {
    const request = 
        __request({
            url: 'api/account/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email})
        })
        .then(response => response.json())
        .then(({type, message, data}) => {
            if(type == 'success' && onSuccess) onSuccess(data);
            if(type != 'success' && onError) onError({type, message});
        });
}

export const actionCreators = {
    continue: (role) => (dispatch, getState) => {
        dispatch({ type: 'ACCOUNT__AUTH__CONTINUE', role });
    },
    login: (email) => (dispatch, getState) => {

        login(email, 
            data => {
                dispatch({ type: 'ACCOUNT__AUTH__SUCCESS', data, anonymous: true })
            }, 
            error => {
                dispatch({ type: 'ACCOUNT__AUTH__ERROR', error })
        });

        dispatch({ type: 'ACCOUNT__AUTH__REQUEST' });
    },
    registration: (model) => (dispatch, getState) => {
        // Регистрация пользователя на основании данных хрянящихся в session storage
        // Model: email, password, [name]
        const request = 
            __request({
                url: 'api/account/registration',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(model)
            })
            .then((response) => response.json())
            .then(({type, message, data}) => {
                if(type == 'success') {
                    dispatch({ type: 'ACCOUNT__REGISTRATION__SUCCESS'});
                    dispatch({ type: 'ACCOUNT__SIGNIN__SUCCESS', accountData: data });
                } else {
                    dispatch({ type: 'ACCOUNT__REGISTRATION__ERROR', error: { type, message } });
                }
            });

        dispatch({ type: 'ACCOUNT__REGISTRATION__REQUEST' });
    },
    signIn: (model) => (dispatch, getState) => {
        const request =
            __request({
                url: 'api/account/signIn',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(model)
            })
            .then(response => response.json())
            .then(({type, message, data}) => {
                if(type == 'success') {
                    dispatch({ type: 'ACCOUNT__SIGNIN__SUCCESS', accountData: data });
                } else {
                    dispatch({ type: 'ACCOUNT__SIGNIN__ERROR', error: { type, message } });
                }
            });

        dispatch({ type: 'ACCOUNT__SIGNIN__REQUEST' });
    },
    signOut: (model) => (dispatch, getState) => { 
        
        // При разлогинивании пользователя, необходима взять инфрмацию и стора
        // Необходимо поле name, в нем хранится информация о предыдущем анонимном пользователе
        // Это делается во избежании многократного создания пользователей в случае разлогинивания неанонимного пользователя
        const anonymousEmail = localStorage.getItem('user-name');

        login(anonymousEmail || '', 
            data => {
                dispatch({ type: 'ACCOUNT__AUTH__SUCCESS', data: data, anonymous: true })
        },
            error => {
                dispatch({ type: 'ACCOUNT__AUTH__ERROR' })
        });

        dispatch({ type: 'ACCOUNT__SIGNOUT' });
        dispatch({ type: 'ACCOUNT__AUTH__REQUEST' })
    }
};

const initialState = {
    authFetch: false,
    auth: false,
    authError: null,
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

            localStorage.setItem('user-email', action.data.email || '');
            localStorage.setItem('user-token', action.data.token || '');

            // Если получен токен для ананимного польователя, то сохранить email как name
            // Для избежания многократного созвавания пользователей в момент ралогинивания
            // Так же для исмольования при регистрации анонимного пользователя в реального
            if(action.anonymous == true)
                localStorage.setItem('user-name', action.data.email);

            return update(state, {$merge: {
                authFetch: false,
                auth: true,
                authError: null
            }})
        }
        case 'ACCOUNT__AUTH__ERROR': {

            localStorage.removeItem('user-email');
            localStorage.removeItem('user-token');
            localStorage.removeItem('user-name');

            return update(state, {$merge: {
                authFetch: false,
                auth: false,
                authError: action.error.message
            }})
        }
        case 'ACCOUNT__SIGNIN__REQUEST': {
            return update(state, {$merge: {
                signInFetch: true,
                signInError: null
            }});
        }
        case 'ACCOUNT__SIGNIN__SUCCESS': {

            localStorage.setItem('user-email', action.accountData.email);
            localStorage.setItem('user-token', action.accountData.token);

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
            localStorage.removeItem('user-email');
            localStorage.removeItem('user-token');

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

// 839815f7-c10b-4ac9-8f01-15a23555eed6
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiOTkzYzZhNzctMzAwOS00NmRhLWFmNmYtNGJhZDNlMjU0MWUyIiwianRpIjoiMzU2Y2NjZjMtYjQ1MS00YjE3LWJiNjktYjk4NGYyYzVhNjBkIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiYW5vbnltb3VzIiwiZXhwIjoxNTIwMjMzODk4LCJpc3MiOiJodHRwOi8vMTkyLjE2OC4xLjE5ODo1NTEzOSIsImF1ZCI6Imh0dHA6Ly8xOTIuMTY4LjEuMTk4OjU1MTM5In0.2iqvZYra8yhd0hFHN22h0h8RlmAL7FtQMnbGs6ZWqtE