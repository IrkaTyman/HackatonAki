import {Router, json} from "express";
import {loadImage, getUrl} from "../firebase/file-function";
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage}).single('file');

const fileRouter = Router();

fileRouter.post("/load", upload, (req:any, res) => {
    if (req.file === undefined || req.body.url === undefined) {
        res.status(500).send(null)
    } else
        loadImage(req.body.url, req.file, res)
})

fileRouter.post("/url", json(), (req, res) => {
    getUrl(req.body.url, res)
})

export {fileRouter}