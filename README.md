# React Regional Data Display

React components based on [mapbox](https://www.mapbox.com/) used to display quantitative data of geographical regions with support for multiples data sets and dates.

# Install

```shell
npm install @antonio-goncalves/react-regional-data-display
```

# Usage

Usage example using data provided by [Eurostats](https://ec.europa.eu/eurostat).

```tsx
import * as React from "react";
import {ReactRegionalDataDisplay} from "@antonio-goncalves/react-regional-data-display";
import '@antonio-goncalves/react-regional-data-display/dist/main.css'

import useSWR from 'swr'
import axios from 'axios'


const center = {
    lng: 13.9612,
    lat: 57.1004,
    zoom: 2.36
}

const fetcher =( url:string )=> axios.get(url).then(res => res.data)

const MAPBOX_TOKEN="your-token";

export function DataDisplayWithData(){
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
            mapBoxToken={MAPBOX_TOKEN}
            center={center}
        />
    )


}
```

# Components

React component provided by this library.

## ReactRegionalDataDisplay

Main component providing the map visualizer, data info, data set and date selection.

### Properties

| Name                  | Type             | Is Optional | Default Value             | Description                                                                                                     |
|-----------------------|------------------|-------------|---------------------------|-----------------------------------------------------------------------------------------------------------------|
| dataSets              | DataSet[]        | no          |                           | Data sets available on the component.                                                                           | 
| regions               | Region[]         | no          |                           | GeoJSON data of regions available on the map.                                                    |
| center                | Center           | yes         | {<br/>&nbsp;&nbsp;&nbsp;zoom:1,<br/>&nbsp;&nbsp;&nbsp;&nbsp;lng:0,<br/>&nbsp;&nbsp;&nbsp;&nbsp;lat:0<br/>} | Center position and zoom.                                                                                       |
| mapBoxToken           | string           | no          |                           | Access token required to use mapbox.                                                                            |
| mapHeight             | string or number | yes         | 500                       | Height of the map, use a number of "px" or a sring for a css value.                                             |
| mapBoxOptions         | object           | yes         |                           | Extra [options](https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters) passed to the mapbox constructor. |
| onDataSetChange | (dataSetId:string)=>void| yes         |                           | Fired when a new data set is selected.                                                                          |
| className             | string           | yes         |                           | Custom class for the container.                                                                                 |
| sliderClassName       | string           | yes         |                           | Custom class for the slider element.                                                                            |
| dropdownClassName     | string           | yes         |                           | Custom class for the dropdown element.                                                                          |
| placeholderClassName  | string           | yes         |                           | Custom class for the placeholder text.                                                                          |
| mapContainerClassName | string           | yes         |                           | Custom class for map container.                                                                                 |
| style                 | object           | yes         |                           | Custom style for the container.                                                                                 |
| sliderStyle           | object           | yes         |                           | Custom style for the slider element.                                                                            |
| dropdownStyle         | object           | yes         |                           | Custom style for the dropdown element.                                                                          |
| placeholderStyle      | object           | yes         |                           | Custom style for the placeholder text.                                                                          |
| mapContainerStyle     | object           | yes         |                           | Custom style for map container.                                                                                 |

## RegionsMap

Map component used on this project, can be used as a standalone component if date and data set selection is not required.

### Properties

| Name           | Type                 | Is Optional | Default Value | Description                                                                                                    |
|----------------|----------------------|--------|---------------|----------------------------------------------------------------------------------------------------------------|
| regionsData    | RegionData[] or null | no          |               | Data value for each region.                                                                                     | 
| regions        | Region[]             | no     |               | GeoJSON data of regions available on the map.                                                    |
| center                | Center           | yes         | {<br/>&nbsp;&nbsp;&nbsp;zoom:1,<br/>&nbsp;&nbsp;&nbsp;&nbsp;lng:0,<br/>&nbsp;&nbsp;&nbsp;&nbsp;lat:0<br/>} | Center position and zoom.                                                                                       |
| mapBoxToken    | string               | no     | | Access token required to use mapbox.                                                                            |
| mapHeight      | string or number     | yes    | 500 | Height of the map, use a number of "px" or a sring for a css value.                                                                                              |
| mapBoxOptions  | object               | yes    | | Extra [options](https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters) passed to the mapbox constructor. |
| scale          | Scale                | no     | | Scale used by the map.                                                                                          |
| footnotes         | Footnote[]           | yes    | | Footnotes texts available to be used by data points.                                                                            |
| unit           | Unit                 | no     | | Unit of the data showed on the map.                                                                            |
| dropdownClassName | string               | yes    | | Custom class for the dropdown element.                                                                          |
| mapContainerClassName  | string               | yes    | | Custom class for the map container.                                                                             |
| mapContainerStyle | object               | yes    | | Custom style for the map container.                                                                             |

## Scale

Coloured scale used on the map

### Properties 

| Name        | Type    | Is Optional | Default Value | Description                          |
|-------------|---------|--------|---------------|--------------------------------------|
| value       | DataScale | no          |               | Numeric intervals and colors.         | 
| unit        | Unit    | no     |               | Unit showed on the label.             |
| onMouseOver | (value?: ScaleInterval)=>void    | no     |               | Mouse over event for each scale area. |

## Slider

Animated slider used for date selection.

### Properties

| Name        | Type                  | Is Optional | Default Value | Description                                                |
|-------------|-----------------------|-------------|---------------|------------------------------------------------------------|
| value       | number                | no          |               | Current selection of the scale.                             | 
| values      | SliderValue[]         | no          |               | Available values.                                           |
| timeBetweenJumps | number                | yes         | 1000          | Time in ms between between selection when in animated mode is enabled. |
| onChange    | (value: number)=>void | no          |               | Event when fired when the value changes                             | 
| className      | string                | yes         |               | Custom class for the slider.                                |
| style | object                | yes         |               | Custom style for the slider.                                |

# Structures

Data structures used on this project.

## DataSet

Object describing a data set.

| Name        | Type          | Is Optional | Default Value | Description                                                           |
|-------------|---------------|-------------|---------------|-----------------------------------------------------------------------|
| id          | string        | no          |               | Id of the data set.                                                    |
| name        | string        | no          |               | Name of the data set.                                                  |
| description | string        | no          |               | Description of the data set.                                           |
| center      | Center        | no          |               | Position and zoom of the map (overrides "center" property of the map). |
| source      | DataSetSource | no          |               | Source of the data.                                                    |
| dates       | DataSetDates  | no          |               | Dates of the data set.                                                 |
| unit        | Unit          | no          |               | Unit of the data set.                                                  |
| scale       | DataScale     | no          |               | Scale info for the data set.                                           |
| data        | RegionData[] or null | no          |               | Data values for each region.                                                                                     | 
| footnotes         | Footnote[]           | yes         |               | Footnotes texts available to be used by data points.                                                                           |

## Center

Object describing the center position and zoom on the map.

| Name | Type   | Is Optional | Default Value        | Description     |
|------|--------|-------------|----------------------|-----------------|
| lat  | number | no          |                      | Latitude value.  |
| lng  | number | no          |                      | Longitude value. |
| zoom | number | no          |                      | [Zoom level](https://docs.mapbox.com/help/glossary/zoom-level/).  |

## DataSetSource

Object describing the source of the data

| Name | Type   | Is Optional | Default Value        | Description                                                     |
|------|--------|-------------|----------------------|-----------------------------------------------------------------|
| name | string | no          |                      | Name of the source.                                              |
| url  | string | no          |                      | Url of the source.                                              |

## DataSetDates

Object describing the dates available on the data set

| Name       | Type     | Is Optional | Default Value        | Description                                                                              |
|------------|----------|-------------|----------------------|------------------------------------------------------------------------------------------|
| format     | string   | no          |                      | [Format](https://momentjs.com/docs/#/parsing/string-format/) on how to display the dates. |
| timestamps | number[] | no          |                      | Values of the timestamps in ms.                                                           |


## Unit

Object describing the unit

| Name   | Type   | Is Optional | Default Value        | Description          |
|--------|--------|-------------|----------------------|----------------------|
| name   | string | no          |                      | Name of the unit.     |
| symbol | string | no          |                      | Symbol of the unit. |

## DataScale

Object describing the scale used on the map

| Name       | Type     | Is Optional | Default Value        | Description              |
|------------|----------|-------------|----------------------|--------------------------|
| startValue | number   | no          |                      | First value of the scale. |
| steps      | number[] | no          |                      | Values for each step.     |
| colors     | string[] | no          |                      | Color of each step.       |


## RegionData

Object describing the data for each region

| Name          | Type     | Is Optional | Default Value        | Description          |
|---------------|----------|-------------|----------------------|----------------------|
| dateTimestamp | number   | no          |                      | Date of the data.     |
| id            | string   | no          |                      | Id of the region.     |
| value         | number   | no          |                      | Numeric value of the data.    |
| footnoteIds         | string[] | yes         |                      | Ids of the footnotes. |


## Footnote

Object describing footnotes available

| Name        | Type     | Is Optional | Default Value        | Description                |
|-------------|----------|-------------|----------------------|----------------------------|
| id          | string   | no          |                      | Id of the footnote.         |
| value       | string   | no          |                      | Text value of the footnote. |


## Region

Object containing the contours of a region

| Name    | Type    | Is Optional | Default Value        | Description                                       |
|---------|---------|-------------|----------------------|---------------------------------------------------|
| id      | string  | no          |                      | Id of the region.                                 |
| name    | string  | no          |                      | name of the region.                               |
| geoJSON | GeoJSON | no          |                      | Contours of the region, GeoJSON (type="Feature"). |


## SliderValue

| Name    | Type    | Is Optional | Default Value        | Description            |
|---------|---------|-------------|----------------------|------------------------|
| label   | string  | no          |                      | Label of the value.     |
| value   | number  | no          |                      | Numeric value.          |

## ScaleInterval

| Name     | Type   | Is Optional | Default Value        | Description       |
|----------|--------|-------------|----------------------|-------------------|
| minValue | number | no          |                      | Minimum value.     |
| maxValue | number | no          |                      | Maximum value.     |
| color    | string | no          |                      | Color of the area. |


