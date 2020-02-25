import React, { FunctionComponent, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';

import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import AccountService from "../../services/AccountService";
import Localizer from "../../services/LocalizerService";

import { Defaults } from "../../models/defaults";
import { User } from "../../models/user";

declare var isAuthenticated: any;
declare const defaults: Defaults;

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
    const [promptTwoFactor, setPromptTwoFactor] = useState(false);

    const [invalidUserPass, setInvalidUserPass] = useState(false);
    const [lockedOut, setLockedOut] = useState(false);
    const [invalid2Fa, setInvalid2Fa] = useState(false);

    //useEffect(() => {
    //    // Submit when pressing enter
    //    const listener = event => {
    //        if (event.code === "Enter" || event.code === "NumpadEnter") {
    //            handleLoginClick();
    //        }
    //    };
    //    document.addEventListener("keydown", listener);
    //    return () => {
    //        document.removeEventListener("keydown", listener);
    //    };
    //}, []);

    function handleLoginClick(e) {
        e.preventDefault();
        setIsLoading(true);

        accountService.login(userName, password, rememberMe)
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                if (res.isAuthenticated) {
                    accountService.setUser(res.currentUser);
                    setIsLoading(true);
                    accountService.refreshToken()
                        .then(res => {
                            setIsLoading(false);
                            if (res.ok === true) {
                                isAuthenticated = true;
                                history.push("/home");
                            } else {
                                toast.error("Server Error while logging in.");
                            }
                        });
                } else if (res.requiresTwoFactor) {
                    setPromptTwoFactor(true);
                } else if (res.isInvalidAttempt) {
                    setInvalidUserPass(true);
                } else if (res.isLockedOut) {
                    setLockedOut(true);
                }
            });
    }

    function handle2faLoginClick(e) {
        e.preventDefault();
        setIsLoading(true);
        accountService.login2Fa(twoFactor, rememberMe)
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                if (res.isAuthenticated) {
                    accountService.setUser(res.currentUser);
                    setIsLoading(true);
                    accountService.refreshToken()
                        .then(res => {
                            setIsLoading(false);
                            if (res.ok === true) {
                                isAuthenticated = true;
                                history.push("/home");
                            } else {
                                toast.error("Server Error while logging in.");
                            }
                        });
                } else if (res.isLockedOut) {
                    setLockedOut(true);
                } else if (res.isInvalid2Fa) {
                    setInvalid2Fa(true);
                }
            });
    }

    if (isAuthenticated == "true") {
        history.push("/home");
    }

    return (
        <div>
            <div className="row">
                <LoginDiv className="col mx-auto border rounded pt-5 pb-3 mt-5 card">
                    <h3 className="text-center mb-4">{defaults.projectName.toUpperCase()}</h3>
                    {promptTwoFactor && <div>
                        <form onSubmit={handle2faLoginClick}>
                            <div className="form-group ml-3 mr-3 mb-4">
                                <label>{Localizer.L("Two-factor code")}</label>
                                <input type="text" className="form-control input-lg" onChange={(e) => setTwoFactor(e.target.value)} value={twoFactor} />
                            </div>
                            {invalid2Fa &&
                                <div className="text-danger form-group ml-3 mr-3 mb-4">
                                    {Localizer.L("Login failed. Incorrect two factor code.")}
                                </div>}
                            {lockedOut &&
                                <div className="text-danger form-group ml-3 mr-3 mb-4">
                                    {Localizer.L("Account has been locked. Use the forgot password functionality to unlock.")}
                                </div>}
                            <div className="text-center mb-3">
                                <LoginButton type="submit" className="btn btn-primary btn-lg">{Localizer.L("Login")}</LoginButton>
                            </div>
                        </form>
                    </div>}
                    {!promptTwoFactor && <div>
                        <form onSubmit={handleLoginClick}>
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
                                <LoginButton className="btn btn-primary btn-lg">{Localizer.L("Login")}</LoginButton>
                            </div>
                        </form>
                        <div className="form-group text-center">
                            <a href="#" className="text-muted" onClick={() => history.push("/forgotpassword")}><small>{Localizer.L("Forgot password?")}</small></a>
                        </div>
                    </div>}

                </LoginDiv>
            </div>
            <LoadingSpinner isLoading={isLoading} />
        </div>)
}