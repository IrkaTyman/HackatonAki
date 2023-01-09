const {getDownloadURL, ref, uploadBytes} = require("firebase/storage");
import {storage} from "./initialize";

export function getUrl(url: string, setUrl: (url: string) => void) {
    getDownloadURL(ref(storage, url))
        .then(url => setUrl(url))
}

export function loadImage(url: string, file: File, setUrl: (url: string) => void) {
    uploadBytes(ref(storage, url + "/" + file.name), file)
        .then(() => getUrl(url + "/" + file.name, setUrl))
}