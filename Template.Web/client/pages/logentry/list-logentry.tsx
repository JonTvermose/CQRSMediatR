import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import LogEntryService from "../../services/LogEntryService";
import Localizer from "../../services/LocalizerService";

type ListLogEntryProps = {}

const HeaderDiv = styled.div`
font-size: 16px;
font-weight: bold;
`;

const ListDiv = styled.div`
font-size: 12px;
margin-top: 1rem;
word-break: break-all;
`;

export const ListLogEntry: FunctionComponent<ListLogEntryProps> = () => {
    let logEntryService = new LogEntryService();

    const [isLoading, setIsLoading] = useState(false);
    const [logEntries, setLogEntries] = useState<any[]>([]);
    const [allLogEntries, setAllLogEntries] = useState<any[]>([]);

    const [searchType, setSearchType] = useState("");
    const [searchMessage, setSearchMessage] = useState("");
    const [searchPath, setSearchPath] = useState("");
    const [searchTime, setSearchTime] = useState("");

    useEffect(() => {
        setIsLoading(true);
        logEntryService.getLogEntries()
            .then(res => res.json())
            .then(res => {
                setLogEntries(res);
                setAllLogEntries(res);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        handleSearchStringChange();
    }, [searchMessage, searchType, searchPath, searchTime]);

    function handleSearchStringChange() {
        const searchResult = allLogEntries
            .filter(x => searchType.length === 0 || x.type.toLowerCase().includes(searchType.toLowerCase()))
            .filter(x => searchMessage.length === 0 || x.message.toLowerCase().includes(searchMessage.toLowerCase()))
            .filter(x => searchPath.length === 0 || x.requestPath.toLowerCase().includes(searchPath.toLowerCase()))
            .filter(x => searchTime.length === 0 || x.timeStamp.toLowerCase().includes(searchTime.toLowerCase()));

        setLogEntries(searchResult);
    }

    return (
        <div className="container">
            <h2>{Localizer.L("Log entries")}</h2>

            <div className="row">
                <HeaderDiv className="col-3">{Localizer.L("Type")}</HeaderDiv>
                <HeaderDiv className="col-3">{Localizer.L("Message")}</HeaderDiv>
                <HeaderDiv className="col-3">{Localizer.L("Request path")}</HeaderDiv>
                <HeaderDiv className="col-3">{Localizer.L("Timestamp")}</HeaderDiv>                    
            </div>
            <form>
                <div className="form-group row mt-2 mb-2">
                    <div className="col-sm-3">
                        <input type="text" className="form-control" onChange={(e) => setSearchType(e.target.value)} placeholder={Localizer.L("Type filter")} value={searchType} />
                    </div>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" onChange={(e) => setSearchMessage(e.target.value)} placeholder={Localizer.L("Message filter")} value={searchMessage} />
                    </div>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" onChange={(e) => setSearchPath(e.target.value)} placeholder={Localizer.L("Path filter")} value={searchPath} />
                    </div>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" onChange={(e) => setSearchTime(e.target.value)} placeholder={Localizer.L("Timestamp filter")} value={searchTime} />
                    </div>
                </div>
            </form>
            {logEntries.map((value, index) => {
                return (<div key={index} className="row">
                    <ListDiv className="col-3">{value.type}</ListDiv>
                    <ListDiv className="col-3">{value.message}</ListDiv>
                    <ListDiv className="col-3">{value.requestPath}</ListDiv>
                    <ListDiv className="col-3">{value.timeStamp}</ListDiv>  
                </div>)
            })}
            {logEntries.length === 0 && <div>{Localizer.L("No log entries found.")}</div>}
            <LoadingSpinner isLoading={isLoading} loadingText={Localizer.L("Hang on. Loading log entries.")} />
        </div>)
}