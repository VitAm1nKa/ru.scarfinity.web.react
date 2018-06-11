import qs                   from 'qs';
import { addTask }          from 'domain-task';
import * as ClientData      from '../lib/client-data';

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
    return `http://localhost:50146/api/${apiMethodName}`;
}

function requestBuilder(apiMethod, method, { body, query } = {}, _domainTask = false) {
    console.warn("API Fetch: ", `${method} : ${apiMethod}`);
    console.log(body, _.includes(['POST', 'PUT'], method) ? body : null);
    const queryString = qs.stringify(query, { addQueryPrefix: true });
    return function(onSuccess, onError, domainTask = _domainTask) {
        let fetchTask = fetch(
            request({
                url: apiUrl(apiMethod) + queryString,
                method,
                body: _.includes(['POST', 'PUT'], method) ? body : null
            }))
            .then(response => response.json())
            .then(({type, message, data}) => {
                if(type == 'success' && onSuccess != null) onSuccess(data);
                else if(onError != null) onError(type, message);
            })
            .catch(e => {
                console.error(e);
            });

        if (domainTask) addTask(fetchTask);
    }
}

//#region  Authentication
export const __authentication = {
    SignIn: (email, password) => {
        return requestBuilder('Token/SignIn', 'POST', { body: {
            email,
            password
        }}, true);
    },
    SignUp: (name, email, password) => {
        return requestBuilder('Token/SignUp', 'POST', { body: {
            name,
            email,
            password
        }});
    },
    Authenticate: (email) => {
        const body = email != null ? { email } : {};
        console.log(body);
        return requestBuilder('Token', 'POST', { body });
    },
    Me: () => {
        return requestBuilder('Token', 'GET');
    }
}
//#endregion

export const __productModel = {
    Get: {
        Many: (catalogPageFilters, pageNumber) => {
            const catalogPagePath = _.join(catalogPageFilters.catalogPathNodes, '_');
            const query = {
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
        Single: (productModelNumber) => requestBuilder(`ProductModel/${productModelNumber}`, 'GET')
    }
}

export const __catalogPage = {
    Get: {
        Single: (catalogPageFilters) => {
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

            return requestBuilder(`CatalogPage/${catalogPagePath}`, 'GET', { query }, true);
        }
    }
}

//  #region SalesOrder
export const __salesOrder = {
    Get: {
        Single: (salesOrderId) => requestBuilder(`SalesOrder/${salesOrderId}`, 'GET', true)
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

//  #region ShoppingCart
export const __shoppingCart = {
    Get: () => {
        return requestBuilder('ShoppingCart', 'GET', {}, true);
    },
    Post: () => {
        return requestBuilder('ShoppingCart', 'POST', { body: {} });
    },
    Put: (productId, quantity) => {
        return requestBuilder('ShoppingCart', 'PUT', { body: {
            productId,
            quantity
        }});
    }
}
//  #endregion