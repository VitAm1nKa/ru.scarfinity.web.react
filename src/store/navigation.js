import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import update               from 'immutability-helper';
import {
    ProductCategorySchemaNode
}                           from './__models';

const __DEVELOP = true;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
// .netCore generated

export const actionCreators = {
    requestNavigation: () => (dispatch, getState) => {
        const { root, isLoading } = getState().navigation;
        if(!__DEVELOP) {
            if(isLoading == false && root.nodes.length == 0) {
                let fetchTask = 
                __request({
                    method: 'GET',
                    url: `api/CatalogItems`
                })
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: 'RECEIVE_NAVIGATION', root: data });
                });

                addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
                dispatch({ type: 'REQUEST_NAVIGATION'});
            }
        }
    },
    requestCatalogNodes: () => (dispatch, getState) => {
        const request = __request({
            url: 'api/productCategory'
        })
        .then(response => response.json())
        .then(({data, type}) => {
            dispatch({ type: 'NAVIGATION__CATALOGNODESRECEIVE', nodes: data });
        })

        addTask(request);
        dispatch({ type: 'NAVIGATION__CATALOGNODESREQUEST' });
    },
};

export const breadCrumbsActions = {
    breadCrumbsPush: (node) => (dispatch, getState) => {
        dispatch({ type: 'BREADCRUMBS__PUSH', node });
    },
    breadCrumbsPop: (node) => (dispatch, getState) => {
        dispatch({ type: 'BREADCRUMBS__POP', node });
    }
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const develop = {
    "id": 1,
    "title": "Главная",
    "seo": "",
    "path": "/",
    "nodes": [
        {
            "id": 2,
            "title": "Каталог",
            "seo": "catalog",
            "path": "/catalog",
            "nodes": [
                {
                    "id": 10,
                    "title": "Женщинам",
                    "seo": "ladies",
                    "path": "/catalog/ladies",
                    "nodes": [
                        {
                            "id": 16,
                            "title": "Шарфы",
                            "seo": "sharfy",
                            "path": "/catalog/ladies/sharfy",
                            "nodes": [
                                {
                                    "id": 25,
                                    "title": "Шарф-вязанный",
                                    "seo": "sharf_vyzanniy",
                                    "path": "/catalog/ladies/sharfy/sharf_vyzanniy",
                                    "nodes": []
                                }
                            ]
                        },
                        {
                            "id": 17,
                            "title": "Платки",
                            "seo": "platki",
                            "path": "/catalog/ladies/platki",
                            "nodes": []
                        },
                        {
                            "id": 18,
                            "title": "Палантины",
                            "seo": "palantiny",
                            "path": "/catalog/ladies/palantiny",
                            "nodes": []
                        },
                        {
                            "id": 19,
                            "title": "Снуды",
                            "seo": "snudi",
                            "path": "/catalog/ladies/snudi",
                            "nodes": []
                        },
                        {
                            "id": 23,
                            "title": "Косынки",
                            "seo": "kosinky",
                            "path": "/catalog/ladies/kosinky",
                            "nodes": []
                        },
                        {
                            "id": 24,
                            "title": "Парео",
                            "seo": "pareo",
                            "path": "/catalog/ladies/pareo",
                            "nodes": []
                        }
                    ]
                },
                {
                    "id": 11,
                    "title": "Мужчинам",
                    "seo": "gentlemen",
                    "path": "/catalog/gentlemen",
                    "nodes": [
                        {
                            "id": 20,
                            "title": "Шарфы",
                            "seo": "sharfi",
                            "path": "/catalog/gentlemen/sharfi",
                            "nodes": []
                        },
                        {
                            "id": 21,
                            "title": "Косынки",
                            "seo": "kosinky",
                            "path": "/catalog/gentlemen/kosinky",
                            "nodes": []
                        },
                        {
                            "id": 22,
                            "title": "Арафатка",
                            "seo": "arafatka",
                            "path": "/catalog/gentlemen/arafatka",
                            "nodes": []
                        }
                    ]
                },
                {
                    "id": 12,
                    "title": "Детям",
                    "seo": "kids",
                    "path": "/catalog/kids",
                    "nodes": []
                },
                {
                    "id": 13,
                    "title": "Аксессуары",
                    "seo": "accessories",
                    "path": "/catalog/accessories",
                    "nodes": []
                },
                {
                    "id": 14,
                    "title": "Бижутерия",
                    "seo": "bijouterie",
                    "path": "/catalog/bijouterie",
                    "nodes": []
                }
            ]
        },
        {
            "id": 3,
            "title": "Новинки",
            "seo": "new",
            "path": "/new",
            "nodes": []
        },
        {
            "id": 4,
            "title": "Акции",
            "seo": "stock",
            "path": "/stock",
            "nodes": []
        },
        {
            "id": 5,
            "title": "Теги",
            "seo": "tags",
            "path": "/tags",
            "nodes": []
        },
        {
            "id": 6,
            "title": "Компания",
            "seo": "company",
            "path": "/company",
            "nodes": []
        },
        {
            "id": 7,
            "title": "Корзина",
            "seo": "cart",
            "path": "/cart",
            "nodes": []
        },
        {
            "id": 8,
            "title": "Информация",
            "seo": "info",
            "path": "/info",
            "nodes": []
        },
        {
            "id": 9,
            "title": "Помощь",
            "seo": "help",
            "path": "/help",
            "nodes": []
        }
    ]
}

const initialState = {
    root: develop,
    isLoading: false,
    pageNotFound: false,
    pageLoading: true,

    catalogNodesLoad: false,
    catalogNodes: {},

    breadCrumbs: [],
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'NAVIGATION__CATALOGNODESREQUEST': 
            return update(state, {$merge: {
                catalogNodesLoad: true
            }});
        case 'NAVIGATION__CATALOGNODESRECEIVE':
            return update(state, {$merge: {
                catalogNodesLoad: false,
                catalogNodes: new ProductCategorySchemaNode(action.nodes)
            }})
        case "REQUEST_NAVIGATION": 
            return {
                root: state.root,
                isLoading: true
            };
        case "RECEIVE_NAVIGATION":
            return {
                root: action.root,
                isLoading: false
            };
        case "PAGE__NOTFOUND": return update(state, {pageNotFound: {$set: true}});

        case 'BREADCRUMBS__PUSH': {
            return update(state, {breadCrumbs: {$set: 
                [...state.breadCrumbs, {
                    seo: action.node.seo,
                    title: action.node.title,
                    path: _.trim(`${_.reduce(state.breadCrumbs, (path, node) => `${path}/${node.seo}`, '')}/${action.node.seo}`, '/'),
                    topOffset: action.node.topOffset || 0
                }]
            }});
        }
        case 'BREADCRUMBS__POP': {
            return update(state, {breadCrumbs: {$set:
                _.filter(state.breadCrumbs, c => c.seo != action.node.seo)
            }});
        }


        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}