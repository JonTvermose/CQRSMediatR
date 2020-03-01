import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';

import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import Localizer from "../../services/LocalizerService";
import LogEntryService from "../../services/LogEntryService";


type UserActivityProps = {
    
}

const HeaderDiv = styled.div`
font-size: 16px;
font-weight: bold;
`;

const ListDiv = styled.div`
font-size: 12px;
margin-top: 1rem;
`;

export const UserActivity: FunctionComponent<UserActivityProps> = () => {
    const logEntryService = new LogEntryService();

    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        setIsLoading(true);
        logEntryService.getUserActivity()
            .then(res => res.json())
            .then(res => {
                setIsLoading(false);
                setLogs(res);
            });
    }, []);    

    return (
        <div>
            <h4>{Localizer.L("User activity")}</h4>
            <hr />
            <div className="row">
                <HeaderDiv className="col-4">
                    {Localizer.L("Event type")}
                </HeaderDiv>
                <HeaderDiv className="col-4">
                    {Localizer.L("Timestamp")}
                </HeaderDiv>
                <HeaderDiv className="col-4">
                    {Localizer.L("Ip address")}
                </HeaderDiv>
            </div>
            {logs.map((value, index) =>
                <div key={index} className="row">
                    <ListDiv className="col-4">
                        {value.eventType}
                    </ListDiv>
                    <ListDiv className="col-4">
                        {value.timeStamp}
                    </ListDiv>
                    <ListDiv className="col-4">
                        {value.ipAddress}
                    </ListDiv>
                </div>)}
            {logs.length === 0 && <p>{Localizer.L("No activity found")}</p>}
            <LoadingSpinner isLoading={isLoading} />
        </div>
    )

}