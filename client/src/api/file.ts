import {SERVER_URI} from "../config";
import {commonOptions} from "./index";

export function loadFile(url: string, file: File, setUrl: (url: string) => void) {
    let formData = new FormData()
    formData.append("file", file)
    formData.append("url", url)

    fetch(`${SERVER_URI}/file/load`, {
        method: 'POST',
        body: formData
    })
        .then(res => {
            if (res.ok)
                return res.json() as Promise<string>
            else
                console.log("error")
        })
        .then(url => {
            if (url)
                setUrl(url)
        })
}

export function getFileUrl(url: string, setUrl: (url: string) => void) {
    fetch(`${SERVER_URI}/file/url`, commonOptions({url}))
        .then(res => {
            if (res.ok) {
                return res.json() as Promise<string>
            }
            else
                console.log("error")
        })
        .then(url => {
            console.log(url+"")
            if (url)
                setUrl(url)
        })
}