import React, {FunctionComponent, useEffect, useState} from 'react';
import {ScaleInterval, ScaleProps} from "~/RegionsMap/Scale.types";
import {DataScale} from "~/ReactRegionalDataDisplay/index.types";



export  const Scale: FunctionComponent<ScaleProps>= ({value,unit,onMouseOver})=>{



    function getScaleIntervals(value: DataScale):ScaleInterval[]{

        const scaleIntervals:ScaleInterval[] = [];
        scaleIntervals.push({
            color:value.colors[0],
            minValue:value.startValue,
            maxValue:value.steps[0]

        })

        for(let i=1;i<value.steps.length;i++){
            const prevStep = value.steps[i-1]
            const step = value.steps[i]
            scaleIntervals.push({
                color:value.colors[i],
                minValue:prevStep,
                maxValue:step
            })
        }

        return scaleIntervals;

    }


    function renderScale(scaleInterval: ScaleInterval,lastValue:boolean): JSX.Element{


        return (

            <span className={"regional-data-display-scale-square"} onMouseLeave={()=>{onMouseOver?.()}} onMouseEnter={()=>{onMouseOver?.(scaleInterval)}} key={scaleInterval.color} style={{backgroundColor:scaleInterval.color }}>
                <span className={"regional-data-display-scale-mark"}/>
                {lastValue?<span className={"regional-data-display-scale-mark"}/>:""}
            </span>
        )
    }

    function renderScaleText(scaleInterval: ScaleInterval, isLastValue : boolean): JSX.Element{

        return (

            <span key={scaleInterval.color + " text"}  className={"regional-data-display-scale-value"}>
                <p>{scaleInterval.minValue}</p>
                {isLastValue?<p>{scaleInterval.maxValue}</p>:""}
            </span>
        )
    }
    if(value){
        const scaleIntervals = getScaleIntervals(value)
       return(
           <div>
            <span className={"regional-data-display-scale"}>
                {scaleIntervals.map((scaleInterval,i)=>(renderScale(scaleInterval,i===scaleIntervals.length-1)))}
            </span>
            <span className={"regional-data-display-scale"}>
                {scaleIntervals.map((scaleInterval,i)=>(renderScaleText(scaleInterval, i===scaleIntervals.length-1)))}
            </span>
            <span  className={"regional-data-display-scale justify-center"}>
                ({unit.name})
            </span>
        </div>
       )
    }
    return null;
}