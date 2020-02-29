import React, { FunctionComponent } from 'react';
import AccountService from '../../services/AccountService'
import { Redirect, Route } from 'react-router-dom'
import { Navbar } from "../../pages/navbar";

interface PrivateRouteProps {
    component: any;
    hideNavbar?: boolean;
}

export const PrivateRoute: FunctionComponent<any> = ({ component: Component, boolean: hideNavbar, ...rest }) => {
    const accountService = new AccountService();
    const isLoggedIn = accountService.isLoggedIn()
    return (<Route {...rest} render={() => isLoggedIn ? (<PrivateRouteRender component={Component} hideNavbar={rest.hideNavbar} />) : <Redirect to="/" />} />)
}

const PrivateRouteRender: FunctionComponent<PrivateRouteProps> = ({ component: Component, hideNavbar }) => {
    return (
        <div>
            {!hideNavbar &&
                <div>
                    <Navbar />
                        <main role="main" className="pb-3">
                            <div className="App">
                                <Component />
                            </div>
                        </main>
                </div>}
            {hideNavbar &&
                <Component />
            }
        </div>
    )
}
