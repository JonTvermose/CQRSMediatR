import React, { FunctionComponent, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';

import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import AccountService from "../../services/AccountService";
import Localizer from "../../services/LocalizerService";

import { Defaults } from "../../models/defaults";

declare const defaults: Defaults;

type ConfirmAccountProps = {}

const SubmitButton = styled.button`
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

export const ConfirmAccount: FunctionComponent<ConfirmAccountProps> = (props: ConfirmAccountProps) => {
    let accountService = new AccountService();
    let history = useHistory();

    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);


    useEffect(() => {
        const url = new URL(window.location.href);
        const userId = url.searchParams.get("UserId");
        const code = url.searchParams.get("Code")
        setUserId(userId);
        setCode(code);
    }, []);

    function handleConfirmClick(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError(true);
            return;
        }
        setIsLoading(true);
        accountService.confirmAccount(userId, code, password)
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                if (res.success) {
                    toast.success(Localizer.L("Account confirmed"));
                    history.push("/")
                } else if (res.invalidPassword) {
                    toast.error(Localizer.L("Password does not comply with password rules"));
                } else if (res.badRequest) {
                    toast.error(Localizer.L("An error occurred. Please try again in a different browser."));
                } else {
                    toast.error(Localizer.L("An error occurred"));
                }
            });
    }

    return (
        <div className="container">
            <div className="row">
                <LoginDiv className="col mx-auto border rounded pt-5 pb-3 mt-5 card">
                    <h3 className="text-center mb-4">{defaults.projectName.toUpperCase()}</h3>
                    <form onSubmit={handleConfirmClick}>
                        <div className="form-group mb-4 ml-3 mr-3">
                            <label>{Localizer.L("New password")}</label>
                            <input type="password" className="form-control input-lg" onChange={(e) => setPassword(e.target.value)} value={password} />
                        </div>
                        <div className="form-group ml-3 mr-3">
                            <label>{Localizer.L("Confirm new password")}</label>
                            <input type="password" className="form-control input-lg" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                        </div>
                        {error &&
                            <div className="text-danger form-group ml-3 mr-3 mb-4">
                                {Localizer.L("Passwords must be identical.")}
                            </div>}
                        <div className="ml-3 mr-3 alert alert-secondary" role="alert">
                            <ul className="mb-0" style={{listStyleType: "none"}}>
                                <li><span className="text-muted">{Localizer.L("Password must be at least 10 characters")}</span></li>
                                <li><span className="text-muted">{Localizer.L("Password must contain at least 1 digit")}</span></li>
                            </ul>                           
                        </div>
                        <div className="text-center mt-5 mb-4">
                            <button type="submit" className="btn btn-primary btn-lg">{Localizer.L("Confirm account")}</button>
                        </div>
                    </form>

                </LoginDiv>
            </div>
            <LoadingSpinner isLoading={isLoading} />
        </div>)
}