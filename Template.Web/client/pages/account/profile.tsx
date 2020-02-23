import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';


import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import Localizer from "../../services/LocalizerService";
import AccountService from "../../services/AccountService";

type ProfileProps = {}

const ContentDiv = styled.div`
max-width: 960px;
`;


export const Profile: FunctionComponent<ProfileProps> = () => {
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

    function handleSaveClick() {
        setIsLoading(true);
        accountService.editProfile(email, firstName, lastName)
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                toast.success(Localizer.L("Changes saved."));
            });
    };

    return (
        <ContentDiv>
            <div className="row mt-6">
                <nav className="col-sm-4 sidebar">
                    <ul className="nav nav-pills flex-column ml-4">
                        <li className="nav-item">
                            <a className="nav-link active" href="">{Localizer.L("Manage profile")}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="">{Localizer.L("Change password")}</a>
                        </li>
                    </ul>
                </nav>
                <div className="col-sm">
                    <h4>{Localizer.L("Manage profile")}</h4>
                    <hr/>
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
                            <label className="form-control input-lg">{email}</label>
                        </div>
                        <div className="text-right mb-3 mr-3">
                            <button type="submit" className="btn btn-primary btn-lg" onClick={handleSaveClick}>{Localizer.L("Save")}</button>
                        </div>
                    </form>
                </div>

            </div>

            <LoadingSpinner isLoading={isLoading} loadingText={Localizer.L("Hang on. Loading log entries.")} />
        </ContentDiv>)
}