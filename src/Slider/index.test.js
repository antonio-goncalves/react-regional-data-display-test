import '@testing-library/jest-dom';

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {Slider} from "./index";

test('Check if date values are rendered',async ()=>{

    render(<Slider
        value={new Date("2021").getTime()}
        values={[
            {value:new Date("2020").getTime(),label:"2020"},
            {value:new Date("2021").getTime(),label:"2021"},
            {value:new Date("2022").getTime(),label:"2022"},
        ]}

    />)
    const items1 = await screen.findAllByText("2020")

    expect(items1.length === 1 ).toBeTruthy()

    const items2 = await screen.findAllByText("2021")
    expect(items2.length === 1 ).toBeTruthy()

    const items3 = await screen.findAllByText("2022")
    expect(items3.length === 1 ).toBeTruthy()

})

