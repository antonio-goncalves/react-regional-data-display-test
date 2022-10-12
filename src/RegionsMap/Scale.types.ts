import {DataScale, Unit} from "~/ReactRegionalDataDisplay/index.types";

interface ScaleProps {
    value: DataScale,
    unit:Unit,
    onMouseOver?:(value?: ScaleInterval)=>void
}

interface ScaleInterval {
    minValue: number,
    maxValue: number,
    color: string
}

export {ScaleProps,ScaleInterval};