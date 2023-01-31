import {response, Router} from "express";
import {searchCompanionDB, setUser, getUser, signInEmail, signUpEmail} from "../firebase/user-function";

const userRouter = Router()

userRouter.post("/searchcompanion", (req, res) => {
    if (req.body.dialogsUid === undefined || req.body.user === undefined)
        res.status(404).send(null)
    else
        searchCompanionDB(req.body.dialogsUid, req.body.user, res)
})

userRouter.post("/signin", (req, res) => {
    if (req.body.email === undefined || req.body.password === undefined)
        response.status(404).send(null)
    else
        signInEmail(req.body.email, req.body.password, res)
})

userRouter.post("/signup", (req, res) => {
    if (req.body.email === undefined || req.body.password === undefined)
        response.status(404).send(null)
    else
        signUpEmail(req.body.email, req.body.password, res)
})

// Получение пользователя
userRouter
    .route("/:id")
    .get((req, res) => getUser(req.params.id, res))
    .post((req, res) => {
        if (req.body.user === undefined)
            res.status(404).send(null)
        else
            setUser(req.body.user, res)
    })


export {userRouter}