import {ChangeEventHandler} from "react";

interface DropdownOption {
    label: string,
    value: string
}

interface DropdownProps {
    label: string,
    value: string,
    options: Array<DropdownOption>,
    onChange: ChangeEventHandler<HTMLSelectElement>,
    className?:string,
    style?:React.CSSProperties
}



export {DropdownProps, DropdownOption}