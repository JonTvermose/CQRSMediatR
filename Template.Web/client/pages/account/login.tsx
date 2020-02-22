import React, { FunctionComponent, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import posed from 'react-pose';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import AccountService from "../../services/AccountService";
import Localizer from "../../services/LocalizerService";

import { Defaults } from "../../models/defaults";

declare var isAuthenticated: any;
declare const defaults: Defaults;
declare const successMessage: any;


type LoginProps = {}

const LoginButton = styled.button`
border-radius: 25px;
width: 150px;
`;

const LoginDiv = styled.div`
max-width: 30rem;
-webkit-user-select: none; /* Safari */        
-moz-user-select: none; /* Firefox */
-ms-user-select: none; /* IE10+/Edge */
user-select: none; /* Standard */
`;

export const Login: FunctionComponent<LoginProps> = (props: LoginProps) => {
    let accountService = new AccountService();
    let history = useHistory();

    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [twoFactor, setTwoFactor] = useState("");

    const [rememberMe, setRememberMe] = useState(false);
    const [invalidUserPass, setInvalidUserPass] = useState(false);
    const [lockedOut, setLockedOut] = useState(false);
    const [invalid2Fa, setInvalid2Fa] = useState(false);

    console.log(successMessage);

    function handleLoginClick() {
        setIsLoading(true);
        accountService.login(userName, password, rememberMe)
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                if (res.isAuthenticated) {
                    isAuthenticated = true;
                    history.push("/home");
                } else if (res.requiresTwoFactor) {
                    // TODO two factor
                } else if (res.isInvalidAttempt) {
                    setInvalidUserPass(true);
                } else if (res.isLockedOut) {
                    setLockedOut(true);
                } 
            });
    }

    //function handle2faLoginClick() {
    //    setIsLoading(true);
    //    accountService.login2Fa(twoFactor)
    //        .then(res => res.json())
    //        .then(res => {
    //            setIsLoading(false);
    //            if (res.isAuthenticated) {
    //                isAuthenticated = true;
    //                history.push("/home");
    //            } else if (res.isLockedOut) {
    //                setLockedOut(true);
    //            } else if (res.isInvalid2Fa) {
    //                setInvalid2Fa(true);
    //            }
    //        });
    //}

    if (isAuthenticated == "true") {
        history.push("/home");
    }

    return (
        <div>
            <div className="row">
                <LoginDiv className="col mx-auto border rounded pt-5 pb-3 mt-5 card">
                    <h3 className="text-center mb-4">{defaults.projectName.toUpperCase()}</h3>
                    <div className="form-group ml-3 mr-3 mb-4">
                        <label>{Localizer.L("Email")}</label>
                        <input type="email" className="form-control input-lg" onChange={(e) => setUserName(e.target.value)} value={userName} />
                    </div>
                    <div className="form-group ml-3 mr-3 mb-4">
                        <label>{Localizer.L("Password")}</label>
                        <input type="password" className="form-control input-lg" onChange={(e) => setPassword(e.target.value)} value={password} />
                    </div>
                    {invalidUserPass &&
                        <div className="text-danger form-group ml-3 mr-3 mb-4">
                            {Localizer.L("Login failed. Incorrect username or password.")}                            
                        </div>}
                    {lockedOut &&
                        <div className="text-danger form-group ml-3 mr-3 mb-4">
                            {Localizer.L("Account has been locked. Use the forgot password functionality to unlock.")}
                        </div>}
                    <div className="form-group ml-3 mr-3 mb-4" onClick={() => setRememberMe(!rememberMe)}>
                        <input type="checkbox" className="mr-1" checked={rememberMe} readOnly />
                        <label className="form-check-label">{Localizer.L("Remember me")}</label>
                    </div>
                    <div className="text-center mb-3">
                        <LoginButton className="btn btn-primary btn-lg" onClick={handleLoginClick}>{Localizer.L("Login")}</LoginButton>
                    </div>
                    <div className="form-group text-center">
                        <a href="#" className="text-muted" onClick={() => history.push("/forgotpassword")}><small>{Localizer.L("Forgot password?")}</small></a>
                    </div>
                </LoginDiv>
            </div>
            <LoadingSpinner isLoading={isLoading} />
        </div>)
}