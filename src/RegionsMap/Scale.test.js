import '@testing-library/jest-dom';

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {Scale} from "./Scale";

const unitName = "Euros"
const scaleProps = {
    unit:{symbol:"€",name:unitName},
    value:{
        colors:["red","blue","green"],
        startValue:100,
        steps:[200,300]
    }
}

test('Check if the unit name is rendered',async ()=>{

    render(<Scale
        {...scaleProps}
    />)
    const items = await screen.findAllByText("(" + unitName + ")")

    expect(items.length === 1 ).toBeTruthy()

})

test('Check if scales values are rendered',async ()=>{

    render(<Scale
        {...scaleProps}
    />)
    const items1 = await screen.findAllByText(scaleProps.value.startValue)

    expect(items1.length === 1 ).toBeTruthy()

    const items2 = await screen.findAllByText(scaleProps.value.steps[0])

    expect(items2.length === 1 ).toBeTruthy()

    const items3 = await screen.findAllByText(scaleProps.value.steps[1])

    expect(items3.length === 1 ).toBeTruthy()

})