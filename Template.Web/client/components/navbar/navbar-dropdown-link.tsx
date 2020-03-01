import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { Link } from "react-router-dom";

import Localizer from "../../services/LocalizerService";

type NavbarDropdownLinkProps = {
    text: string;
    path: string;
}

export const NavbarDropdownLink: FunctionComponent<NavbarDropdownLinkProps> = (props) => {

    return (
        <Link to={props.path} className={"pl-4 nav-link dropdown-link" + (window.location.pathname === props.path ? " active" : "")}>{props.text}</Link>
    )
}