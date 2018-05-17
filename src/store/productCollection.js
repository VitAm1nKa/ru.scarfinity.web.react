// Стор хранящий в себе коллекции товаров
// Новинки, скидки, спец. предложения и тп.
// Хранить коллекции необходимо массивом классов коллекции
// Колекция предсталяет из себя простой класс со списком товаров, названием, ключем(key), ссылкой на отображение в каталоге
// В общем смысле коллекция товаров - тот же самый список товаров в каталоге, ограниченный количеством

import update               from 'immutability-helper';
import __request            from './__request';
import { ProductModel } from './__models';

export const actionCreators = {
    collectionLoad: (collectionCode = 'new') => (dispatch, getState) => {
        // Стандартное количество размера коллекции: 20
        var url = `api/catalog/fetch/ladies?page=0`;

        const request = 
            __request({url})
            .then(response => response.json())
            .then(({type, message, data}) => {
                if(type == 'success') {
                    dispatch({ type: 'PRODUCTCOLLECTION__SUCCESS', collectionCode, productModels: data.productModels });
                } else {
                    dispatch({ type: 'PRODUCTCOLLECTION__ERROR', collectionCode, messages: [message] });
                }
            })

        dispatch({ type: 'PRODUCTCOLLECTION__REQUEST', collectionCode })
    }
};

const initialState = {
    new: {
        fetch: false,
        fetchError: false,
        fetchMessages: [],
        fetchTime: Date.now(),
        productModels: []
    }
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'PRODUCTCOLLECTION__REQUEST': {
            return update(state, {[action.collectionCode]: {$merge: {
                fetch: true,
                fetchError: false,
                fetchTime: new Date(Date.now() + 5 * 60000),
                fetchMessages: []
            }}})
        }
        case 'PRODUCTCOLLECTION__SUCCESS': {
            return update(state, {[action.collectionCode]: {$merge: {
                fetch: false,
                fetchError: false,
                fetchMessages: [],
                productModels: _.map(action.productModels, model => new ProductModel(model))
            }}})
        }
        case 'PRODUCTCOLLECTION__ERROR': {
            return update(state, {[action.collectionCode]: {$merge: {
                fetch: false,
                fetchError: true,
                fetchMessages: action.messages,
                productModels: []
            }}})
        }
    }

    return state || initialState;
}