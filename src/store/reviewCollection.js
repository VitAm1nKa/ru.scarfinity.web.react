import update               from 'immutability-helper';
import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import qs                   from 'qs';

import {
    Review, ReviewCollection
}                           from './__models';

export const actionCreators = {
    getReviewCollection: (reviewCollectionId) => (dispatch, getState) => {
        const request = 
        __request({url: `api/reviewCollection/${reviewCollectionId}`})
        .then((response) => response.json())
        .then(({type, data}) => {
            switch(type) {
                case 'success': dispatch({ type: 'REVIEWS__REVIEWCOLLECTION__RECEIVE', reviewCollection: data }); break;
                case 'not_found': dispatch({ type: 'REVIEWS__REVIEWCOLLECTION__RECEIVE__NOTFOUND' }); break;
            }
        })

        addTask(request);
        dispatch({type: 'REVIEWS__REVIEWCOLLECTION__REQUEST'});
    },
    postReview: (review) => (dispatch, getState) => {
        const request =
            __request({
                url: 'api/reviewCollection',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(review)
            })
            .then(response => response.json())
            .then(({type, message, data}) => {
                if(type == 'success') {
                    dispatch({ type: 'REVIEW__POST__SUCCESS', review: data });
                }
            });

        dispatch({ type: 'REVIEW__POST' });
    }
};

const initialState = {
    fetch: false,
    error: false,
    reviewCollection: new ReviewCollection(),
    reviewPost: false,
    reviewPostError: false
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'REVIEWS__REVIEWCOLLECTION__REQUEST': {
            return update(state, {$merge: {
                fetch: true,
                error: false,
                reviewCollection: new ReviewCollection()
            }});
        }
        case 'REVIEWS__REVIEWCOLLECTION__RECEIVE': {
            return update(state, {$merge: {
                fetch: false,
                error: false,
                reviewCollection: new ReviewCollection(action.reviewCollection)
            }});
        }
        case 'REVIEWS__REVIEWCOLLECTION__RECEIVE__NOTFOUND': {
            return update(state, {$merge: {
                fetch: false,
                error: true
            }})
        }
        case 'REVIEW__POST': {
            return update(state, {$merge: {
                reviewPost: true,
                reviewPostError: false
            }})
        }
        case 'REVIEW__POST__SUCCESS': {
            return update(state, {$merge: {
                reviewPost: false,
                reviewPostError: false
            }})
        }
    }

    return state || initialState;
}