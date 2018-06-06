import qs from 'qs';
import { addTask } from 'domain-task';

function request(options = {}) {
    const userToken = '';// localStorage.getItem('user-token');
    const mode = 'cors';
    const headers = Object.assign({}, {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${userToken}`
    }, options.headers || {});

    console.warn(options.url);

    let task = fetch(options.url, {
        method: options.method || 'GET',
        mode,
        headers,
        body: options.body
    });

    addTask(task);

    return task;
}

function apiUrl(apiMethodName) {
    return `http://localhost:50146/api/${apiMethodName}`;
}

function requestBuilder(apiMethod, method, { body, query } = {}, domainTask = false) {
    console.warn("API Fetch: ", `${method} : ${apiMethod}`);
    const queryString = qs.stringify(query, { addQueryPrefix: true });
    return function(onSuccess, onError, domainTask = false) {
        let fetchTask = 
            request({
                url: apiUrl(apiMethod) + queryString,
                method,
                body: _.includes(['POST', 'PUT'], method) ? body : null
            })
            .then(response => response.json())
            .then(({type, data}) => {
                if(type == 'success' && onSuccess != null) onSuccess(data);
            })
            .catch(e => {
                console.error(e);
            });

        if (domainTask) addTask(fetchTask);
    }
}

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