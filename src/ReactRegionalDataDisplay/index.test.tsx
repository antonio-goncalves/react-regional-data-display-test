import '@testing-library/jest-dom';

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import {ReactRegionalDataDisplay} from "./index";
import {Center} from "~/ReactRegionalDataDisplay/index.types";


const center:Center = {lat:0,lng:0,zoom:2}

const dataSets = [
    {
        "id" : "dataId",
        "name" : "Data name",
        "description":"Data description",
        "source" : {"name" : "Source", "url" : "https://example.com"},
        "dates" : {"format" : "YYYY", "timestamps" : [1262304000000, 1293840000000]},
        "unit" : {"name" : "Euro per capita", "symbol" : "eur/capita"},
        "scale" : {"startValue" : 0.0, "steps" : [5000.0, 10000.0], "colors" : ["#58D68D", "#F4D03F"]},
        "data" : [],
    }
]

test('Check if show error message if mapbox token is not defined',async ()=>{
    render(<ReactRegionalDataDisplay
        dataSets={dataSets}
        regions={null}
        //@ts-ignore
        mapBoxToken={undefined}
        center={{lat:0,lng:0,zoom:2}}
    />)
    const items = await screen.findAllByText("Mapbox token must be defined.")

    expect(items.length === 1 ).toBeTruthy()

})

test('Check if show loading message when data sets are being loaded (dataSets=undefined)',async ()=>{
    render(<ReactRegionalDataDisplay

        dataSets={undefined}
        regions={null}
        mapBoxToken={"xyz"}
        center={center}/>)
    const items =  await screen.findAllByText("Loading data sets.")

    expect(items.length === 1).toBeTruthy()

})

test('Check if show loading message when data sets are being loaded (dataSets=null)',async ()=>{
    render(<ReactRegionalDataDisplay

        dataSets={null}
        regions={null}
        mapBoxToken={"xyz"}
        center={center}/>)
    const items =  await screen.findAllByText("Loading data sets.")

    expect(items.length === 1).toBeTruthy()

})

test('Check if show error message if center is not defined',async ()=>{
    render(<ReactRegionalDataDisplay
        dataSets={dataSets}
        regions={null}
        mapBoxToken={"xyz"}
        center={undefined}/>)
    const items = await screen.findAllByText("A center must be defined.")
    expect(items.length === 1 ).toBeTruthy()

})
test('Check if show loading message when regions are being loaded (regions = null)',async ()=>{
    render(<ReactRegionalDataDisplay
        dataSets={dataSets}
        regions={null}
        mapBoxToken={"xyz"}
        center={center}/>)
    const items = await screen.findAllByText("Loading map regions...")
    expect( items.length === 1).toBeTruthy()

})
test('Check if show loading message when regions are being loaded (regions = undefined)',async ()=>{
    render(<ReactRegionalDataDisplay
        dataSets={dataSets}
        regions={undefined}
        mapBoxToken={"xyz"}
        center={center}/>)
    const items = await screen.findAllByText("Loading map regions...")
    expect(items.length === 1 ).toBeTruthy()

})