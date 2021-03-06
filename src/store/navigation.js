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
        return true;
        const request = __request({
            url: 'api/productCategory'
        })
        .then(response => response.json())
        .then(({data, type}) => {
            dispatch({ type: 'NAVIGATION__CATALOGNODESRECEIVE', nodes: data });
        })

        try{addTask(request);}catch(e){};
        dispatch({ type: 'NAVIGATION__CATALOGNODESREQUEST' });
    },
};

//  ------------------------------------------------------------------------
function currentNode(source) {
    if(source.seo != null && source.title != null) {
        return {
            seo: source.seo,
            title: source.title,
            topOffset: source.topOffset || 0
        }
    }

    return null;
};

function nodes(source) {
    return _.compact(_.concat(source.nodes, this.currentNode(source)));
}

export const breadCrumbsActions = {
    breadCrumbsPush: (pageId, breadCrumbs) => (dispatch, getState) => {
        if(_.find(getState().navigation.breadCrumbPage, b => b.pageId === pageId) == null) {
            dispatch({ type: 'BREADCRUMBS__PUSH', breadCrumbPage: { pageId, breadCrumbs } });
        }
    },
    breadCrumbsPop: (pageId) => (dispatch, getState) => {
        const index = _.findIndex(getState().navigation.breadCrumbPage, b => b.pageId === pageId);
        if(index != null) {
            dispatch({ type: 'BREADCRUMBS__POP', index });
        }
    },
    breadCrumbsSet: (pageId, breadCrumbs) => (dispatch, getState) => {
        const index = _.findIndex(getState().navigation.breadCrumbPage, b => b.pageId === pageId);
        if(index != null) {
            dispatch({ type: 'BREADCRUMBS__SET', index, breadCrumbPage: { pageId, breadCrumbs } });
        }
    }
}

export const pageLoadingActions = {
    pageLoadingStart: () => (dispatch, getState) => {
        if(getState().navigation.pageLoading == false) {
            dispatch({ type: 'PAGELOADING__START' });
        }
    },
    pageLoadingProgress: (progress) => (dispatch, getState) => {
        if(getState().navigation.pageLoading) {
            // dispatch({ type: 'PAGELOADING__PROGRESS', progress });
            // if(getState().navigation.pageLoadingProgress < progress) {
            //     dispatch({ type: 'PAGELOADING__PROGRESS', progress });
            // }
        }
    },
    pageLoadingEnd: () => (dispatch, getState) => {
        if(getState().navigation.pageLoading) {
            dispatch({ type: 'PAGELOADING__END' });
        }
    }
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const initialState = {
    isLoading: false,
    pageNotFound: false,
    pageLoading: true,

    catalogNodesLoad: false,
    catalogNodes: {},

    breadCrumbs: [],

    pageLoadingProgress: 0,

    pageBreadCrumbs: []
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

        // case 'BREADCRUMBS__PUSH': {
        //     return update(state, {breadCrumbs: {$push: 
        //         [...state.breadCrumbs, {
        //             seo: action.node.seo,
        //             title: action.node.title,
        //             path: _.trim(`${_.reduce(state.breadCrumbs, (path, node) => `${path}/${node.seo}`, '')}/${action.node.seo}`, '/'),
        //             topOffset: action.node.topOffset || 0
        //         }]
        //     }});
        // }

        case 'BREADCRUMBS__PUSH': {
            return update(state, {breadCrumbs: {$push: [action.breadCrumbPage]}});
        }
        case 'BREADCRUMBS__POP': {
            return update(state, {breadCrumbs: {$splice: [[action.index, 1]] }});
        }
        case 'BREADCRUMBS__SET': {
            return update(state, {breadCrumbs: {[action.index]: {$set: action.breadCrumbPage}}});
        }



        case 'PAGELOADING__PROGRESS': {
            return update(state, {pageLoadingProgress: {$set: action.progress}});
        }

        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}