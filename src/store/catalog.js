import update               from 'immutability-helper';
import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import qs                   from 'qs';
import {
    CatalogPage,
    ProductModel,
    ProductCategory
}                           from './__models';
// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
// .netCore generated

export const actionCreators = {
    load: (params) => (dispatch, getState) => {
        const {lastChunk, loading} = getState().catalog;
        if(!loading) {
            const catalogQuery = `ct=${params.ct || ""}&gp=${params.gp || ""}&tp=${params.tp || ""}`;
            const chunksQuery = `chi=${lastChunk + 1}`;
            const filterQuery = ``;
            const query = _.join(_.compact([catalogQuery, chunksQuery, filterQuery]), '&');

            let fetchTask = 
                __request({
                    method: 'GET',
                    url: `api/catalog/?q=d&${query}`
                })
                .then(response => response.json())
                .then(({data, type}) => {
                    dispatch({ type: 'CATALOG__RECEIVE', data });
                });

                addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
                dispatch({ type: 'CATALOG__LOAD'});
        }
    },
    load2: (params) => (dispatch, getState) => {
        let fetchTask = 
            __request({
                method: 'POST',
                url: `api/catalog`,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    catalogPath: params.catalogPath
                })
            })
            .then(response => response.json())
            .then(({type, data}) => {
                console.log("RELOAD", type, data);
                if(type == 'not_found') {
                    dispatch({ type: 'CATALOG__NOTFOUND' });
                } else {
                    dispatch({ type: 'CATALOG__RECEIVE', data });
                }
            });

            addTask(fetchTask);
            dispatch({ type: 'CATALOG__RELOAD' });
    },
    loadMore: () => (dispatch, getState) => {
        if(getState().catalog.nextHref != null && getState().catalog.fetchCatalog == false) {
            let fetchTask = 
                fetch(getState().catalog.nextHref)
                .then(response => response.json())
                .then(({type, data}) => {
                    console.log("LOAD MORE", type, data);
                    dispatch({ type: 'CATALOG__RECEIVE', data });
                });

            addTask(fetchTask);
            dispatch({ type: 'CATALOG__LOAD', currentHref: getState().catalog.nextHref });
        } else {
            dispatch({ type: 'CATALOG__END' });
        }
    },
    catalogTree: (catalogId) => (dispatch, getState) => {
        const request = __request({
            url: `api/catalog/${catalogId}`
        })
        .then(response => response.json())
        .then(({type, data}) => {
            console.log(data);
            if(type == 'success') {
                dispatch({ type: 'CATALOG__TREE__RECEIVE', nodes: data.nodes })
            }
        })
    },
    catalogLoad: (params = '') => (dispatch, getState) => {
        console.log("Catalog info url: ", `api/catalog/info/${params}`);
        const request = __request({
            url: `api/catalog/info/${params}`
        })
        .then(response => response.json())
        .then(({type, data}) => {
            if(type == 'success') {
                dispatch({ type: 'CATALOG__INFO__SUCCESS', productCategory: data });
            }
        })

        dispatch({ type: 'CATALOG__INFO__FETCH' })
    },
    catalogLoadProducts: (catalogQuery) => (dispatch, getState) => {
        var url = `api/catalog/fetch/${catalogQuery.query}?page=${catalogQuery.page}`;

        console.warn("Catalog Fetch Url: ", url);

        const request = __request({
            url
        })
        .then(response => response.json())
        .then(({type, data}) => {
            dispatch({ type: 'CATALOG__PRODUCTS__SUCCESS', products: data.productModels })
        })

        dispatch({ type: 'CATALOG__PRODUCTS__FETCH' })
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const initialState = {
    catalogNotFound: false,
    loading: false,
    products: [],
    nextHref: null,
    currentHref: null,
    catalogEnd: false,
    nodes: [],

    catalogInfoFetch: false,
    catalogInfo: new ProductCategory(),
    catalogInfoError: false,
    catalogInfoErrorMessages: [],

    fetchCatalogProducts: false,
    catalogProducts: [],
    catalogProductsHasMore: true
}

function fetchCatalogInfo(info) {
    var cataloInfo = new CatalogPage(info);
    if(cataloInfo.id != null) {

    }
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'CATALOG__RELOAD':
            return update(state, {$set: {
                fetchCatalog: true,
                catalogNotFound: false,
                products: [],
                nextHref: null,
                catalogEnd: false
            }})
        case 'CATALOG__LOAD':
            return update(state, {$merge: {
                fetchCatalog: true,
                catalogProductsHasMore: true
            }})
        case 'CATALOG__END':
            return update(state, {catalogEnd: {$set: true}})
        case 'CATALOG__RECEIVE':
            return update(state, {$merge: {
                loading: false, 
                fetchCatalog: false,
                products: update(state.products, {$push: action.data.products}),
                nextHref: action.data.nextHref,
                catalogEnd: action.data.nextHref == null
            }})
        case 'CATALOG__NOTFOUND': {
            return {
                catalogNotFound: true,
                fetchCatalog: false,
                loading: false,
                products: []
            }
        }
        case 'CATALOG__TREE__RECEIVE': {
            return update(state, {nodes: {$set: action.nodes}})
        }

        case 'CATALOG__INFO__FETCH': {
            return update(state, {$merge: {
                catalogInfoFetch: true,
                catalogInfoError: false,
                catalogInfoErrorMessages: [],
                catalogProducts: []
            }});
        }
        case 'CATALOG__INFO__SUCCESS': {
            return update(state, {$merge: {
                catalogInfoFetch: false,
                catalogInfoError: false,
                catalogInfo: new ProductCategory(action.productCategory),
                catalogProducts: [],
                catalogProductsHasMore: true
            }});
        }
        case 'CATALOG__INFO__ERROR': {
            return update(state, {$merge: {
                catalogInfoFetch: false,
                catalogInfoError: true,
                catalogInfoErrorMessages: action.messages,
                catalogInfo: null
            }})
        }
        case 'CATALOG__PRODUCTS__FETCH': {
            return update(state, {$merge: {
                fetchCatalogProducts: true,
                catalogProductsHasMore: true
            }})
        }
        case 'CATALOG__PRODUCTS__SUCCESS': {
            return update(state, {$merge: {
                fetchCatalogProducts: false,
                catalogProductsHasMore: (action.products || []).length > 0,
                catalogProducts: _.concat(state.catalogProducts, _.map(action.products, product => new ProductModel(product)))
            }});
        }
        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}