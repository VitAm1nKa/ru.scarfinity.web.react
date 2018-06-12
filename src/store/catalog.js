import update               from 'immutability-helper';
import { 
    CatalogPage, 
    CatalogPageSchemaNode 
}                           from '../models/CatalogPage';
import { ProductModel }     from '../models/ProductModel';
import { 
    __productModel,
    __catalogPage
}                           from './api-requests';

export const catalogSchemaActionCreators = {
    loadCatalogPageSchema: () => (dispatch, getState) => {
        if(!getState().catalog.catalogPageSchemaFetch) {
            __catalogPage.Get.Many()(
                data => {
                    dispatch({ type: 'CATALOG_SCHEMA_FETCH_SUCCESS', data });
                },
                error => {
                    dispatch({ type: 'CATALOG_SCHEMA_FETCH_ERROR', error });
                });

            dispatch({ type: 'CATALOG_SCHEMA_FETCH' });
        }  
    }
}

export const actionCreators = {
    //  -- Работа со списком товаров
    loadCatalogProductModels: (catalogPageFilters, pageNumber) => (dispatch, getState) => {
        if(!getState().catalog.productModelsLoading) {
            __productModel.Get.Many(catalogPageFilters, pageNumber)(
                data => {
                    dispatch({ type: 'CATALOG_PRODUCTMODELS_FETCH_SUCCESS', data, productsOnPage: catalogPageFilters.itemsOnPage });
                },
                error => {
                    dispatch({ type: 'CATALOG_PRODUCTMODELS_FETCH_ERROR' });
                }, true);

            dispatch({ type: 'CATALOG_PRODUCTMODELS_FETCH' });
        }
    },
    //  -- Работа с информацией о каталоге
    loadCatalogPageInfo: (catalogPageFilters) => (dispatch, getState) => {
        if(!getState().catalog.cataloPageInfoLoading) {
            __catalogPage.Get.Single(catalogPageFilters)(
                data => {
                    dispatch({ type: 'CATALOG_CATALOGPAGEINFO_FETCH_SUCCESS', data });
                },
                error => {
                    dispatch({ type: 'CATALOG_CATALOGPAGEINFO_FETCH_ERROR' });
                }, true);

            dispatch({ type: 'CATALOG_CATALOGPAGEINFO_FETCH' });
        }
    }
};

const initialState = {
    catalogPageSchema: new CatalogPageSchemaNode(),
    catalogPageSchemaFetch: false,
    catalogPageSchemaError: null,

    catalogPage: new CatalogPage(),
    catalogPageLoading: false,

    productModels: [],
    productModelsHasMore: true,
    productModelsLoading: false,
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {

        //  #region CatalogPageSchema
        case 'CATALOG_SCHEMA_FETCH': {
            return update(state, {$merge: {
                catalogPageSchemaFetch: true,
                catalogPageSchemaError: null
            }});
        }
        case 'CATALOG_SCHEMA_FETCH_SUCCESS': {
            return update(state, {$merge: {
                catalogPageSchemaFetch: false,
                catalogPageSchemaError: null,
                catalogPageSchema: new CatalogPageSchemaNode(action.data)
            }});
        }
        case 'CATALOG_SCHEMA_FETCH_ERROR': {
            return update(state, {$merge: {
                catalogPageSchemaFetch: false,
                catalogPageSchemaError: action.error.type
            }});
        }
        //  #endregion
        //  #region CatalogPage
        case 'CATALOG_CATALOGPAGEINFO_FETCH': {
            return update(state, {
                catalogPageLoading: {$set: true},
                productModels: {$set: []}
            });
        }
        case 'CATALOG_CATALOGPAGEINFO_FETCH_SUCCESS': {
            return update(state, {$merge: {
                catalogPageLoading: false,
                catalogPage: new CatalogPage(action.data)
            }});
        }
        case 'CATALOG_CATALOGPAGEINFO_FETCH_ERROR': {
            return state;
        }
        //  #endregion
        //  #region ProductModels
        case 'CATALOG_PRODUCTMODELS_FETCH': {
            return update(state, {productModelsLoading: {$set: true}});
        }
        case 'CATALOG_PRODUCTMODELS_FETCH_SUCCESS': {
            return update(state, {$merge: {
                productModelsLoading: false,
                productModelsHasMore: action.data != null && action.data.length == action.productsOnPage },
                productModels: {$push: _.map(action.data, productModel => new ProductModel(productModel))}
            })
        }
        case 'CATALOG_PRODUCTMODELS_FETCH_EROOR': {
            return state
        }
        //  #endregion










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