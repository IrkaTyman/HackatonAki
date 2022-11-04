import React, {useState, useContext, useEffect, useRef} from "react";
import {UserContext} from "../../context/user-context";
import './style.scss';
import {useHistory} from "react-router-dom";
import {loadImage, getUrl} from "../../firebase/image-action";

export function SignUpPhoto() {
    const [image, setImage] = useState("")
    const [defaultImage, setDefaultImage] = useState<null | string>(null)
    const [loading, setLoading] = useState(true)
    const userContext = useContext(UserContext)
    const [error, setError] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null)
    const history = useHistory();

    useEffect(() => {
        getUrl('images/default/cat2.png', (url) => {
            setLoading(false)
            setDefaultImage(url)
        })
    }, [])

    function load() {
        if (!inputRef.current || !inputRef.current.files || !userContext) return

        let file = inputRef.current.files.item(0);
        if (file == null) return;

        const format = new RegExp("(.*?)\.(png|jpg|jpeg)$")
        if (!(format.test(file.name))) setError(true)
        else {
            setError(false);
            loadImage("images/users/" + userContext.user.uid, file, setImage)
        }
    }

    function submitImage() {
        if (error || !userContext) return;
        userContext.user.imageUrl = image || defaultImage;
        userContext.setUser({...userContext.user})
        history.push("/sign-up/main-interests")
    }

    if (loading || !userContext) return null;
    return (
        <div className="sign_up_photo_page page ai_fs fd_c h100per">
            <div className="big-header">Добавишь фото?</div>
            <div className="add_photo_container ai_c fd_c w100per">
                <img alt="your avatar" className="add_photo_img" src={image || defaultImage || ""}/>
                <div className="little_yellow_btn">Сделать фото</div>
                <label htmlFor="upload-photo">Загрузить из галереи</label>
                <input type="file" name="photo" id="upload-photo" ref={inputRef} onChange={load}/>
            </div>
            <div onClick={submitImage} className=" big_yellow_btn jc_c ai_c">Продолжить</div>
        </div>
    )
}