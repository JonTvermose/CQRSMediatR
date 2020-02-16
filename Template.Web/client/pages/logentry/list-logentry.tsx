import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import LogEntryService from "../../services/LogEntryService";

type ListLogEntryProps = {}

const HeaderDiv = styled.div`
font-size: 16px;
font-weight: bold;
border-bottom: 1px solid #a8a8a8;
`;

const ListDiv = styled.div`
font-size: 12px;
margin-top: 1rem;
`;

export const ListLogEntry: FunctionComponent<ListLogEntryProps> = () => {
    let logEntryService = new LogEntryService();

    const [isLoading, setIsLoading] = useState(false);
    const [logEntries, setLogEntries] = useState<any[]>([]);

    useEffect(() => {
        setIsLoading(true);
        logEntryService.getLogEntries()
            .then(res => res.json())
            .then(res => {
                setLogEntries(res);
                setIsLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>Log entries</h2>
            <div className="row">
                <HeaderDiv className="col-3">Type</HeaderDiv>
                <HeaderDiv className="col-3">Message</HeaderDiv>
                <HeaderDiv className="col-3">Request Path</HeaderDiv>
                <HeaderDiv className="col-3">Timestamp</HeaderDiv>                    
            </div>
            {logEntries.map((value, index) => {
                return (<div key={index} className="row">
                    <ListDiv className="col-3">{value.type}</ListDiv>
                    <ListDiv className="col-3">{value.message}</ListDiv>
                    <ListDiv className="col-3">{value.requestPath}</ListDiv>
                    <ListDiv className="col-3">{value.timeStamp}</ListDiv>  
                </div>)
            })}
            {logEntries.length === 0 && <div>No log entries found.</div>}
            <LoadingSpinner isLoading={isLoading} loadingText="Hang on. Loading log entries." />
        </div>)
}