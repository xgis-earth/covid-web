import "core-js/stable";
import "regenerator-runtime/runtime";
import "bootstrap";
import React from "react";
import ReactDOM from "react-dom";
import {Provider as ReduxProvider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";
import {history, store} from "./redux/store";
import App from "./components/App";

ReactDOM.render(
    <ReduxProvider store={store}>
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </ReduxProvider>,
    document.getElementById('root'));
