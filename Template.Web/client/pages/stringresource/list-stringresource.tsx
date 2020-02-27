import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import StringResourceService from "../../services/StringResourceService";
import Localizer from "../../services/LocalizerService";

type ListStringResourceProps = {}

const HeaderDiv = styled.div`
font-size: 16px;
font-weight: bold;
`;

const ListDiv = styled.div`
font-size: 12px;
margin-top: 1rem;
`;

export const ListStringResource: FunctionComponent<ListStringResourceProps> = () => {
    let stringResourceService = new StringResourceService();

    const [isLoading, setIsLoading] = useState(false);
    const [resources, setResources] = useState<any[]>([]);
    const [allResources, setAllResources] = useState<any[]>([]);
    const [loadedLanguages, setLoadedLanguages] = useState<string[]>(["en-US", "da-DK"]);

    const [searchKey, setSearchKey] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [showMissing, setShowMissing] = useState(false);

    function handleAddLanguageClick() {

    }

    useEffect(() => {
        setIsLoading(true);
        stringResourceService.getStringResources(loadedLanguages)
            .then(res => res.json())
            .then(res => {
                setResources(res);
                setAllResources(res);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        handleSearchStringChange();
    }, [searchKey, searchValue, showMissing]);

    function handleSearchStringChange() {
        const searchResult = allResources
            .filter(x => searchKey.length === 0 || x.key.toLowerCase().includes(searchKey.toLowerCase()))
            .filter(x => searchValue.length === 0 || x.values !== undefined && Object.keys(x.values).some(k => x.values[k].toLowerCase().includes(searchValue.toLowerCase())))
            .filter(x => !showMissing || (showMissing && (Object.keys(x.values).length !== loadedLanguages.length || Object.keys(x.values).some(k => x.values[k].length === 0)))); 
        setResources(searchResult);
    }

    return (
        <div className="ml-5 mr-5">
            <h2>{Localizer.L("String resources")}</h2>

            <form>
                <div className="form-group row mt-2 mb-2">
                    <div className="col-sm-3">
                        <input type="text" className="form-control" onChange={(e) => setSearchKey(e.target.value)} placeholder={Localizer.L("Type filter")} value={searchKey} />
                    </div>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" onChange={(e) => setSearchValue(e.target.value)} placeholder={Localizer.L("Message filter")} value={searchValue} />
                    </div>
                    <div className="col-sm-3 pt-1">
                        <input type="checkbox" className="" onChange={(e) => setShowMissing(!showMissing)} checked={showMissing} />
                        <label className="form-check-label ml-2 noselect" onClick={(e) => setShowMissing(!showMissing)}>
                            {Localizer.L("Only show missing values")}
                        </label>
                    </div>
                </div>
            </form>

            <div className="row">
                <HeaderDiv className="col-3">{Localizer.L("Key")}</HeaderDiv>
                {loadedLanguages.map((value, index) => <HeaderDiv key={index} className="col">{value}</HeaderDiv>)}
                <HeaderDiv className="col-3">{Localizer.L("Add language")}</HeaderDiv>                   
            </div>
            {resources.map((value, index) => {
                return (<div key={index} className="row">
                    <ListDiv className="col-3">{value.key}</ListDiv>
                    {loadedLanguages.map((lang, langIndex) => <ListDiv key={langIndex} className="col">{value.values[lang]}</ListDiv>)}
                    <ListDiv className="col-3">{Localizer.L("Save")} {Localizer.L("Delete")}</ListDiv>  
                </div>)
            })}
            {resources.length === 0 && <div>{Localizer.L("No string resources found.")}</div>}
            <LoadingSpinner isLoading={isLoading} loadingText={Localizer.L("Hang on. Loading string resources.")} />
        </div>)
}