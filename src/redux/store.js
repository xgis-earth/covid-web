import {createStore, combineReducers, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import {connectRouter, routerMiddleware} from "connected-react-router";
import {createBrowserHistory} from "history";

// Reducers
import globeReducer from "./reducers/globe";

// Sagas
// import * as globeSagas from "./sagas/globe";

const loggingMiddleware = (store) => {
    return (next) => {
        return (action) => {

            if (window['stagingEnv'] === 'dev') {
                const collapsed = false;
                const msg = `Action: ${action.type}`;
                if (collapsed) console.groupCollapsed(msg); else console.group(msg);
                console.log('Action:', action);
                console.log('Previous state:', store.getState());
            }

            const result = next(action);

            if (window['stagingEnv'] === 'dev') {
                console.log('New state:', store.getState());
                console.groupEnd();
            }

            return result;
        }
    }
};

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    router: connectRouter(history),
    globe: globeReducer,
});

export const store = createStore(rootReducer,
    applyMiddleware(routerMiddleware(history), loggingMiddleware, sagaMiddleware));

function runSagas(sagas) {
    for (const name in sagas) {
        if (sagas.hasOwnProperty(name)) {
            sagaMiddleware.run(sagas[name]);
        }
    }
}

// runSagas(globeSagas);
