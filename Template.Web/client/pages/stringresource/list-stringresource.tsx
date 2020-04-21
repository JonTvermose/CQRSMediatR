import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';
import Select from 'react-select';

import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { Modal } from "../../components/modal/modal";
import { ListStringResourceItem } from "./components/list-stringresource-item";

import StringResourceService from "../../services/StringResourceService";
import Localizer from "../../services/LocalizerService";

import { StringResourceItem } from "../../models/string-resource"

interface ListStringResourceProps {}

const HeaderDiv = styled.div`
font-size: 16px;
font-weight: bold;
`;

export const ListStringResource: FunctionComponent<ListStringResourceProps> = () => {
    let stringResourceService = new StringResourceService();

    const [isLoading, setIsLoading] = useState(false);
    const [resources, setResources] = useState<StringResourceItem[]>([]);
    const [allResources, setAllResources] = useState<StringResourceItem[]>([]);
    const [loadedLanguages, setLoadedLanguages] = useState<string[]>(["en-US"]);
    const [allLanguages, setAllLanguages] = useState<string[]>([]);
    const [availableLanguages, setAvailableLanguages] = useState<any[]>([]);

    const [searchKey, setSearchKey] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [showMissing, setShowMissing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [addLanguage, setAddLanguage] = useState("");

    useEffect(() => {
        getResources();
        stringResourceService.getLanguages()
            .then(res => res.json())
            .then(res => {
                setAllLanguages(res);
                setAvailableLanguages(res.map(x => ({ value: x, label: x })));
            });
    }, []);

    useEffect(() => {
        handleSearchStringChange();
    }, [searchKey, searchValue, showMissing, allResources]);

    function getResources() {
        setIsLoading(true);
        stringResourceService.getStringResources(loadedLanguages)
            .then(res => res.json())
            .then(res => {
                setAllResources(res);
                setIsLoading(false);
            });
    }

    function handleSearchStringChange() {
        const searchResult = allResources
            .filter(x => searchKey.length === 0 || x.key.toLowerCase().includes(searchKey.toLowerCase()))
            .filter(x => searchValue.length === 0 || x.values !== undefined && Object.keys(x.values).some(k => x.values[k].toLowerCase().includes(searchValue.toLowerCase())))
            .filter(x => !showMissing || (showMissing && (Object.keys(x.values).length !== loadedLanguages.length || Object.keys(x.values).some(k => x.values[k].length === 0))));
        setResources(searchResult);
    }

    function handleOnItemChange(item: StringResourceItem) {
        let newAllResources = allResources;
        newAllResources.find(x => x.key === item.key).values = item.values;
        setAllResources(newAllResources);
        handleSearchStringChange();
    }

    function handleOnItemDeleted(key: string) {
        let newAllResources = allResources.filter(x => x.key !== key);
        setAllResources(newAllResources);
        let newResources = resources.filter(x => x.key !== key);
        setResources(newResources);
    }

    function handleOnShowMissing() {
        setResources([]); // Bug in react? This is needed for the filter to apply properly
        setShowMissing(!showMissing);
    }

    function handleAddLanguageClick(e) {
        e.preventDefault();
        setShowModal(true);
    }

    function handleAddLoadedLanguageClick() {
        if (loadedLanguages.includes(addLanguage)) {
            toast.info(Localizer.L("Language code is already shown."));
            return;
        }
        if (addLanguage.length === 5) {
            if (addLanguage.indexOf("-") !== 2) {
                toast.error(Localizer.L("Language codes must be in format xx-XX (en-US, da-DK, etc)"));
                return;
            }
            let newLanguages = loadedLanguages;
            newLanguages.push(addLanguage);
            setLoadedLanguages(newLanguages);
            if (!allLanguages.find(x => x === addLanguage)) {
                let newAllLanguages = allLanguages;
                newAllLanguages.push(addLanguage);
                setAllLanguages(newAllLanguages);
                setAvailableLanguages(newAllLanguages.map(x => ({ value: x, label: x })));
            }
            setAddLanguage("");
            setShowModal(false);
            getResources();
        } else {
            toast.error(Localizer.L("Language codes must be exactly 5 characters (da-DK)"))
        }
    }

    function handleHideLanguage(language: string) {
        let newLoadedLanguages = loadedLanguages.filter(x => x !== language);
        setLoadedLanguages(newLoadedLanguages);
    }

    return (
        <div className="ml-5 mr-5">
            <h2>{Localizer.L("Localization")}</h2>
            <Modal
                visible={showModal}
                headerText={Localizer.L("Add a language")}
                closeText={Localizer.L("Close")}
                saveText={Localizer.L("Add language")}
                onCloseClick={() => setShowModal(false)}
                onSaveClick={handleAddLoadedLanguageClick} >
                <div className="form-group mr-3 ml-3">
                    <label>{Localizer.L("Select an existing language")}</label>
                    <Select options={availableLanguages} onChange={(e) => setAddLanguage(e.value)} />
                </div>
                <div className="form-group mr-3 ml-3">
                    <label>{Localizer.L("Create a new language")}</label>
                    <input type="text" className="form-control" onChange={(e) => setAddLanguage(e.target.value)} value={addLanguage} />
                </div>
            </Modal>

            <form>
                <div className="form-group row mt-2 mb-2">
                    <div className="col-xl-2 col-3">
                        <input type="text" className="form-control" onChange={(e) => setSearchKey(e.target.value)} placeholder={Localizer.L("Key filter")} value={searchKey} />
                    </div>
                    <div className="col">
                        <input type="text" className="form-control" onChange={(e) => setSearchValue(e.target.value)} placeholder={Localizer.L("Values filter")} value={searchValue} />
                    </div>
                    <div className="col">
                        <input type="checkbox" className="pt-1" onChange={(e) => setShowMissing(!showMissing)} checked={showMissing} />
                        <label className="form-check-label ml-2 noselect pt-1" onClick={handleOnShowMissing}>
                            {Localizer.L("Only show missing values")}
                        </label>
                    </div>
                    <div className="col-1 ml-0 mr-0 pl-0 pr-0">
                        <button className="btn btn-sm btn-outline-primary" onClick={handleAddLanguageClick}>{Localizer.L("Add language")}</button>
                    </div>
                </div>
            </form>

            <div className="row">
                <HeaderDiv className="col-xl-2 col-3">{Localizer.L("Key")}</HeaderDiv>
                {loadedLanguages.map(
                    (value, index) =>
                        <HeaderDiv key={index} className="col ml-1">
                            {value}
                            <button type="button" className="close" onClick={() => handleHideLanguage(value)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </HeaderDiv>
                )}
                <HeaderDiv className="col-1">
                </HeaderDiv>
            </div>

            {resources.map(
                (value, index) =>
                    <ListStringResourceItem key={"listItem" + index} item={value} languages={loadedLanguages} onItemChange={handleOnItemChange} onItemDeleted={handleOnItemDeleted} />
            )}

            {resources.length === 0 &&
                <div>
                    {Localizer.L("No string resources found.")}
                </div>}

            <LoadingSpinner isLoading={isLoading} loadingText={Localizer.L("Hang on. Loading string resources.")} />
        </div>)
}