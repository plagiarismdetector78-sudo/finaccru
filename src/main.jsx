import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InactivityProvider } from "./InactivityContext.jsx";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Fragment>
        <ToastContainer />
        <Provider store={store}>
            <InactivityProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </InactivityProvider>
        </Provider>
    </Fragment>
);
