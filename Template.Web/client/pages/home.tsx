import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { LoadingSpinner } from "../components/loading-spinner/loading-spinner";
import Localizer from "../services/LocalizerService";

type HomeProps = {

}

export const Home: FunctionComponent<HomeProps> = () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            <h2>ASP.NET Core <small>| CQRS | MediatR | React | Webpack</small> template</h2>
            <h5 className="mt-4">{Localizer.L("Routes found in defaults.jsonRoutes")}</h5>
            <ul>

            </ul>
            <LoadingSpinner isLoading={isLoading} />

        </div>)
}