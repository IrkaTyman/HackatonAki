import cors from 'cors'
import express, {json, urlencoded} from 'express'
const helmet = require('helmet')
import {userRouter} from "./routes/user-router";
import {chatRouter} from "./routes/chat-router";
import {interestsRouter} from "./routes/interests-router";
import {fileRouter} from "./routes/file-router";
import dotenv from 'dotenv';

dotenv.config();

// создаем экземпляр приложения
const app = express()
const port = process.env.PORT
const allowedOrigin = 'http://localhost:3000'


// устанавливаем заголовки, связанные с безопасностью
app.use(helmet())

// устанавливаем заголовки, связанные с CORS
app.use(
    cors({
        // сервер будет обрабатывать запросы только из разрешенного источника
        origin: allowedOrigin
    })
)



// разбор параметров строки запроса
app.use(urlencoded({extended: true}))

//РОУТЫ
app.use("/api/user",json(), userRouter)
app.use("/api/chats",json(), chatRouter)
app.use("/api/interests",json(), interestsRouter)
app.use("/api/file", fileRouter)

app.use('*', (req, res) => {
    res.status(404).send(null)
})
// запуск сервера
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})