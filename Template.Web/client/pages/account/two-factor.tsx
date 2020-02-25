import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';
import * as QRCode from 'qrcode.react';
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
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [authenticatorUrl, setAuthenticatorUrl] = useState("");
    const [sharedKey, setSharedkey] = useState("");


    useEffect(() => {
        loadSetup();
    }, []);

    function loadSetup() {
        setIsLoading(true);
        accountService.getUser().then(user => {
            setTwoFactorEnabled(user.twoFactorEnabled);
            if (!user.twoFactorEnabled) {
                accountService.getAuthenticatorUrl()
                    .then(res => res.json())
                    .then(res => {
                        setIsLoading(false);
                        setAuthenticatorUrl(res.authenticatorUri);
                        setSharedkey(res.sharedKey);
                    });
            } else {
                setIsLoading(false);
            }
        });
    }

    function handleSaveClick(e) {
        e.preventDefault();

        setIsLoading(true);
        accountService.enableAuthenticator(code)
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                if (res.success) {
                    toast.success(Localizer.L("Authenticator added."));
                    setRecoveryCodes(res.recoveryCodes);
                    setTwoFactorEnabled(true);
                } else {
                    toast.error(Localizer.L("Error adding authenticator app."));
                    setCode("");
                }
            });
    };

    function handleResetClick() {
        setIsLoading(true);
        accountService.resetAuthenticator().then(res => {
            setIsLoading(false);
            if (res.ok) {
                setTwoFactorEnabled(false);
                setRecoveryCodes([]);
                setCode("");
                setAuthenticatorUrl("");
                setSharedkey("");
                loadSetup();
                toast.success(Localizer.L("Authenticator key reset. Two-factor authentication disabled."));
            } else {
                toast.error(Localizer.L("An error occurred."));
            }
        })
    }

    return (
        <div>
            <h4>{Localizer.L("Two-factor authentication")}</h4>
            <hr />
            {twoFactorEnabled === false &&
                <div>
                    <p>{Localizer.L("To use an authenticator app go through the following steps:")}</p>
                    <ol className="list pb-3">
                        <li>
                            <p>{Localizer.L("Download a two-factor authenticator app like Microsoft Authenticator for")} Windows Phone, Android {Localizer.L("and")} iOS {Localizer.L("or")} Google Authenticator {Localizer.L("for")} Android {Localizer.L("and")} iOS.</p>
                        </li>
                        <li>
                            <p>{Localizer.L("Scan the QR Code or enter this key")} <code>{sharedKey}</code> {Localizer.L("into your two factor authenticator app. Spaces and casing do not matter.")}</p>
                            <div className="mt-3 mb-3 text-center mr-5">
                                <QRCode value={authenticatorUrl} size={200} />
                            </div>
                        </li>
                        <li>
                            <p>{Localizer.L("Once you have scanned the QR code or input the key above, your two factor authentication app will provide you with a unique code. Enter the code in the confirmation box below.")}</p>
                        </li>
                    </ol>
                    <hr />
                    <form onSubmit={handleSaveClick}>
                        <div className="form-group mb-4">
                            <label><b>{Localizer.L("Verification code")}</b></label>
                            <input type="text" className="form-control" onChange={(e) => setCode(e.target.value)} value={code} />
                        </div>
                        <div className="text-right mb-3 mr-3">
                            <button type="submit" className="btn btn-primary btn-lg" onClick={handleSaveClick}>{Localizer.L("Verify")}</button>
                        </div>
                    </form>
                </div>}
            {twoFactorEnabled &&
                <div>
                    <div className="alert alert-success" role="alert">
                        {Localizer.L("Two-factor authentication is enabled for your account.")}
                    </div>
                    {recoveryCodes.length !== 0 &&
                        <div>
                            <div className="alert alert-warning" role="alert">
                                {Localizer.L("Please write down the following recovery codes.")}
                                <ul className="list list-unstyled pl-3">
                                    {recoveryCodes.map((value, index) => <li key={index}><code>{value}</code></li>)}
                                </ul>
                            </div>

                        </div>}
                <div className="text-right">
                    <button className="btn btn-outline-danger btn-lg mt-5" onClick={handleResetClick}> { Localizer.L("Reset authenticator key") }</button>
                    </div>
                </div>}

            <LoadingSpinner isLoading={isLoading} />
        </div>
    )

}