import qs                   from 'qs';
import { addTask }          from 'domain-task';
// import Promise              from 'bluebird';
import * as ClientData      from '../lib/client-data';

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

//  #region Authenticate
function authenticate(userEmail) {
    return (dispatch) => {
        dispatch(authenticateStart());
        return new Promise((resolve, reject) => {
            fetch(authenticateRequest(userEmail))
                .then(response => response.json())
                .then(({type, message, data}) => {
                    if(type == 'success') {
                        resolve({ type: 'success', data });
                    } else {
                        reject({ type, error: message });
                    }
                })
                .catch(error => {
                    resolve({ type: 'error', error });
                });
        });
    }
}

export function authenticateStart() {
    return { type: 'ACCOUNT__AUTH__REQUEST' };
}

export function authenticateComplete(data) {
    return { type: 'ACCOUNT__AUTH__SUCCESS', data, anonymous: true };
}

export function authenticateError() {
    return { type: 'ACCOUNT__AUTH__ERROR' };
}

function request(options = {}) {
    const userToken = ClientData.cookieGetData('user-token');
    const headers = new Headers(Object.assign({}, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
    }, options.headers || {}));

    const init = {
        headers,
        method: options.method || 'GET',
        mode: 'cors',
        cache: 'default',
        body: options.body ? JSON.stringify(options.body) : null
    }

    return new Request(options.url, init);
}

function apiUrl(apiMethodName) {
    return `http://192.168.1.198:8013/api/${apiMethodName}`;
}

function requestBuilder(apiMethod, method, { body, query } = {}, _domainTask = false) {
    const queryString = qs.stringify(query, { addQueryPrefix: true });
    const userToken = ClientData.cookieGetData('user-token');
    console.warn("API Fetch: ", `${method} : ${apiMethod}${queryString || ''}`);
    return function(onSuccess, onError, domainTask = _domainTask) {
        try {
            let fetchTask = fetch(
                request({
                    url: apiUrl(apiMethod) + queryString,
                    method,
                    body: _.includes(['POST', 'PUT'], method) ? body : null
                }))
                .then(response => response.json())
                .then(({type, message, data}) => {
                    if(type == 'success' && onSuccess != null) onSuccess(data);
                    else if(onError != null) onError({type, message});
                })
                .catch(e => {
                    console.error(e);
                });

                // addTask(fetchTask);
                if (domainTask) addTask(fetchTask);
        }
        catch(e) {
            if(onError != null) onError({type: 'Error', message: 'Error'});
        }
        finally {
            // do on finaly
        }
    }
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

function __requestBuilder(apiMethod, method, { body, query } = {}, _domainTask = false) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const requestCode = s4();
            const queryString = qs.stringify(_.pickBy(query), { addQueryPrefix: true });
    
            console.warn(`Request[${requestCode}][start]: ${method} : ${apiMethod}${queryString || ''}`);
    
            const headers = new Headers(_.merge({
                ['Access-Control-Allow-Origin']: '*',
                ['Content-Type']: 'application/json',
            }, getState().account.headers));
    
            // Выполняем асинхронный зарос к API
            // Хэндлим ошибки этим методом
            return fetch(apiUrl(apiMethod) + queryString, {
                method: method || 'GET',
                headers,
                mode: 'cors',
                cache: 'default',
                body: _.includes(['POST', 'PUT'], method) ? JSON.stringify(_.pickBy(body, _.identity)) : null
            })
            .then(response => {
                console.warn(`Request[${requestCode}][end]: ${method} : ${apiMethod}${queryString || ''}`);
                if(response.ok) {
                    resolve(response);
                } else {
                    dispatch({ type: `Request[${requestCode}], requested not ok! Status code: [${response.status}]` });
                    console.warn(`Request[${requestCode}], requested not ok! Status code: [${response.status}]`);
                    reject(`[${response.status}]`);
                }
            })
            .catch(error => {
                dispatch({ type: `Request[${requestCode}], request fetch Error! ${error}` });
                console.warn(`Request[${requestCode}], request fetch Error!`, error);
                reject(`[${error.code}]`);
            });
        }); 
    }
}

export const __values = {
    Get: () => __requestBuilder('Values/5', 'GET', {}, true)
}

