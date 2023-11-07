import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
const __dirname = path.resolve();

import authRouter from './routes/auth.mjs'
import postRouter from './routes/post.mjs'
import chatRouter from './routes/chat.mjs'
import commentsRouter from './routes/comments.mjs'
import cookieParser from 'cookie-parser'
// import { decode } from 'punycode';

import unAuthProfileRouter from "./unAuthRoutes/profile.mjs"

const app = express();
app.use(express.json()); // body parser
app.use(cookieParser()); // cookie parser

app.use("/api/v1", authRouter)

app.use("/api/v1", (req, res, next) => {
    console.log("cookies: ", req.cookies);

    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log("decoded: ", decoded);

        req.body.decoded = {
            ...decoded
        };

        next();

    } catch (err) {
        unAuthProfileRouter(req, res)
        return;
    }
});


app.use("/api/v1", postRouter)
app.use("/api/v1", chatRouter)
app.use("/api/v1", commentsRouter)

app.use(express.static(path.join(__dirname, 'web/build')))
app.get(express.static(path.join(__dirname, 'web/build')))
app.use("*", express.static(path.join(__dirname, 'web/build')))

app.get("/api/v1/ping", (req, res) => {
    res.send("OK");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example server listening on port ${PORT}`)
})