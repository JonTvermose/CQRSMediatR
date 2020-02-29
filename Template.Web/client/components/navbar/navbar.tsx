import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { NavbarDropdown } from "./navbar-dropdown";


import Localizer from "../../services/LocalizerService";
import AccountService from "../../services/AccountService";
import { Defaults } from "../../models/defaults";

declare const defaults: Defaults;

type NavbarProps = {}

export const Navbar: FunctionComponent<NavbarProps> = () => {
    const accountService = new AccountService();

    const [isLoading, setIsLoading] = useState(false);

    function handleOnLogoutClick(e) {
        e.preventDefault();
        setIsLoading(true);
        accountService.logout();
    }

    const administrationDropdowns = [
        { path: "/stringresources", text: Localizer.L("Localization") },
        { path: "/logentries", text: Localizer.L("Log entries") }];
    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="order-0 mr-5">
                    <a className="navbar-brand mx-auto" href="#">{defaults.projectName}</a>
                </div>
                <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                    <ul className="navbar-nav mr-auto">
                        <li className={"nav-item" + (window.location.pathname == "/home" ? " active" : "")}>
                            <Link to="/home" className="nav-link">{Localizer.L("Home")}</Link>
                        </li>
                    </ul>
                </div>

                <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                    <ul className="navbar-nav ml-auto">
                        <NavbarDropdown text={Localizer.L("Administration")} links={administrationDropdowns} />

                        <li className={"nav-item" + (window.location.pathname.startsWith("/profile") ? " active" : "")}>
                            <Link to="/profile" className="nav-link">
                                {Localizer.L("Profile")}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a href="/logout" className="nav-link" onClick={handleOnLogoutClick}>{Localizer.L("Logout")}</a>
                        </li>
                    </ul>

                </div>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </nav>
            <LoadingSpinner isLoading={isLoading} loadingText={Localizer.L("Please wait. Logging out...")} />
        </header>)
}