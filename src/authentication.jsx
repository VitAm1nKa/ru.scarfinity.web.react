import jwtDecoder           from 'jwt-decode';
import qs                   from 'qs';
import Promise              from 'bluebird';
import { __authentication, __authenticationSocial } from './store/api-requests';

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
                        reject(new Error('General auth error!'));
                    }
                })
                .catch(e => {
                    dispatch(authenticateError());
                    reject(new Error('General auth error!'));
                })
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

function vkAuthenticate(code, redirect) {
    return(dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({ type: 'ACCOUNT_SOCIAL_VK_AUTH', code });
            dispatch(__authenticationSocial.VK.auth(code, redirect))
                .then(response => {
                    dispatch({ type: 'Auth VK json blob...' });
                    return response.json()
                })
                .then(({ type, data }) => {
                    if(type == 'success') {
                        dispatch({ type: 'ACCOUNT_SOCIAL_VK_AUTH_SUCCESS', data });
                        dispatch(authenticateComplete(data));
                        resolve({ type: 'success' });
                    } else {
                        dispatch({ type: 'ACCOUNT_SOCIAL_VK_AUTH_ERROR', error: data });
                        resolve({ type: 'error' });
                    }
                })
                .catch(e => {
                    dispatch({ type: 'ACCOUNT_SOCIAL_VK_AUTH_ERROR' });
                    resolve({ type: 'error' });
                });
        });
    }
}

function fbAuthenticate(code, redirect) {
    return(dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({ type: 'ACCOUNT_SOCIAL_FB_AUTH', code });
            dispatch(__authenticationSocial.FB.auth(code, redirect))
                .then(response => {
                    dispatch({ type: 'Auth FB json blob...' });
                    return response.json()
                })
                .then(({ type, data }) => {
                    if(type == 'success') {
                        dispatch({ type: 'ACCOUNT_SOCIAL_FB_AUTH_SUCCESS', data });
                        dispatch(authenticateComplete(data));
                        resolve({ type: 'success' });
                    } else {
                        dispatch({ type: 'ACCOUNT_SOCIAL_FB_AUTH_ERROR', error: data });
                        resolve({ type: 'error' });
                    }
                })
                .catch(e => {
                    dispatch({ type: 'ACCOUNT_SOCIAL_FB_AUTH_ERROR' });
                    resolve({ type: 'error' });
                });
        });
    }
}

function longRequest(location) {
    return (dispatch, getState) => {
        dispatch({ type: 'Social auth start...' });
        if(location) {
            if(location.query.code) {
                if(location.query.lp) {
                    const pathname = location.pathname;
                    const query = qs.stringify(_.omit(location.query, ['code']), { addQueryPrefix: true });
                    const redirect = `http://192.168.1.198:8096${pathname}${query}`;

                    switch(location.query.lp) {
                        case 'vk': return dispatch(vkAuthenticate(location.query.code, redirect));
                        case 'fb': return dispatch(fbAuthenticate(location.query.code, redirect));
                        default: {
                            dispatch({ type: `Social auth skip! [${location.query.lp}] Login provider not registerd!` });
                            return Promise.resolve({ type: 'continue' });
                        }
                    }
                } else {
                    dispatch({ type: 'Social auth skip! No login provider code!' });
                    return Promise.resolve({ type: 'continue' });
                }
            } else {
                dispatch({ type: 'Social auth skip! No social code!' });
                return Promise.resolve({ type: 'continue' });
            }
        } 

        dispatch({ type: 'Social auth skip! No location!' });
        return Promise.resolve({ type: 'continue' });
    }
}

export function initialize(cookies, location) {
    // Инициальзация приложения
    //  1. Нет куков, локэйшн пустой*
    //  -   анонимный пользователь, новый. authentication()
    //  2. Есть куки, локэйшн пустой*
    //  -   проверить токен
    //   -   токен истек: authentication(куки)
    //  3. Нет куков, есть локейшн
    //  -   аутентификация соц.сетями: socialAuth()
    //   -   ошибка: autehntication()
    //  4. Есть куки, есть локейшн
    //  -   аутентификация соц.сетями: socialAuth()
    //   -   ошибка: autehntication(куки)

    return (dispatch) => {
        return new Promise((resolve, reject) => {
            // Формаруем базовые настройки аккаунта приложения из куков
            const settings = getSettings(cookies);

            // После инициализации, необходимо записать данные полученные из куков, в стор
            // для дальнейшего использования в заросах.
            dispatch({ type: 'ACCOUNT_INITIALIZE', data: settings });

            dispatch(longRequest(location))
                .then(({ type }) => {
                    if(type == 'success') return Promise.resolve({ type: 'success' });

                    try {
                        dispatch({ type: 'Token check start...' });
                        const decoded = jwtDecoder(settings['user-token']);

                        // Проверить время жизни токена
                        if(decoded.exp * 1000 > Date.now()) {
                            dispatch({ type: 'Token check success!' });
                            dispatch(authenticateComplete({
                                email: settings['user-email'],
                                name: settings['user-name'],
                                token: settings['user-token']
                            }));
                            
                            return Promise.resolve({ type: 'success' });
                        }
                    }
                    catch(e) {}

                    dispatch({ type: 'Token check error!' });
                    return Promise.resolve({ type: 'error' });
                })
                .then(({ type }) => {
                    if(type == 'success') return Promise.resolve({ type: 'success' });

                    dispatch({ type: 'General auth start...' });
                    return dispatch(autenticate(settings['user-email']));
                })
                .then(({ type }) => {
                    if(type == 'success') resolve({ type: 'success' });
                })
                .catch(error => {
                    resolve({ type: error, message: error.message });
                });
        });
    }
}