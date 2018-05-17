import { fetch, addTask }   from 'domain-task';
import update               from 'immutability-helper';
import __request            from './__request';
import {
     Person
    ,ShipToAddress
    ,ShipMethod
}                           from './__models';

export const actionCreators = {
    loadPersonInfo: (params) => {

    },
    personSetValue: (params = {}) => (dispatch, getState) => {
        dispatch({ type: `Person.${params.type}`, value: params.value });
    },
    personGetValue: (name) => (dispatch, getState) => {
        switch(name) {
            case 'firstname': return getState().person.person.firstName;
            case 'lastname': return getState().person.person.lastName;
            case 'email': return getState().person.person.email;
            case 'phone': return getState().person.person.phone;
            case 'country': return getState().person.shipToAddress.country;
            case 'city': return getState().person.shipToAddress.city;
            case 'address': return getState().person.shipToAddress.address;
            case 'house': return getState().person.shipToAddress.house;
            case 'apartments': return getState().person.shipToAddress.apartments;
            case 'shipmethod': return getState().person.shipMethod;
        }
    }
};

const initialState = {
    person: new Person(),
    shipToAddress: new ShipToAddress()
}

export const reducer = (state, incomingAction) => {
    const action = incomingAction;
    switch (action.type) {
        case 'Person.firstname': return update(state, {person: {firstName: {$set: action.value}}});
        case 'Person.lastname': return update(state, {person: {lastName: {$set: action.value}}});
        case 'Person.email': return update(state, {person: {email: {$set: action.value}}});
        case 'Person.phone': return update(state, {person: {phone: {$set: action.value}}});
        case 'Person.country': return update(state, {shipToAddress: {country: {$set: action.value}}});
        case 'Person.city': return update(state, {shipToAddress: {city: {$set: action.value}}});
        case 'Person.address': return update(state, {shipToAddress: {address: {$set: action.value}}});
        case 'Person.house': return update(state, {shipToAddress: {house: {$set: action.value}}});
        case 'Person.apartments': return update(state, {shipToAddress: {apartments: {$set: action.value}}});
        case 'Person.shipmethod': return update(state, {shipMethod: {$set: action.value}});
    }

    return state || initialState;
}