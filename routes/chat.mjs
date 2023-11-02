import express from 'express';
import { client } from '../mongodb.mjs'
import { ObjectId } from 'mongodb';
// import admin from "firebase-admin";
// import multer, { diskStorage } from 'multer';
// import fs from "fs";

const db = client.db("weapp")
const col = db.collection("posts")
const chatCol = db.collection("chats")
const userCollection = db.collection("auth")

let router = express.Router()


router.get('/chat', async (req, res, next) => {
    try {
        const projection = { _id: 1, firstName:1, lastName:1, email:1, profileImage:1,}
        const cursor = userCollection.find({}).sort({ _id: 1 }).project(projection);
        let results = await cursor.toArray();

        console.log(results);
        res.send(results);
    } catch (error) {
        console.error(error);
    }
});

export default router