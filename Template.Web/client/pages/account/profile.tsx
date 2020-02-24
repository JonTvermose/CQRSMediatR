import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';

import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { EditProfile } from "./edit-profile";
import { ChangePassword } from "./change-password";
import { TwoFactor } from "./two-factor";



import Localizer from "../../services/LocalizerService";


type ProfileProps = {}

const ContentDiv = styled.div`
max-width: 960px;
`;

export const Profile: FunctionComponent<ProfileProps> = () => {
    const [showPage, setShowPage] = useState(ProfilePages.editProfile);

    function setPage(page: ProfilePages, e: any) {
        e.preventDefault();
        setShowPage(page);
    }

    return (
        <ContentDiv>
            <div className="row mt-6">
                <nav className="col-sm-4 sidebar">
                    <ul className="nav nav-pills flex-column ml-4">
                        <li className="nav-item">
                            <a className={"nav-link" + (showPage === ProfilePages.editProfile ? " active" : "")} href="" onClick={(e) => setPage(ProfilePages.editProfile, e)}>{Localizer.L("Manage profile")}</a>
                        </li>
                        <li className="nav-item">
                            <a className={"nav-link" + (showPage === ProfilePages.changePassword ? " active" : "")} href="" onClick={(e) => setPage(ProfilePages.changePassword, e)}>{Localizer.L("Change password")}</a>
                        </li>
                        <li className="nav-item">
                            <a className={"nav-link" + (showPage === ProfilePages.setup2Fa ? " active" : "")} href="" onClick={(e) => setPage(ProfilePages.setup2Fa, e)}>{Localizer.L("Two-factor authentication")}</a>
                        </li>
                    </ul>
                </nav>
                <div className="col-sm">
                    {showPage === ProfilePages.editProfile && <EditProfile />}
                    {showPage === ProfilePages.changePassword && <ChangePassword />}
                    {showPage === ProfilePages.setup2Fa && <TwoFactor />}
                </div>
            </div>
        </ContentDiv>)
}

enum ProfilePages {
    editProfile,
    changePassword,
    setup2Fa
}