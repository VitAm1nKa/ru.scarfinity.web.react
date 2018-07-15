import { __sitePage }   from './api-requests';
import Promise          from 'bluebird';
import { addTask } from 'domain-task';

export const sitePageActionCreators = {
    getSitePageInfo: (seo) => (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            let fetchTask = dispatch(__sitePage.Get.Single(seo))
                .then(response => response.json())
                .then(({ type, data }) => {
                    if(type == 'success') {
                        dispatch({ type: 'SITEPAGE_FETCH_SUCCESS' });
                        resolve(data);
                    } else {
                        throw new Error('Some error');
                    }
                })
                .catch(e => {
                    dispatch({ type: 'SITEPAGE_FETCH_ERROR' });
                    reject(e);
                });

            addTask(fetchTask);
            dispatch({ type: 'SITEPAGE_FETCH' });
        });
    }
};