import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import posed, { PoseGroup } from 'react-pose';
import { Link } from "react-router-dom";
import { NavbarDropdownLink } from "./navbar-dropdown-link";

type NavbarDropdownProps = {
    text: string;
    links: any[];
}

const DropdownDiv = posed.div({
    enter: {
        y: 0,
        scale: 1,
        opacity: 1,
        delay: 0,
        transition: { duration: 150 }
    },
    exit: {
        y: -80,
        scale: 0,
        opacity: 0,
        transition: { duration: 500 }
    }
});

export const NavbarDropdown: FunctionComponent<NavbarDropdownProps> = (props) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [hasListener, setHasListener] = useState(false);

    function handleOnClick(e) {
        e.preventDefault();
        setShowDropdown(true);

        if (!hasListener) {
            setHasListener(true);
            setTimeout(function () {
                window.addEventListener("click", handleDocumentClick);
            }, 10);
        }
        return false;
    }

    function handleDocumentClick(event) {
        event.preventDefault();
        setShowDropdown(false);
        window.removeEventListener("click", handleDocumentClick);
        setHasListener(false);
    }

    return (
        <li id={"dropdown_" + props.text} className={"nav-item" + (props.links.some(x => x.path === window.location.pathname) ? " active" : "")} >
            <a href="" className="nav-link dropdown-toggle" onClick={handleOnClick}>{props.text}</a>
            <PoseGroup>
                {showDropdown &&
                    <DropdownDiv key="dropdown" className="dropdown-menu">
                        {props.links.map((val, index) => <NavbarDropdownLink key={index} path={val.path} text={val.text} />)}
                    </DropdownDiv>
                }
            </PoseGroup>
        </li>
    )
}