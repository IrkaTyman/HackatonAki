import React,{useState} from 'react';
import grey_eye from '../../../image/eye-grey.png'
import yellow_eye from '../../../image/eye-yellow.png'

type Props<Key> = {
    value: string | null,
    change: (key: Key, value: string) => void,
    placeholder: string,
    helpText: string,
    keyField: Key,
    errorText: string,
    type?:string,
    className?: string
}

export function InputEmpty<Key>(props: Props<Key>) {
    const [visiblePassword, setVisiblePassword] = useState(false)
    return (
        <div
            className={"input_empty_container w100per " + (props.className || " ") + (props.errorText ? " error" : "")}>
            <p className="input_begin_text">{props.helpText}</p>
            <input type={props.type == 'password' ? visiblePassword?'text' : 'password' : props.type ||  "text"}
                   value={props.value || ""}
                   placeholder={props.placeholder}
                   onChange={(event) => props.change(props.keyField, event.target.value)}/>
            {props.errorText && <div className="error_text">{props.errorText}</div>}
            {props.type == "password" && <img onClick={() => setVisiblePassword(value=>!value)} className="visible-password" src={visiblePassword ? yellow_eye : grey_eye} alt=""/>}
        </div>
    )
}