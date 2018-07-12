import jwtDecoder   from 'jwt-decode';
import Promise      from 'bluebird';

function authenticateRequest(email) {
    const body = { email };

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    const init = {
        headers,
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify(_.pickBy(body, _.identity))
    }

    return new Request('http://localhost:50146/api/token', init);
}


function getSettings(cookies, account) {
    const settings = _.merge({
        'user-email': null,
        'user-name': null,
        'user-token': null
    }, cookies, _.pickBy({
        'user-email': account.userEmail,
        'user-name': account.userName,
        'user-token': account.userToken
    }, _.identity));

    return _.pickBy({
        userEmail: settings['user-email'],
        userName: settings['user-name'],
        userToken: settings['user-token']
    }, _.identity);
}

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
            fetch(authenticateRequest(email))
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

export function initialize({ cookies }) {
    return (dispatch, getState) => {
        const settings = getSettings(cookies, getState().account);
        if(settings.userToken != null) {
            // // Проверка токена
            // // Проверка на тип пользователя и срок действия
            // // Если срок действия не истек, просто получить информацию о пользователе
            try {
                const decoded = jwtDecoder(settings.userToken);

                // Если срок действия не истек, вернуть ресолв
                if(decoded.exp * 1000 > Date.now()) {
                    dispatch(authenticateComplete({
                        email: settings.userEmail,
                        name: settings.userName,
                        token: settings.userToken
                    }));
                    return Promise.resolve();
                } 
            }
            catch(e) { }
        } 

        return dispatch(autenticate(settings.userEmail));
    }
}
