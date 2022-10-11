import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {ReactRegionalDataDisplay} from "../src";
import '/src/main.scss'

const app = document.getElementById("app")!;
const root = ReactDOM.createRoot(app);
const center = {
    lng: 13.9612,
    lat: 57.1004,
    zoom: 2.36
}
import useSWR from 'swr'

import axios from 'axios'

const fetcher =( url:string )=> axios.get(url).then(res => res.data)


function DataDisplayWithData(){
    const { data:dataSets, error:dataSetsError } = useSWR('https://preview.antonio-goncalves.com/api/dataSets?ids=gdp,populationDensity', fetcher)
    const { data:regions, error:regionsError } = useSWR('https://preview.antonio-goncalves.com/api/regions/eurostatCountries10m?ids=BE,BG,CZ,DK,DE,EE,IE,EL,ES,FR,HR,IT,CY,LV,LT,LU,HU,MT,NL,AT,PL,PT,RO,SI,SK,FI,SE,IS,LI,NO,CH,UK,ME,MK,AL,RS,TR', fetcher)

    if(dataSetsError || regionsError){
        const errors = []
        if(dataSetsError){
            errors.push(<p style={{color:"red"}}>Error when fetching data sets: {dataSetsError.message}</p>)
        }
        if(regionsError){
            errors.push(<p style={{color:"red"}}>Error when fetching regions: {regionsError.message}</p>)
        }
        return <>
            {errors.map((el,i)=>(
                el
            ))}
        </>
    }

    return (
        <ReactRegionalDataDisplay
            dataSets={dataSets}
            regions={regions}
            mapBoxToken={"pk.eyJ1IjoiYW50b25pby1nb25jYWx2ZXMiLCJhIjoiY2w1aW1zdjJjMDgxdjNjb2JjOWxkOXZjdSJ9.nU8jTvVopzX0y8EK7tTHjA"}
            center={center}
            dropdownClassName={"form-select"}
        />
    )


}

root.render(
    <React.StrictMode>
        <div style={{maxWidth: 1000,margin:"0 auto",padding:20}}>
            <DataDisplayWithData />

        </div>
    </React.StrictMode>

);

