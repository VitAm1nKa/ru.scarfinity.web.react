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
import {
    initialize,
    authenticateWithSocial
} from './authentication';
import { addTask, run } from 'domain-task';
// import Promise from 'bluebird';


function A() {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:50146/api/values/5')
                .then(() => { resolve({}) })
                .catch(e => { reject(e) });
        });
    }
}

function T() {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch(log('Loading start...'));
            setTimeout(() => {
                dispatch(log('Loading end...'));
                resolve({});
            }, 5000);
        });
    }
}

function longQuery(delay) {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch(log('Long query start...'));
            setTimeout(() => {
                dispatch(log('Long query end...'));
                resolve({});
            }, delay);
        });
    }
}

function log(message) {
    return (dispatch) => {
        console.error(`[Log]:: ${message}`);
        dispatch({ type: message });
    }
}

function prerender(params) {
    return new Promise((resolve, reject) => {
        console.error('------------------------ ### ##  #   [APP START]   #  ## ### ------------------------');
        // Prepare Redux store with in-memory history, and dispatch a navigation event
        // corresponding to the incoming URL
        const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
        const urlAfterBasename = params.url.substring(basename.length);
        const store = configureStore(createMemoryHistory());
        const cookies = new Cookies(params.data.cookies);
        store.dispatch(replace(urlAfterBasename));

        const routerContext = {};
            const app = (
                <Provider store={ store }>
                    <CookiesProvider cookies={cookies}>
                        <StaticRouter basename={ basename } context={ routerContext } location={ params.location.path } children={ routes } />
                    </CookiesProvider>
                </Provider>
            );

        store.dispatch(initialize(cookies.cookies, params.location))
            .then(() => {
                run(() => {
                    store.dispatch(log('------------------- PRERENDER START -------------------'));
                    renderToString(app);
                }, () => {
                    params.domainTasks.then(() => {
                        store.dispatch(log('------------------- FINAL RENDER START -------------------'));
                        resolve({
                            html: renderToString(app),
                            globals: { initialReduxState: store.getState() }
                        });
                    }, reject); // Also propagate any errors back into the host application 
                });
            });


    });
}

export default createServerRenderer(prerender);