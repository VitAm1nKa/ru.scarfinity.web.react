import { fetch, addTask }   from 'domain-task';
import update               from 'immutability-helper';
import __request            from './__request';

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
// .netCore generated

export const actionCreators = {
    requestReviewCollection: (collectionId) => (dispatch, getState) => {
        let fetchTask = __request({
            method: 'GET',
            url: `api/review/${collectionId}`
        })
        .then(response => response.json())
        .then(data => {
            dispatch({ type: 'RECEIVE_REVIEW-COLLECTION', reviewCollection: data });
        });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_REVIEW-COLLECTION'});
    },
    postReviewEvaluation: (collectionId, reviewId, useful = true) => (dispatch, getState) => {
        let fetchTask = __request({
            method: 'POST',
            url: 'api/reviewEvaluation',
            body: {
                reviewId,
                useful
            }
        })
        .then(response => {
            return response.json();
        })
        .then(({type, data}) => {
            if(type == 'success')
                dispatch({ type: 'RECEIVE_REVIEW-EVALUATION', reviewEvaluationData: { collectionId, reviewId, data } });
        })

        addTask(fetchTask);
        dispatch({ type: 'POST_REVIEW-EVALUATION', reviewEvaluationData: { collectionId, reviewId, useful } });
    },
    postReview: (reviewData) => (dispatch, getState) => {
        let fetchTask = __request({
            method: 'POST',
            url: 'api/reviews',
            body: reviewData
        })
        .then(response => response.json())
        .then(data => {
            if(data.type == 'success')
                dispatch({ type: 'POST_REVIEW_SUCCESS' });
        })

        addTask(fetchTask);
        dispatch({ type: 'POST_REVIEW' });
    }
};

//  ----------------
//  REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const initialState = {
    reviews: []
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case "REQUEST_REVIEW-COLLECTION": 
            return {
                reviews: state.reviews,
                loading: true
            };
        case "RECEIVE_REVIEW-COLLECTION":
            console.log(incomingAction);
            return {
                reviews: update(state.reviews, {$merge: incomingAction.reviewCollection.reviews}),
                loading: false
            };
        case "POST_REVIEW-EVALUATION": {
            const {reviewId, useful} = incomingAction.reviewEvaluationData;
            return {
                reviews: update(state.reviews, {[state.reviews.findIndex(x => x.id == reviewId)]: {evaluation: {$apply: x => ({
                    rated: true,
                    useful: x.useful + useful == true ? 1 : 0,
                    unuseful: x.unuseful + useful == false ? 1 : 0
                })}}}),
                reviewsCollections: state.reviewsCollections,
                loading: false
            }
        }
        case "RECEIVE_REVIEW-EVALUATION": {
            const {reviewId, data} = incomingAction.reviewEvaluationData;
            return {
                reviews: update(state.reviews, {[state.reviews.findIndex(x => x.id == reviewId)]: {evaluation: {$apply: data}}}),
                reviewsCollections: state.reviewsCollections,
                loading: false
            }
        }
        case "POST_REVIEW": {
            return update(state, {$merge: {posting: true}})
        }
        case "POST_REVIEW_SUCCESS": {
            return update(state, {$merge: {posting: false}})
        }
        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}