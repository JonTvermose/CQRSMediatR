import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';

import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import Localizer from "../../services/LocalizerService";
import AccountService from "../../services/AccountService";

type ChangePasswordProps = {
    
}

export const ChangePassword: FunctionComponent<ChangePasswordProps> = () => {
    const accountService = new AccountService();

    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");


    useEffect(() => {
        setIsLoading(true);
        accountService.getUser().then(user => {
            setEmail(user.email);
            setIsLoading(false);
        });
    }, []);

    function handleSaveClick(e) {
        e.preventDefault();
        if (newPassword != confirmPassword) {
            toast.error(Localizer.L("New password and confirm password does not match."));
            return;
        }
        setIsLoading(true);
        accountService.changePassword(password, newPassword, email)
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                setPassword("");
                setNewPassword("");
                setConfirmPassword("");
                if (res.hasChanged) {
                    toast.success(Localizer.L("Password changed."));
                } else {
                    toast.error(Localizer.L("Error changing password."));
                }
            });
    };

    return (
        <div>
            <h4>{Localizer.L("Change password")}</h4>
            <hr />
            <form onSubmit={handleSaveClick}>
                <div className="form-group mb-4">
                    <label>{Localizer.L("Current password")}</label>
                    <input type="password" className="form-control input-lg" onChange={(e) => setPassword(e.target.value)} value={password} />
                </div>
                <div className="form-group mb-4">
                    <label>{Localizer.L("New password")}</label>
                    <input type="password" className="form-control input-lg" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
                </div>
                <div className="form-group mb-4">
                    <label>{Localizer.L("Confirm new password")}</label>
                    <input type="password" className="form-control input-lg" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                </div>
                <div className="text-right mb-3 mr-3">
                    <button type="submit" className="btn btn-primary btn-lg" onClick={handleSaveClick}>{Localizer.L("Save")}</button>
                </div>
            </form>
            <LoadingSpinner isLoading={isLoading} />
        </div>
    )

}