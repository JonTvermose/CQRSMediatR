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

type ForgotPasswordProps = {}

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

export const ForgotPassword: FunctionComponent<ForgotPasswordProps> = (props: ForgotPasswordProps) => {
    let accountService = new AccountService();
    let history = useHistory();

    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [emailSend, setEmailSend] = useState(false);

    function handleSendMailClick() {
        setIsLoading(true);
        accountService.forgotPassword(userName)
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                if (res.emailSend) {
                    setEmailSend(true);
                } else {
                    setInvalidEmail(true);
                }
            });
    }

    return (
        <div className="container">
            <div className="row">
                <LoginDiv className="col mx-auto border rounded pt-5 pb-3 mt-5 card">
                    <h3 className="text-center mb-4">{defaults.projectName.toUpperCase()}</h3>
                    {!emailSend &&
                        <div>
                            <div className="form-group ml-3 mr-3 mb-1">
                                <label>{Localizer.L("Email")}</label>
                                <input type="email" className="form-control input-lg" onChange={(e) => setUserName(e.target.value)} value={userName} />
                            </div>
                            {invalidEmail &&
                                <div className="text-danger form-group ml-3 mr-3">
                                    {Localizer.L("Email not found.")}
                                </div>}
                            <div className="text-center mt-4 mb-3">
                                <SubmitButton className="btn btn-primary btn-lg" onClick={handleSendMailClick}>{Localizer.L("Send email")}</SubmitButton>
                            </div>
                        </div>}
                    {emailSend &&
                        <div className="text-success form-group ml-3 mr-3 mb-4">
                            {Localizer.L("An email was send to you with a password reset link.")}
                        </div>}
                    <div className="form-group text-center">
                        <a href="#" className="text-muted" onClick={() => history.push("/")}><small>{Localizer.L("Go to Login")}</small></a>
                    </div>
                </LoginDiv>
            </div>
            <LoadingSpinner isLoading={isLoading} />
        </div>)
}