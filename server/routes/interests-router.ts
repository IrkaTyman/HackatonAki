import {Router} from "express";
import {getSecondaryInterests} from "../firebase/interests-function";

const interestsRouter = Router();

interestsRouter.get("/:key", (req, res) => {
    getSecondaryInterests(req.params.key, res)
})

export {interestsRouter}