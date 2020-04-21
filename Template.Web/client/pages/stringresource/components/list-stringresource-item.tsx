import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { toast } from 'react-toastify';

import StringResourceService from "../../../services/StringResourceService";
import Localizer from "../../../services/LocalizerService";
import { StringResourceItem } from "../../../models/string-resource"

interface ListStringResourceItemProps {
    item: StringResourceItem;
    languages: string[];
    onItemChange(item: StringResourceItem): void;
    onItemDeleted(key: string): void;
}

const ListDiv = styled.div`
font-size: 12px;
margin-top: 1rem;
`;

export const ListStringResourceItem: FunctionComponent<ListStringResourceItemProps> = (props: ListStringResourceItemProps) => {
    let stringResourceService = new StringResourceService();

    const [isLoading, setIsLoading] = useState(false);

    function handleSave(e, lang: string) {
        let element = e.target.parentNode.firstChild;
        setIsLoading(true);
        stringResourceService.updateKeyValue(props.item.key, e.target.value, lang)
            .then(res => {
                setIsLoading(false);
                if (res.ok) {
                    element.className = "visible";
                    setTimeout(function () {
                        element.className = "";
                    }, 2000);
                } else {
                    toast.error(Localizer.L("Error saving resource."));
                }
            });
    }

    function handleChange(e, lang: string) {
        let newItem = props.item;
        newItem.values[lang] = e.target.value;
        props.onItemChange(newItem);
    }

    function handleDelete() {
        var confirm = window.confirm(Localizer.L("Are you sure you want to delete this resource?"));
        if (confirm) {
            setIsLoading(true);
            stringResourceService.deleteKey(props.item.key)
                .then(res => {
                    setIsLoading(false);
                    if (res.ok) {
                        toast.success(Localizer.L("Key deleted") + ": " + props.item.key, { autoClose: 1500 });
                        props.onItemDeleted(props.item.key);
                    } else {
                        toast.error(Localizer.L("Error deleting key") + ": " + props.item.key);
                    }
                });
        }
    }

    return (
        <ListDiv className="row">
            <div className="col-xl-2 col-3">{props.item.key}</div>
            {props.languages.map(
                (lang, langIndex) =>
                    <div key={langIndex} className="col">
                        <div key={langIndex + "saved"} style={{ position: "absolute", right: "20px", color: "#26de81", fontWeight: "bold", opacity: 0 }} >Saved</div>
                        <textarea disabled={isLoading} className="form-control" onChange={(e) => handleChange(e, lang)} onBlur={(e) => handleSave(e, lang)} value={props.item.values[lang]} />
                    </div>           
            )}    
            <div className="col-1">
                <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>{Localizer.L("Delete")}</button>
            </div>
        </ListDiv>)
}