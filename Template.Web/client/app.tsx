import React, { useEffect } from 'react';
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app.css';
import './custom.scss';

import ErrorBounday from "./components/error-boundary/error-boundary";

import { Defaults } from "./models/defaults";

import { Home } from "./pages/home";
import { ListLogEntry } from "./pages/logentry/list-logentry";
import { Login } from "./pages/account/login";
import { ForgotPassword } from "./pages/account/forgot-password";

declare const defaults: Defaults;
declare const isAuthenticated: any;
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
        <ErrorBounday>
            <Router>
                <header>
                    <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                        <div className="container">
                            <a className="navbar-brand">
                                {defaults.projectName}
                            </a>
                            {window.location.pathname !== "/" &&
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>}
                            {window.location.pathname !== "/" && 
                                <div className="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
                                    <ul className="navbar-nav flex-grow-1">
                                        <li className="nav-item">
                                            <Link to="/" className="nav-link text-dark">Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/logentries" className="nav-link text-dark">Log entries</Link>
                                        </li>
                                    </ul>
                                </div>}
                        </div>
                    </nav>
                </header>
                <div className="container">
                    <main role="main" className="pb-3">
                        <div className="App">
                            <Switch>
                                <Route exact path="/" component={Login} />
                                <Route exact path="/forgotpassword" component={ForgotPassword} />
                                <Route exact path="/home" render={() => isAuthenticated === true ? <Home /> : <Redirect to="/" />} />
                                <Route exact path="/logentries" render={() => isAuthenticated === true ? <ListLogEntry /> : <Redirect to="/" />} />
                            </Switch>
                        </div>
                    </main>
                </div>
                <ToastContainer autoClose={8000} position={toast.POSITION.TOP_RIGHT} />
            </Router>
        </ErrorBounday>

    );
}

export default App;
