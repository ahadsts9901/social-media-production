import express from 'express';
import { client } from '../mongodb.mjs'
import { ObjectId } from 'mongodb'

const db = client.db("weapp");
const col = db.collection("posts");
const userCollection = db.collection("auth");

let router = express.Router()


// router.get('/posts', async (req, res, next) => {

//     const userId = req.query._id

//     if (!ObjectId.isValid(userId) && userId !== undefined) {
//         res.status(403).send(`Invalid user id`);
//         return;
//     }

//     const cursor = col.find({ userId: new ObjectId(userId) })
//         .sort({ _id: -1 })
//         .limit(5);

//     try {
//         let results = await cursor.toArray()
//         console.log("results: ", results);
//         res.send(results);
//     } catch (e) {
//         console.log("error getting data mongodb: ", e);
//         res.status(500).send('server error, please try later');
//     }
// })

// router.get('/profile/:userId', async (req, res, next) => {

//     const userId = req.params.userId;

//     if (!ObjectId.isValid(userId) && userId !== undefined) {
//         res.status(403).send(`Invalid user id`);
//         return;
//     }

//     try {
//         let result = await userCollection.findOne({ _id: new ObjectId(userId) });
//         console.log("result: ", result);
//         // res.send({
//         //     message: 'profile fetched',
//         //     data: {
//         //         firstName: result?.firstName,
//         //         lastName: result?.lastName,
//         //         email: result?.email,
//         //     }
//         // });
//         res.send(userId)
//     } catch (e) {
//         console.log("error getting data mongodb: ", e);
//         res.status(500).send('server error, please try later');
//     }
// })

router.use((req, res) => {
    res.status(401).send({ message: "invalid token" })
    return;
})


export default router