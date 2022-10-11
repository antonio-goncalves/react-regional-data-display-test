import React, { FunctionComponent } from 'react';
import {DropdownProps} from "~/Dropdown/index.types";



export const Dropdown: FunctionComponent<DropdownProps> =({label,value,onChange,options,className,style})=> {
    return (
        <label>
            {label}<br/>
            <select style={style} className={className} value={value} onChange={onChange}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </label>
    );
}
