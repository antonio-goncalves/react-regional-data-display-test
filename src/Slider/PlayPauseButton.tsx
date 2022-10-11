
import React, {FunctionComponent, useState} from "react"

import classnames from 'classnames'
import {PlayPauseButtonProps} from "~/Slider/PlayPauseButton.types";
export const PlayPauseButton: FunctionComponent<PlayPauseButtonProps> = ({showPause, onClick} ) => {
    function onLinkClick(e: any){
        e.preventDefault()
        onClick()
    }

    return (
        <div className={"regional-data-display-slider-button-container"}>
             <a   href="#" title="Play" className={classnames("regional-data-display-slider-button ", {active: showPause})} onClick={onLinkClick}/>

        </div>
    )
}
