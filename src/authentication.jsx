import jwtDecoder           from 'jwt-decode';
import Promise              from 'bluebird';
import { __authentication } from './store/api-requests';

function authenticateStart() {
    return { type: 'ACCOUNT__AUTH__REQUEST' };
}

function authenticateComplete(data) {
    return { type: 'ACCOUNT__AUTH__SUCCESS', data, anonymous: true };
}

function authenticateError() {
    return { type: 'ACCOUNT__AUTH__ERROR' };
}

function autenticate(email) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            dispatch(authenticateStart());
            dispatch(__authentication.Authenticate(email))
                .then(response => response.json())
                .then(({type, message, data}) => {
                    if(type == 'success') {
                        dispatch(authenticateComplete(data));
                        resolve({ type: 'success', data });
                    } else {
                        dispatch(authenticateError());
                        reject({ type, error: message });
                    }
                })
                .catch(error => {
                    dispatch(authenticateError());
                    reject({ type: 'error', error });
                });
        });
    }
}

function getSettings(data) {
    return _.merge({
        ['user-email']: null,
        ['user-name']: null,
        ['user-token']: null
    }, data);
}

export function initialize({ cookies }) {
    return (dispatch) => {
        const settings = getSettings(cookies);
        if(settings['user-token'] != null) {
            // Проверка токена
            try {
                const decoded = jwtDecoder(settings['user-token']);

                // Если срок действия не истек, вернуть ресолв
                if(decoded.exp * 1000 > Date.now()) {
                    dispatch(authenticateComplete({
                        email: settings['user-email'],
                        name: settings['user-name'],
                        token: settings['user-token']
                    }));
                    return Promise.resolve();
                } 
            }
            catch(e) { return Promise.reject(); }
        } 

        return dispatch(autenticate(settings['user-email']));
    }
}