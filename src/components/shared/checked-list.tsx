import React from 'react'

type Props = {
    items:string[],
    checkedItems:string[],
    onChange:(item:string, checked:boolean) => void;
}

export function CheckedList(props:Props){

    return(
        <div className="checked_list">
            {props.items.map(item => (
                <div className="item">
                    <div className="checkbox-rect">
                        <input type="checkbox" id="checkbox-rect1" name="check" checked={props.checkedItems.includes(item)}/>
                            <label htmlFor="checkbox-rect1"
                                   onClick={() => props.onChange(item,!props.checkedItems.includes(item))}>
                                {item}
                            </label>
                    </div>
                </div>
            ))}
        </div>
    )
}