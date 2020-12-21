import "core-js/stable";
import "regenerator-runtime/runtime";
import "bootstrap";
import React from "react";
import ReactDOM from "react-dom";
import {Provider as ReduxProvider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";
import {ScrollManager, WindowScroller} from "react-scroll-manager";
import {history, store} from "./redux/store";
import App from "./components/App";

ReactDOM.render(
    <ScrollManager history={history}>
        <ReduxProvider store={store}>
            <ConnectedRouter history={history}>
                <WindowScroller>
                    <App/>
                </WindowScroller>
            </ConnectedRouter>
        </ReduxProvider>
    </ScrollManager>,
    document.getElementById('root'));
