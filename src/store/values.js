import update               from 'immutability-helper';
import { __catalogPage, __values, __authentication } from './api-requests';
import { addTask } from 'domain-task';
import Promise from 'bluebird';

export const reduxLog = {
    reduxLog: (message) => (dispatch) => { dispatch({ type: message }) } 
};

export const valuesActionCreators = {
    taskTest: () => (dispatch, getState) => {
        if(!getState().account.userInfoFetch) {
            let fetchTask = dispatch(__authentication.Me())
                .then(response => response.json())
                .then(({ type, data }) => {
                    dispatch({ type: 'ACCOUNT_USERINFO_FETCH_SUCCESS', data: {} });
                    if(type == 'success') {
                        if(data.loginProviders.vkUserInfo != null) {
                            dispatch({ type: 'ACCOUNT_SOCIAL_VK_USERDATA', data: data.loginProviders.vkUserInfo });
                        }
                    }
                })
                .catch(error => {
                    dispatch({ type: 'ACCOUNT_USERINFO_FETCH_ERROR', error });
                });

            addTask(fetchTask);

            dispatch({ type: 'ACCOUNT_USERINFO_FETCH' });
        }
    },
    taskTest1: () => (dispatch) => {
        let task = dispatch(__values.Get())
            .then(() => {
                console.error('FetchTest 1 SUCCESS!');
                dispatch({ type: 'FetchTest 1 SUCCESS!' });
            })
            .catch(error => {
                console.error('FetchTest 1 ERROR!');
                dispatch({ type: 'FetchTest 1 ERROR!' });
            });

        addTask(task);

        console.error('FetchTest 1 START!');
        dispatch({ type: 'FetchTest 1 START!' });
    },
    taskTest2: () => (dispatch) => {
        let task = new Promise((resolve, reject) => {
            console.error('FetchTest 2 start...');
            dispatch({ type: 'FetchTest 2 start...' });
            setTimeout(() => {
                console.error('FetchTest 2 end...');
                dispatch({ type: 'FetchTest 2 end...' });
                resolve({});
            }, 1500);
        });

        addTask(task);
        return task;
    }
}

export const reducer = (state = [], incomingAction) => {
    console.log(incomingAction.type);
    return update(state, {$push: [incomingAction.type]});
}