
import express from 'express';
import { client } from '../mongodb.mjs'
import { ObjectId } from 'mongodb'
import openai from "openai";

const db = client.db("weapp");
const col = db.collection("posts");
const userCollection = db.collection("auth");

let router = express.Router()

const initializeOpenAIClient = () => {
    return new openai({
        apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
    });
};

router.get("/search", async (req, res) => {
    const queryText = req.query.q;

    try {
        // Initialize the OpenAI client
        const openaiClient = initializeOpenAIClient();

        // Create an embedding for the query text
        const response = await openaiClient.embeddings.create({
            model: "text-embedding-ada-002",
            input: queryText,
        });

        // Extract the vector from the response
        const vector = response?.data[0]?.embedding;

        // Perform a search using the vector
        const documents = await col
            .aggregate([
                {
                    $search: {
                        index: "we_app",
                        knnBeta: {
                            vector: vector,
                            path: "embedding",
                            k: 10,
                        },
                        scoreDetails: true,
                    },
                },
            ])
            .toArray();

        res.send(documents);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during search');
    }
});

router.get('/feed', async (req, res, next) => {
    try {
        const cursor = col.find({}).sort({ _id: -1 });
        let results = await cursor.toArray();

        console.log(results);
        res.send(results);
    } catch (error) {
        console.error(error);
    }
});


router.get('/profile/:userId', async (req, res, next) => {

    const userId = req.params.userId || req.body.decoded.userId

    if (!ObjectId.isValid(userId)) {
        res.status(403).send(`Invalid user id`);
        return;
    }

    try {
        let result = await userCollection.findOne({ _id: new ObjectId(userId) });
        console.log("result: ", result); // [{...}] []
        res.send({
            message: 'profile fetched',
            data: {
                isAdmin: result.isAdmin,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                userId: result._id,
            },
            id: userId
        });

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

router.get('/posts/:userId', async (req, res, next) => {
    const userId = req.params.userId;

    if (!ObjectId.isValid(userId)) {
        res.status(403).send(`Invalid user id`);
        return;
    }

    try {
        const cursor = col.find({ userId: new ObjectId(userId) }).sort({ _id: -1 });
        const results = await cursor.toArray();

        console.log(results);
        res.send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.use((req, res) => {
    res.status(401).send({ message: "invalid token" })
    return;
})

export default router