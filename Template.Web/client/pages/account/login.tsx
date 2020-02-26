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
width: 200px;
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

    const [createAccount, setCreateAccount] = useState(false);
    const [createdAccount, setCreatedAccount] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [duplicateEmail, setDuplicateEmail] = useState(false);

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

    function handleCreateClick(e) {
        e.preventDefault();

        setIsLoading(true);
        accountService.signUp(userName, firstName, lastName)
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                if (res.success) {
                    setCreateAccount(false);
                    setCreatedAccount(true);
                } else if (res.duplicateEmail) {
                    setDuplicateEmail(true);
                } else {
                    // TODO
                    toast.error(Localizer.L("Error creating account."))
                }
            });
    }

    function handleForgotClick(e) {
        e.preventDefault();
        history.push("/forgotpassword");
    }

    return (
        <div className="container">
            <div className="row">
                <LoginDiv className="col mx-auto border rounded pt-5 pb-3 mt-5 card">
                    <h3 className="text-center mb-4">{defaults.projectName.toUpperCase()}</h3>
                    {promptTwoFactor && !createAccount && !createdAccount && <div>
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
                    {!promptTwoFactor && !createAccount && !createdAccount && <div>
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
                            <a href="" className="text-muted" onClick={handleForgotClick}><small>{Localizer.L("Forgot password?")}</small></a>
                        </div>
                        <div className="text-center mb-3">
                            <LoginButton className="btn btn-outline-secondary btn-lg" onClick={() => setCreateAccount(true)}>{Localizer.L("Create account")}</LoginButton>
                        </div>
                    </div>}
                    {createAccount &&
                        <div>
                            <form onSubmit={handleCreateClick}>
                                <div className="form-group ml-3 mr-3 mb-1">
                                    <label>{Localizer.L("Email")}</label>
                                    <input type="email" className="form-control input-lg" onChange={(e) => setUserName(e.target.value)} value={userName} />
                                </div>
                                {duplicateEmail &&
                                    <div className="text-danger form-group ml-3 mr-3">
                                        {Localizer.L("Email allready exists.")} <a href="" onClick={handleForgotClick}>{Localizer.L("Forgot password?")}</a>
                                    </div>}
                                <div className="form-group ml-3 mr-3 mt-4 mb-4">
                                    <label>{Localizer.L("First name")}</label>
                                    <input type="text" className="form-control input-lg" onChange={(e) => setFirstName(e.target.value)} value={firstName} />
                                </div>
                                <div className="form-group ml-3 mr-3 mb-5">
                                    <label>{Localizer.L("Last name")}</label>
                                    <input type="text" className="form-control input-lg" onChange={(e) => setLastName(e.target.value)} value={lastName} />
                                </div>
                                <div className="text-center mb-3">
                                    <LoginButton className="btn btn-primary btn-lg">{Localizer.L("Create account")}</LoginButton>
                                </div>
                                <div className="form-group text-center">
                                    <a href="#" className="text-muted" onClick={() => setCreateAccount(false)}><small>{Localizer.L("Go to Login")}</small></a>
                                </div>
                            </form>
                        </div>}
                    {createdAccount &&
                        <div>
                            <div className="alert alert-success" role="alert">
                                {Localizer.L("Account created! Please check your email to confirm your account and create a password.")}
                            </div>
                            <div className="text-center mb-3">
                                <LoginButton className="btn btn-primary btn-lg" onClick={() => window.location.reload()}>{Localizer.L("Ok")}</LoginButton>
                            </div>
                        </div>}

                </LoginDiv>
            </div>
            <LoadingSpinner isLoading={isLoading} />
        </div>)
}