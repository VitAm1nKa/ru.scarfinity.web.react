import update               from 'immutability-helper';

export const reducer = (state = [], incomingAction) => {
    console.log(incomingAction.type);
    return update(state, {$push: [incomingAction.type]});
}