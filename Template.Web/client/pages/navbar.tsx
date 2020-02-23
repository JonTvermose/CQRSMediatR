import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { Link } from "react-router-dom";

import Localizer from "../services/LocalizerService";
import AccountService from "../services/AccountService";
import { Defaults } from "../models/defaults";

declare const defaults: Defaults;

type NavbarProps = {}

export const Navbar: FunctionComponent<NavbarProps> = () => {
    let isAuthenticated = AccountService.isLoggedIn();

    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container">
                    <a className="navbar-brand" href="">
                        {defaults.projectName}
                    </a>
                    {isAuthenticated &&
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>}
                    {isAuthenticated &&
                        <div className="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
                            <ul className="navbar-nav flex-grow-1">
                                <li className="nav-item">
                                    <Link to="/home" className="nav-link text-dark">{Localizer.L("Home")}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/logentries" className="nav-link text-dark">{Localizer.L("Log entries")}</Link>
                                </li>
                            </ul>
                        </div>}
                </div>
            </nav>
        </header>)
}