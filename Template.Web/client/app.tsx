import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app.css';
import './custom.scss';

import ErrorBounday from "./components/error-boundary/error-boundary";
import { PrivateRoute } from "./components/private-route/private-route";

import { Home } from "./pages/home";
import { ListLogEntry } from "./pages/logentry/list-logentry";
import { Login } from "./pages/account/login";
import { ForgotPassword } from "./pages/account/forgot-password";
import { Profile } from "./pages/account/profile";
import { ConfirmAccount } from "./pages/account/confirm-account";
import { Counter } from "./boilerplates/functional-component";


import { ListStringResource } from "./pages/stringresource/list-stringresource";


declare const successMessage: string;
declare const errorMessage: string;
declare const infoMessage: string;

const App: React.FC = () => {

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
        }
        if (errorMessage) {
            toast.error(errorMessage);
        }
        if (infoMessage) {
            toast.error(infoMessage);
        }
    }, []);

    return (
        <div className="app">
            <ErrorBounday>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route exact path="/forgotpassword" component={ForgotPassword} />
                        <Route path="/account/confirmaccount" component={ConfirmAccount} />

                        <PrivateRoute exact path="/home" component={Home} />
                        <PrivateRoute exact path="/logentries" component={ListLogEntry} />
                        <PrivateRoute path="/profile" component={Profile} />
                        <PrivateRoute path="/counter" component={Counter} />
                        <PrivateRoute pattern="/stringresources" component={ListStringResource} />
                    </Switch>
                    <ToastContainer autoClose={8000} position={toast.POSITION.BOTTOM_CENTER} />
                </Router>
            </ErrorBounday>
        </div>
    );
}

export default App;
