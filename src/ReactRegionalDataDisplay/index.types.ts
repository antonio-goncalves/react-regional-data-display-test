import {Feature, GeoJSON, GeoJsonProperties, Geometry} from "geojson";
import {MapboxOptions} from "mapbox-gl";
import React from "react";

interface Unit {
    name:String,
    symbol: String
}



interface DataScale {
    startValue: number,
    steps: Array<number>,
    colors:Array<string>
}

export interface Footnote {
    id:string | number,
    value:string,
    url?: string
}

interface DataSetSource  {
    name:string,
    url:string
}

interface DataSetDates  {
    format: string,
    timestamps: Array<number>
}
// Consider data and dates
interface DataSet {
    id: string,
    name: string,
    description: string,
    center?:Center,
    source:DataSetSource,
    dates:DataSetDates,
    unit: Unit,
    scale: DataScale,
    data: Array<RegionData>,
    footnotes?:Array<Footnote>
}

interface RegionData {
    dateTimestamp:number,
    id: string,
    value:number,
    footnoteIds?:Array<string>
}




interface DataRequest {
    selectedDate: Date;
    dataSetId: string;
}

interface Region {
    id:string,
    name: string,
    geoJSON:Feature<Geometry, GeoJsonProperties>
}



interface Center {
    lng: number,
    lat: number,
    zoom: number
}



interface RegionalDataDisplayProps {
    dataSets?: Array<DataSet> | null,
    regions?:Array<Region> | null,
    center?: Center,
    mapBoxToken: string,
    mapHeight?:string | number,
    mapBoxOptions?:Partial<MapboxOptions>,
    onDataSetChange?:(dataSetId: string)=>void,

    className?:string,
    sliderClassName?:string,
    dropdownClassName?:string,
    placeholderClassName?:string,
    mapContainerClassName?:string,

    style?:React.CSSProperties,
    sliderStyle?:React.CSSProperties,
    dropdownStyle?:React.CSSProperties,
    placeholderStyle?:React.CSSProperties,
    mapContainerStyle?:React.CSSProperties,


}

export {RegionalDataDisplayProps, DataSet,Region,RegionData,DataRequest, DataScale,Unit,Center}