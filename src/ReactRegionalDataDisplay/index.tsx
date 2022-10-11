import React, {FunctionComponent, useEffect, useState} from 'react';
import {RegionalDataDisplayProps, DataSet} from "~/ReactRegionalDataDisplay/index.types";
import {Dropdown} from "../Dropdown";
import {DropdownOption} from "~/Dropdown/index.types";
import PropTypes from 'prop-types';

import moment from "moment"
import {Slider} from "../Slider";
import {SliderValue} from "~/Slider/index.types";
import {RegionsMap} from "../RegionsMap";
import classnames from "classnames";

export const ReactRegionalDataDisplay: FunctionComponent<RegionalDataDisplayProps> = (props ) => {
    const {
        dataSets,
        regions,
        mapBoxOptions,
        mapBoxToken,
        center,
        mapHeight,
        mapContainerClassName,
        placeholderClassName,
        dropdownClassName,
        className,
        style,
        mapContainerStyle,
        placeholderStyle,
        dropdownStyle,
        sliderStyle,
        sliderClassName,
        onDataSetChange
    } = props;
    function renderPlaceholder(text:string){
        return <p style={placeholderStyle} className={classnames(placeholderClassName)}>{text}</p>
    }

    if(!mapBoxToken){
        return renderPlaceholder("Mapbox token must be defined.");
    }
    if(!center){
        return renderPlaceholder("A center must be defined.");
    }
    if(!dataSets){
        return renderPlaceholder("Loading data sets.");
    }
    const [selectedDataSetId, setSelectedDataSetId] = useState<string>(dataSets[0].id)

    const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate(selectedDataSetId))

    useEffect(()=>{

    },[selectedDataSetId])

    function getDropdownOptions (): Array<DropdownOption>{
        return dataSets!.map(el=>(
            {
                label:el.name,
                value:el.id
            }
        ))
    }



    function getInitialDate(dataSetId: string): Date{
        const selectedDataSet: DataSet = dataSets!.find(el=>el.id === dataSetId)!;
        return new Date( selectedDataSet.dates.timestamps[0])
    }

    function getSliderValues(): Array<SliderValue> {
        const selectedDataSet: DataSet = dataSets!.find(el=>el.id === selectedDataSetId)!;
        return selectedDataSet.dates.timestamps.map((timestamp:number)=>({
            label: moment(timestamp).format(selectedDataSet.dates.format),
            value: timestamp
        }))

    }

    function getSelectedDataSet(): DataSet {
        return dataSets!.find(el=>el.id === selectedDataSetId)!;

    }

    function onDropdownChange(event: React.ChangeEvent<HTMLSelectElement>){
        onDataSetChange?.(event.target.value);
        setSelectedDataSetId(event.target.value);
        setSelectedDate(getInitialDate(event.target.value))
    }

    function onSliderChange(value: number){
        setSelectedDate(new Date(value));
    }

    function renderMap(){
        if(!regions){
            return renderPlaceholder("Loading map regions...");
        }
        const dataSet: DataSet = getSelectedDataSet();
        return <RegionsMap

            mapBoxToken={mapBoxToken}
            regions={regions}
            regionsData={dataSet.data?.filter(e=>e.dateTimestamp === selectedDate.getTime())}
            scale={dataSet.scale}
            unit={dataSet.unit}
            footnotes={dataSet.footnotes}
            center={dataSet.center || center!}
            mapBoxOptions={mapBoxOptions}
            mapContainerClassName={mapContainerClassName}
            mapContainerStyle={mapContainerStyle}
            mapHeight={mapHeight}
        />

    }

    function renderInfo():React.ReactElement{
        const selectedDataSet : DataSet = getSelectedDataSet();
        return  (
            <>
                <h1>{selectedDataSet.name} - {moment(selectedDate).format(selectedDataSet.dates.format)}</h1>
                <p>{selectedDataSet.description}</p>
                <p>Source: <a target={"_blank"} href={selectedDataSet.source.url}>{selectedDataSet.source.name}</a></p>
            </>
        )
    }

    return (

        <div style={style} className={classnames("regional-data-display",className)}>
            {renderInfo()}
            <Dropdown
                label={"Data to display"}
                value={selectedDataSetId}
                options={getDropdownOptions()}
                onChange={onDropdownChange}
                className={dropdownClassName}
                style={dropdownStyle}
            />
            <Slider className={sliderClassName} style={sliderStyle} value={selectedDate.getTime()} values={getSliderValues()} onChange={onSliderChange}/>
            {renderMap()}
        </div>
    )
}

ReactRegionalDataDisplay.propTypes = {
    mapBoxToken:PropTypes.string.isRequired
}