import './style/site.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './configureStore';
import * as RoutesModule from './routes';
import { CookiesProvider } from 'react-cookie';
let routes = RoutesModule.routes;

// Create browser history to use in the Redux store
// const base = document.getElementsByTagName('base')[0];
// const baseUrl = base != null ? base.getAttribute('href') : '/';
// const history = createBrowserHistory(/*{ basename: baseUrl }*/);

const base = document.getElementsByTagName('base')[0];
const baseUrl = base.getAttribute('href');
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = configureStore(history, initialState);

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.
    ReactDOM.render(
        <AppContainer>
            <Provider store={ store }>
                <CookiesProvider>
                    <ConnectedRouter history={ history } children={ routes } />
                </CookiesProvider>
            </Provider>
        </AppContainer>,
        document.getElementById('react-app')
    );
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require('./routes').routes;
        renderApp();
    });
}
