import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "./initialize";
import {Response} from "express";

export function loadImage(url: string, file: any, response: Response) {
    console.log(file,url)
    uploadBytes(ref(storage, url + "/" + file.originalname), file.buffer)
        .then(() => getUrl(url + "/" + file.originalname, response))
        .catch(() => response.status(404).json(null))
}

export function getUrl(url: string, response: Response) {
    getDownloadURL(ref(storage, url))
        .then(url => response.status(200).json(url))
        .catch(() => response.status(404).json(null))
}

