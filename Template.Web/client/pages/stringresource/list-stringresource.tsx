import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';

import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { Modal } from "../../components/modal/modal";
import { ListStringResourceItem } from "./components/list-stringresource-item";

import StringResourceService from "../../services/StringResourceService";
import Localizer from "../../services/LocalizerService";

import { StringResourceItem } from "../../models/string-resource"

type ListStringResourceProps = {}

const HeaderDiv = styled.div`
font-size: 16px;
font-weight: bold;
`;

const ModalDiv = posed.div({
    open: {
        y: 0,
        opacity: 1,
        delay: 300,
        transition: {
            y: { type: 'spring', stiffness: 1000, damping: 15 },
            default: { duration: 300 }
        }
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: { duration: 150 }
    }
});

export const ListStringResource: FunctionComponent<ListStringResourceProps> = () => {
    let stringResourceService = new StringResourceService();

    const [isLoading, setIsLoading] = useState(false);
    const [resources, setResources] = useState<StringResourceItem[]>([]);
    const [allResources, setAllResources] = useState<StringResourceItem[]>([]);
    const [loadedLanguages, setLoadedLanguages] = useState<string[]>(["en-US", "da-DK"]);

    const [searchKey, setSearchKey] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [showMissing, setShowMissing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [addLanguage, setAddLanguage] = useState("");

    function handleAddLanguageClick(e) {
        e.preventDefault();
        setShowModal(true);
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

    function handleAddLoadedLanguageClick() {
        if (addLanguage.length === 5) {
            let newLanguages = loadedLanguages;
            newLanguages.push(addLanguage);
            setLoadedLanguages(newLanguages);
            setAddLanguage("");
            setShowModal(false);
        } else {
            toast.error(Localizer.L("Language codes must be exactly 5 characters (da-DK)"))
        }
    }

    return (
        <div className="ml-5 mr-5">
            <h2>{Localizer.L("String resources")}</h2>
            <Modal
                visible={showModal}
                headerText={Localizer.L("Add a language")}
                closeText={Localizer.L("Close")}
                saveText={Localizer.L("Add language")}
                onCloseClick={() => setShowModal(false)}
                onSaveClick={handleAddLoadedLanguageClick} >
                <div className="form-group">
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