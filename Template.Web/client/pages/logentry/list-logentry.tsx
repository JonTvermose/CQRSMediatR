import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { Defaults } from "../../models/defaults";

declare const defaults: Defaults;

type ListLogEntryProps = {

}

export const ListLogEntry: FunctionComponent<ListLogEntryProps> = () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>

            <LoadingSpinner isLoading={isLoading} />

        </div>)
}