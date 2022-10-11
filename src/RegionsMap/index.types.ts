
import {ScaleInterval} from "~/RegionsMap/Scale.types";
import type {DataScale, Footnote, Region, RegionData, Unit} from "~/ReactRegionalDataDisplay/index.types";
import {LngLat, MapboxOptions} from "mapbox-gl";
import {Center} from "~/ReactRegionalDataDisplay/index.types";




interface RegionsMapProps {
    mapBoxToken: string,
    regions:Array<Region> ,
    regionsData: Array<RegionData>|null,
    scale: DataScale,
    unit:Unit,
    center: Center,
    footnotes?:Array<Footnote>,
    mapBoxOptions?:Partial<MapboxOptions>,
    mapHeight:string | number,
    mapContainerClassName?: string,
    mapContainerStyle?:React.CSSProperties
}

interface RegionMapState {
    lng:number,
    lat:number,
    zoom:number,
    hoveredRegionIds: Array<string>,
    showTooltip:boolean
}

export {RegionsMapProps, RegionMapState}