import React from 'react';

type Props = {
    checked: boolean;
    change: (checked: boolean) => void;
}

export function CheckBox(props: Props) {
    return (
        <label className="check-box_container checkbox-non-empty" >
            <input type="checkbox" checked={props.checked}/>
            <span className="indicator" onClick={() => props.change(!props.checked)}/>
        </label>
    )
}