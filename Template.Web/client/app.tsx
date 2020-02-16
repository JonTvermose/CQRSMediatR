import * as React from 'react';
import { Route, Link, BrowserRouter as Router, Switch, useHistory } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import './app.css';
import './custom.scss';

import ErrorBounday from "./components/error-boundary/error-boundary";

import { Defaults } from "./models/defaults";

import { Home } from "./pages/home";
import { ListLogEntry } from "./pages/logentry/list-logentry";

declare const defaults: Defaults;

const App: React.FC = () => {

    return (
        <ErrorBounday>
            <Router>
                <header>
                    <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                        <div className="container">
                            <a className="navbar-brand">
                                {defaults.projectName}
                            </a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
                                <ul className="navbar-nav flex-grow-1">
                                    <li className="nav-item">
                                        <Link to="/" className="nav-link text-dark">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/logentries" className="nav-link text-dark">Log entries</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </header>
                <div className="container">
                    <main role="main" className="pb-3">
                        <div className="App">
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/logentries" component={ListLogEntry} />
                            </Switch>
                        </div>
                    </main>
                </div>
                <ToastContainer />
            </Router>
        </ErrorBounday>

    );
}

export default App;
