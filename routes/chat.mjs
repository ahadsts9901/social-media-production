import express from 'express';
import { client } from '../mongodb.mjs'
import { ObjectId } from 'mongodb';

const db = client.db("weapp")
const col = db.collection("chat")

let router = express.Router()

// POST    /api/v1/post
router.post('/post', async(req, res, next) => {

    if (!req.body.title ||
        !req.body.text
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
        return;
    }

    const insertResponse = await col.insertOne({
        title: req.body.title,
        text: req.body.text,
        time: new Date()
    })
    console.log(insertResponse)

    res.send('post created');
})

//GET  ALL   POSTS   /api/v1/post/:postId
router.get('/posts', async(req, res, next) => {
    try {
        const cursor = col.find({}).sort({ _id: -1 });
        let results = await cursor.toArray();

        console.log(results);
        res.send(results);
    } catch (error) {
        console.error(error);
    }
});

// GET  ONE   POST   /api/v1/posts/
router.get('/post/:postId', async(req, res, next) => {
    const postId = new ObjectId(req.params.postId);

    try {
        const post = await col.findOne({ _id: postId });

        if (post) {
            res.send(post);
        } else {
            res.status(404).send('Post not found with id ' + postId);
        }
    } catch (error) {
        console.error(error);
    }
});

// DELETE ALL   /api/v1/posts

router.delete('/posts/all', async(req, res, next) => {
    try {

        const deleteResponse = await col.deleteMany({});

        if (deleteResponse.deletedCount > 0) {
            res.send(`${deleteResponse.deletedCount} posts deleted successfully.`);
        } else {
            res.send('No posts found to delete.');
        }
    } catch (error) {
        console.error(error);
    }
});


// DELETE  /api/v1/post/:postId
router.delete('/post/:postId', async(req, res, next) => {
    const postId = new ObjectId(req.params.postId);

    try {
        const deleteResponse = await col.deleteOne({ _id: postId });
        if (deleteResponse.deletedCount === 1) {
            res.send(`Post with id ${postId} deleted successfully.`);
        } else {
            res.send('Post not found with the given id.');
        }
    } catch (error) {
        console.error(error);
    }
});

// EDIT post

// PUT /api/v1/post/:postId
router.put('/post/:postId', async(req, res, next) => {
    const postId = new ObjectId(req.params.postId);
    const { title, text } = req.body;

    if (!title || !text) {
        res.status(403).send('Required parameters missing. Please provide both "title" and "text".');
        return;
    }

    try {
        const updateResponse = await col.updateOne({ _id: postId }, { $set: { title, text } });

        if (updateResponse.matchedCount === 1) {
            res.send(`Post with id ${postId} updated successfully.`);
        } else {
            res.send('Post not found with the given id.');
        }
    } catch (error) {
        console.error(error);
    }
});


export default router