//#region  Authentication
export const __authentication = {
    SignIn: (email, password) => {
        return __requestBuilder('Token/SignIn', 'POST', { body: {
            email,
            password
        }}, true);
    },
    SignUp: (name, email, password) => {
        return __requestBuilder('Token/SignUp', 'POST', { body: {
            name,
            email,
            password
        }});
    },
    Authenticate: (email) => {
        return __requestBuilder('Token', 'POST', { body: { email } }, true);
    },
    Me: () => {
        return __requestBuilder('Token', 'GET', {}, true);
    }
}
export const __authenticationSocial = {
    VK: {
        auth: (code, redirect) => __requestBuilder('Token/OAuthVKSignIn', 'GET', { query: { code, redirect } }, true)
    },
    FB: {
        auth: (code, redirect) => __requestBuilder('Token/FBSignIn', 'GET', { query: { code, redirect } }, true)
    }
}
//#endregion

export const __productModel = {
    Get: {
        Many: (catalogPageFilters, pageNumber) => {
            const catalogPagePath = _.join(catalogPageFilters.catalogPathNodes, '_');
            const query = {
                cp: catalogPagePath,
                pn: pageNumber,
                pp: catalogPageFilters.itemsOnPage,
                ct: catalogPageFilters.catalogIds,
                cl: catalogPageFilters.colorCodes,
                tt: catalogPageFilters.patternCodes,
                rt: catalogPageFilters.rating,
                sn: catalogPageFilters.Seasons || 15,
                sx: catalogPageFilters.Sexes || 15,
                pd: catalogPageFilters.pricePerItemFrom,
                pu: catalogPageFilters.pricePerItemTo,
                dc: catalogPageFilters.SortBy
            };

            return requestBuilder('ProductModel', 'GET', { query }, true);
        },
        Single: (productModelId) => __requestBuilder(`ProductModel/${productModelId}`, 'GET', {}, true)
    }
}

export const __catalogPage = {
    Get: {
        Many: () => requestBuilder('CatalogPage', 'GET', {}, true),
        Single: (catalogPageFilters) => {
            return __requestBuilder(`CatalogPage/${'catalog/ladies'}`, 'GET', { }, true);
            const catalogPagePath = _.join(catalogPageFilters.catalogPathNodes, '/');
            const query = {
                ct: catalogPageFilters.catalogIds,
                cl: catalogPageFilters.colorCodes,
                tt: catalogPageFilters.patternCodes,
                rt: catalogPageFilters.rating,
                sn: catalogPageFilters.Seasons || 15,
                sx: catalogPageFilters.Sexes || 15,
                pd: catalogPageFilters.pricePerItemFrom,
                pu: catalogPageFilters.pricePerItemTo
            };

            return __requestBuilder(`CatalogPage/${catalogPagePath}`, 'GET', { query }, true);
        }
    }
}

//  #region RelatedProductModel
export const __relatedProductModel = {
    Get: (productModelId) => requestBuilder(`RelatedProductModel/${productModelId}`, 'GET', {}, true) 
}
//  #endregion

//  #region Review
export const __review = {
    Get: {
        Many: (reviewCollectionId) => requestBuilder(`Review`, 'GET', { query: {
            rc: reviewCollectionId
        }})
    }
}
//  #endregion

//  #region SalesOrder
export const __salesOrder = {
    Get: {
        Many: () => requestBuilder('SalesOrder', 'GET', {}, true),
        Single: (salesOrderId) => requestBuilder(`SalesOrder/${salesOrderId}`, 'GET', {}, true)
    },
    Post: (salesOrderData) => requestBuilder('SalesOrder', 'POST', { body: salesOrderData })
}
//  #endregion

//  #region ShipMethods
export const __shipMethod = {
    Get: {
        Many: () => {
            return requestBuilder('ShipMethod', 'GET');
        }
    }
}
//  #endregion

//  #region SitePage
export const __sitePage = {
    Get: {
        Single: (seo) => __requestBuilder(`SitePage/${seo}`, 'GET', {}, true)
    }
}
//  #endregion

//  #region ShoppingCart
export const __shoppingCart = {
    Get: (action) => {
        return __requestBuilder('ShoppingCart', 'GET', { query: { action } }, true);
    },
    Post: () => {
        return __requestBuilder('ShoppingCart', 'POST', { body: {} }, true);
    },
    Put: (productId, quantity) => {
        return __requestBuilder('ShoppingCart', 'PUT', { body: {
            productId,
            quantity
        }});
    }
}
//  #endregion