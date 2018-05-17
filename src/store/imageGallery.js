import update               from 'immutability-helper';
import { fetch, addTask }   from 'domain-task';
import __request            from './__request';
import qs                   from 'qs';

import {
    ImageGallery
}                           from './__models';

export const actionCreators = {
    getImageGallery: (imageGalleryId) => (dispatch, getState) => {
        const request = 
            __request({url: `api/imageGallery/${imageGalleryId}`})
            .then((response) => response.json())
            .then(({type, data}) => {
                switch(type) {
                    case 'success': dispatch({ type: 'IMAGEGALLERY__RECEIVE', imageGallery: data }); break;
                    case 'error': dispatch({ type: 'IMAGEGALLERY__RECEIVE__ERROR' }); break;
                }
            });

        addTask(request);
        dispatch({type: 'IMAGEGALLERY__REQUEST'});
    }
};

const initialState = {
    imageGalleryFetch: false,
    imageGallery: new ImageGallery(),
    imageGalleryError: false
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'IMAGEGALLERY__REQUEST': {
            return update(state, {$merge: {
                imageGalleryFetch: true,
                imageGalleryError: false
            }});
        }
        case 'IMAGEGALLERY__RECEIVE': {
            return update(state, {$merge: {
                imageGalleryFetch: false,
                imageGallery: new ImageGallery(action.imageGallery),
            }})
        }
        case 'IMAGEGALLERY__RECEIVE__ERROR': {
            return update(state, {$merge: {
                imageGalleryFetch: false,
                imageGallery: null,
                imageGalleryError: true
            }})
        }
        default: 
            const exhaustiveCheck = action;
    }

    return state || initialState;
}