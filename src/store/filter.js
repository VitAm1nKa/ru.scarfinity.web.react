import update from 'immutability-helper';
// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
// .netCore generated

export const actionCreators = {
    color: {
        addColor: (colorCode) => (dispatch, getState) => {
            dispatch({type: 'FILTER__COLOR__ADD', colorCode});
        },
        removeColor: (colorCode) => (dispatch, getState) => {
            dispatch({type: 'FILTER__COLOR__REMOVE', colorCode})
        },
        clearColor: () => (dispatch, getState) => {
            dispatch({type: 'FILTER__COLOR__CLEAR'})
        }
    },
    price: {
        setMin: (value) => (dispatch, getState) => {
            dispatch({type: 'FILTER__PRICE__MIN', value});
        },
        setMax: (value) => (dispatch, getState) => {
            dispatch({type: 'FILTER__PRICE__MAX', value});
        },
        setInitial: (min, max) => (dispatch, getState) => {
            dispatch({type: 'FILTER__PRICE__SET', values: { min, max }});
        }
    },
    rating: {
        setValue: (value) => (dispatch, getState) => {
            dispatch({type: 'FILTER__RATING__SET', value})
        }
    },
    season: {
        addSeason: (seasonId) => (dispatch, getState) => {
            dispatch({type: 'FILTER__SEASON__ADD', seasonId});
        },
        removeSeason: (seasonId) => (dispatch, getState) => {
            dispatch({type: 'FILTER__SEASON__REMOVE', seasonId})
        },
        clearSeason: () => (dispatch, getState) => {
            dispatch({type: 'FILTER__SEASON__CLEAR'})
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const initialState = {
    colors: [1, 2, 3],
    priceRange: {
        minValue: 0,
        maxValue: 0
    },
    rating: -1,
    season: [],
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case "FILTER__COLOR__ADD": 
            return update(state, {colors: {$push: [action.colorCode]}});
        case "FILTER__COLOR__REMOVE":
            const index = _.findIndex(state.colors, x => x === action.colorCode);
            if(index != -1) 
                return update(state, {colors: {$splice: [[index, 1]]}});
            return state;
        case "FILTER__COLOR__CLEAR":
            return update(state, {colors: {$set: []}})
        case "FILTER__PRICE__SET":
            return update(state, {priceRange: {$merge: {minValue: action.values.min, maxValue: action.values.max}}})
        case "FILTER__PRICE__MIN":
            return update(state, {priceRange: {$merge: {minValue: action.value}}})
        case "FILTER__PRICE__MAX":
            return update(state, {priceRange: {$merge: {maxValue: action.value}}})
        case "FILTER__RATING__SET":
            return update(state, {rating: {$set: action.value}})
        case "FILTER__SEASON__ADD":
            return update(state, {season: {$push: [action.seasonId]}})
        case "FILTER__SEASON__REMOVE":
            const seasonIndex = _.findIndex(state.season, x => x === action.seasonId);
            if(seasonIndex != -1) {
                return update(state, {season: {$splice: [[seasonIndex, 1]]}})
            }
            return state;
        case "FILTER__SEASON__CLEAR":
            return update(state, {season: {$set: []}})
        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}