import React, { FunctionComponent } from 'react';
import AccountService from '../../services/AccountService'
import { Redirect, Route } from 'react-router-dom'
import { Navbar } from "../../pages/navbar";

export const PrivateRoute: FunctionComponent<any> = ({ component: Component, ...rest }) => {
    const isLoggedIn = AccountService.isLoggedIn()

    return (<Route {...rest} render={() => isLoggedIn ? (<PrivateRouteWithNavbar component={Component}/>) : <Redirect to="/" />} />)
}

const PrivateRouteWithNavbar: FunctionComponent<any> = ({ component: Component}) => {
    return (
        <div>
            <Navbar />
            <div className="container">
                <main role="main" className="pb-3">
                    <div className="App">
                        <Component />
                    </div>
                </main>
            </div>
        </div>
    )
}
