import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { LoadingSpinner } from "../components/loading-spinner/loading-spinner";
import Localizer from "../services/LocalizerService";

type HomeProps = {}

declare const defaults: any;

export const Home: FunctionComponent<HomeProps> = () => {
    const [isLoading, setIsLoading] = useState(false);

    function getKeys(obj) {
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
    }

    const routesKeys = getKeys(defaults.jsonRoutes);
    return (
        <div className="container">
            <h2 className="mt-4">{Localizer.L("Routes found in defaults.jsonRoutes")}</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>{Localizer.L("Route name")}</th>
                        <th>{Localizer.L("Route path")}</th>
                    </tr>
                </thead>
                <tbody>
                    {routesKeys.map(x => <tr key={x}><td>{x}</td><td>{defaults.jsonRoutes[x]}</td></tr>)}

                </tbody>
            </table>

            <LoadingSpinner isLoading={isLoading} />

        </div>)
}