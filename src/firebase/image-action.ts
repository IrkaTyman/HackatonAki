import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "./initialize";
import {toast} from "react-toastify";

export function getUrl(url: string, setUrl: (url: string) => void) {
    getDownloadURL(ref(storage, url))
        .then(url => setUrl(url))
        .catch(() => toast.error("Произошла ошибка"))
}

export function loadImage(url: string, file: File, setUrl: (url: string) => void) {
    uploadBytes(ref(storage, url + "/" + file.name), file)
        .then(() => getUrl(url + "/" + file.name, setUrl))
        .catch(() => toast.error("Произошла ошибка"))
}