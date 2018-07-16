import { __sitePage }   from './api-requests';
import { addTask } from 'domain-task';

export const sitePageActionCreators = {
    getSitePageInfo: (seo, onSuccess, onError) => (dispatch, getState) => {
        let fetchTask = dispatch(__sitePage.Get.Single(seo))
            .then(response => response.json())
            .then(({ type, data }) => {
                if(type == 'success') {
                    dispatch({ type: 'SITEPAGE_FETCH_SUCCESS' });
                    if(onSuccess) onSuccess(data);
                } else {
                    if(onError) onError(data);
                }
            })
            .catch(e => {
                console.error(e);
                dispatch({ type: 'SITEPAGE_FETCH_ERROR' });
            });

        addTask(fetchTask);
            
        dispatch({ type: 'SITEPAGE_FETCH' });
    }
};