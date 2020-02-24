import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';

import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import Localizer from "../../services/LocalizerService";
import AccountService from "../../services/AccountService";

type TwoFactorProps = {

}

export const TwoFactor: FunctionComponent<TwoFactorProps> = () => {
    const accountService = new AccountService();

    const [isLoading, setIsLoading] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [code, setCode] = useState("");

    useEffect(() => {
        setIsLoading(true);
        accountService.getUser().then(user => {
            setIsLoading(false);
            setTwoFactorEnabled(user.twoFactorEnabled);
        });
    }, []);

    function handleSaveClick(e) {
        e.preventDefault();

        setIsLoading(true);
        //accountService.changePassword(password, newPassword, email)
        //    .then(res => res.json())
        //    .then(res => {
        //        setIsLoading(false);
        //        toast.success(Localizer.L("Changes saved."));
        //    });
    };

    return (
        <div>
            <h4>{Localizer.L("Two-factor authentication")}</h4>
            <hr />
            {!twoFactorEnabled &&
                <div>
                    <p>{Localizer.L("To use an authenticator app go through the following steps:")}</p>
                <ol className="list pb-3">
                    <li>
                        <p>Download a two-factor authenticator app like Microsoft Authenticator for Windows Phone, Android and iOS or Google Authenticator for Android and iOS.</p>
                    </li>
                    <li>
                        <p>Scan the QR Code or enter this key <code>ketk kzut pwwh upfq jwi2 zrlt pe42 snvi</code> into your two factor authenticator app. Spaces and casing do not matter.</p>
                    </li>
                    </ol>
                    <hr />
                    <form onSubmit={handleSaveClick}>
                        <div className="form-group mb-4">
                            <label>{Localizer.L("Verification code")}</label>
                            <input type="text" className="form-control input-lg" onChange={(e) => setCode(e.target.value)} value={code} />
                        </div>
                        <div className="text-right mb-3 mr-3">
                            <button type="submit" className="btn btn-primary btn-lg" onClick={handleSaveClick}>{Localizer.L("Verify")}</button>
                        </div>
                    </form>
                </div>}

            <LoadingSpinner isLoading={isLoading} />
        </div>
    )

}