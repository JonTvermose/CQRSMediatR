import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';


import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import Localizer from "../../services/LocalizerService";
import AccountService from "../../services/AccountService";

type EditProfileProps = {}


export const EditProfile: FunctionComponent<EditProfileProps> = () => {
    const accountService = new AccountService();

    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        setIsLoading(true);
        accountService.getUser().then(user => {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setIsLoading(false);
        });
    }, []);

    function handleSaveClick(e) {
        e.preventDefault();
        setIsLoading(true);
        accountService.editProfile(email, firstName, lastName)
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                toast.success(Localizer.L("Changes saved."));
            });
    };

    return (
        <div>
            <h4>{Localizer.L("Manage profile")}</h4>
            <hr />
            <form onSubmit={handleSaveClick}>
                <div className="form-group mb-4">
                    <label>{Localizer.L("First name")}</label>
                    <input type="text" className="form-control input-lg" onChange={(e) => setFirstName(e.target.value)} value={firstName} />
                </div>
                <div className="form-group mb-4">
                    <label>{Localizer.L("Last name")}</label>
                    <input type="text" className="form-control input-lg" onChange={(e) => setLastName(e.target.value)} value={lastName} />
                </div>
                <div className="form-group mb-4">
                    <label>{Localizer.L("Email")}</label>
                    <input type="text" className="form-control" readOnly value={email} />
                </div>
                <div className="text-right mb-3 mr-3">
                    <button type="submit" className="btn btn-primary btn-lg" onClick={handleSaveClick}>{Localizer.L("Save")}</button>
                </div>
            </form>
            <LoadingSpinner isLoading={isLoading} loadingText={Localizer.L("Saving profile...")} />
        </div>
    )

}