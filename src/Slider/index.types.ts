
interface SliderValue {
    label:String,
    value:number
}


interface SliderProps {
    value:number,
    values: Array<SliderValue>,
    timeBetweenJumps?:number,
    onChange?: (value: number)=>void,
    className?: string,
    style?: React.CSSProperties
}

interface SliderState {
    value: number,
    autoplay: boolean
}

export {SliderState,SliderProps, SliderValue}