import React, {ChangeEventHandler, ClassicComponent} from 'react';
import {SliderProps, SliderState} from "~/Slider/index.types";

import RCSlider from 'rc-slider';



import {PlayPauseButton} from "./PlayPauseButton"
export class Slider extends React.Component<SliderProps, SliderState>{

    static defaultProps: { timeBetweenJumps: number };
    private timeoutId: ReturnType<typeof setTimeout> | undefined;
    constructor(props: SliderProps) {
        super(props);
        this.onChange = this.onChange.bind(this)
        this.toggleAutoPlay = this.toggleAutoPlay.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)

        this.state  = {
            value: props.value,
            autoplay: false
        }


    }

    toggleAutoPlay(value? :boolean, callback?: (() => void) | undefined){
        clearTimeout(this.timeoutId)
        this.setState((state)=>({autoplay:value!==undefined?value:!state.autoplay}),callback)
    }

    componentDidUpdate(prevProps: Readonly<SliderProps>, prevState: Readonly<SliderState>, snapshot?: any) {
        if(!prevState.autoplay && this.state.autoplay){
            this.jumpToNext();
        }

        if(prevProps.value !== this.props.value && this.props.value !== this.state.value){
            this.toggleAutoPlay(false,()=>{
                this.setState({value:this.props.value})
            })
        }
    }




    jumpToNext(){
        const index: number = this.props.values.findIndex(el=>el.value === this.state.value);
        if(index === this.props.values.length-1){
            this.setState({autoplay:false})
        }else{
            const nextValue:number = this.props.values[index + 1].value
            this.timeoutId = setTimeout(()=>{
                if(!this.state.autoplay){
                    return
                }
                this.setState({value:nextValue},()=>{
                    this.jumpToNext()
                    this.onChange(this.state.value)
                })
            },this.props.timeBetweenJumps)
        }
    }

    getValuesArray(): Array<number>{
        return this.props.values.map(el=>el.value)
    }

    onChange(value: number | number[]){

       if(typeof value === "number"){
           this.setState({
               value
           },()=>{
               this.props.onChange?.(value);
           })

       }
    }

    getMarks(){
        return this.props.values.reduce((acc,val)=>({
            ...acc,
            [val.value]:val.label
        }),{})
    }

    onChangeHandler(value: number | number[]){

        this.toggleAutoPlay(false,()=>{
            this.onChange(value)
        })
    }

    render(){
        return (
            <div  className={"regional-data-display-slider-container"} >
                <PlayPauseButton
                    showPause={this.state.autoplay}
                    onClick={this.toggleAutoPlay}
                />
                <div className={"regional-data-display-slider"}>
                    <RCSlider
                        min={ Math.min(...this.getValuesArray())}
                        max={ Math.max(...this.getValuesArray())}
                        value={this.state.value}
                        marks={this.getMarks()}
                        step={null}
                        onChange={this.onChangeHandler}
                        className={this.props.className}
                        style={this.props.style}
                    />
                </div>
            </div>

        )

    }

}

Slider.defaultProps = {
    timeBetweenJumps:1000
}

