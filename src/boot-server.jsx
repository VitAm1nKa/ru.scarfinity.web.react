import React from 'react';
import ReactDOM   from 'react-dom/server';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import { createMemoryHistory } from 'history';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import configureStore from './configureStore';
import { routes } from './routes';
import { CookiesProvider } from 'react-cookie';
import Cookies from 'universal-cookie';
import { initialize } from './authentication';
import { addTask } from 'domain-task';
import Promise from 'bluebird';

function prerender(params) {
    return new Promise((resolve, reject) => {
        console.error('### ##  #   [APP START]   #  ## ###');
        // Prepare Redux store with in-memory history, and dispatch a navigation event
        // corresponding to the incoming URL
        const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
        const urlAfterBasename = params.url.substring(basename.length);
        const store = configureStore(createMemoryHistory());
        store.dispatch(replace(urlAfterBasename));

        const routerContext = {};
        const app = (
            <Provider store={ store }>
                <CookiesProvider cookies={new Cookies(params.data.cookies)}>
                    <StaticRouter basename={ basename } context={ routerContext } location={ params.location.path } children={ routes } />
                </CookiesProvider>
            </Provider>
        );

        addTask(store.dispatch(initialize(params.data.cookies)).then(() => {
            renderToString(app);
        }));

        params.domainTasks.then(() => {
            resolve({
                html: renderToString(app),
                globals: { initialReduxState: store.getState() }
            });
        }, reject); // Also propagate any errors back into the host application 
    });
}

export default createServerRenderer(prerender);
