import express from 'express';
import { client } from '../mongodb.mjs'
import { ObjectId } from 'mongodb';
import openai from "openai"
import admin from "firebase-admin";
import multer, { diskStorage } from 'multer';
import fs from "fs";

const db = client.db("weapp")
const col = db.collection("posts")
const userCollection = db.collection("auth")

//==============================================
const storageConfig = diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        console.log("mul-file: ", file);
        cb(null, `postImg-${new Date().getTime()}-${file.originalname}`)
    }
})
let upload = multer({ storage: storageConfig })
//==============================================


// storage bucket

// https://firebase.google.com/docs/storage/admin/start
let serviceAccount = {
    "type": "service_account",
    "project_id": "simple-database-b15ab",
    "private_key_id": "dc544906682d1d9d2215617d57b89b13c2a68202",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkimr29ivEeVnB\n4yZtrAH4Tgnzd5nuRsuYzB61bJhSJfaYq1/6V+yVCLuWt0ouD0g6oX2dkS8fmuYG\nLFGk425ZLhmjZAsk3JLP9l7D+SFJW5eQFyAzGhKz6jV1hQbahuEZRMeRlyFMtSsi\n+crJjQ+zgpmIwov7yD4lEJqi27x/IylAO2LlFVM5nVQASWivDh1gxciJ+Vlr4xLd\nphH9WRn53CN6R8m33QThktHWWqKlmpstxHFM355pz2W1H8iFqAsPz+Qkz5GsIaHH\nmpqJyKeVzjU7ddqfIk8PqOH+2SB/JbBWsh6vR8SZhKge5pOGQ4bFiIKZlSsEDIUO\nyN73INLdAgMBAAECggEAG809lJv0uj5s4Zthd198d7mr6cT4L/ArX5aBy9LdC+hZ\nOeOfFHw9v9LZa3Zt5Ml1QV7fDDwnU7ZHDpz3cJ5zG0N0VozFa0WP0u7EhWV3b983\nhUO7D5dkuJymysQe69alezEJbXq1SDJGZyMA1jxs/j5fdeG1aGYlxfp/vmvVdj+z\ne+F0M9DebULZ1P3OngseDoAfz9d125rLMqaBdO3hbcD2aMyf/4VRMg9o8qoEF50f\naEI3HjyrKk1v2VlthXMlzFhgkGBLzzGPDdpivVvxGw9OU9Lh4QKFVKFLvLdOyMtR\neAtIbsPenrHSj90lY7d8vQtLXBCdCK6q7o3lgJKtoQKBgQDibqqZlApbSMyVArSZ\nKM8+sEeyrkSx3j09ZmjqtTn19WNiade3ixF3mBm0AvqtvTT0kf5w/F4VvxRbdYGJ\nxX767gBYqHa+qV2qV6KbOpohVm1jouLtwrjxzzJbaRGw0Knv7PTdNj7mm/b6y4tp\nT8HWBXh/MFMaCeMKF215LE2LzQKBgQC6Bsv6kFPR8V0kHQrB6URnhg4GI3tILW0V\nRgD8V1Bost3ki3AKfxDSHOYPpBNiEbdK3c7S3XaCOqma+UZCkWZa903C1icvYUmb\ngnnuam8YMW2p3UDftY1XB43ylOwxu93TIWV84rZ2/E5uXst6pP3ZGjkVyx5G575h\n460A9nTzUQKBgQDOeBjJp4r2B+C8c1YYXnTzdaw7CtsK0VpIFYzPj+bFFzfDcj3I\nWF/aDHBLi3fnWqLh7An2Hrjv3WeDqhcveE28I69fKGX2ntsQy44zO3F1uqhOdSW1\npZwcqlEBt0HxV6PNaeUxnRgoEclYkKeTpK1cKWrhlz//e0pyVkB1gGdJdQKBgAv/\nkjp4AqAA5FQG94GoTPwsXk0xDquKGoYLvNaJvyrxlnQ+NhzHM0uKB6CsoX9qyxqu\nEb/x/snJhNT1DP4QKLznRIGzlFVu/fNkx/6DqOSzk3IoTh3ftN0PJK2nw1A14MnU\nVppmeQRVo61kudUQPTs6gMISFsLWAaaIq8jrHIHxAoGAbZfcsVGr18vmhyIspBMa\n4ejxxhubG7/VZ5ScJ52qMBRD2ck2JNfStVTVpiFfS5SlE/L+7eSv22BGN/qAdiep\nWoQUKtx5CwDaD9/axOlheVnjzmudwyc3vjpwIh+/FbqaPyVkVL8dJ1BmmnHPW/fG\npkPrAXjA5zYlTi2iAtZyUns=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-vbe7e@simple-database-b15ab.iam.gserviceaccount.com",
    "client_id": "114919398174781168093",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vbe7e%40simple-database-b15ab.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://smit-b9.firebaseio.com"
});
const bucket = admin.storage().bucket("simple-database-b15ab.appspot.com");

//==============================================

let router = express.Router()

// POST    /api/v1/post
router.post('/post', (req, res, next) => {
    req.decoded = { ...req.body.decoded };
    next();
},
    upload.any(), async (req, res, next) => {
        
        if (!req.body.postText && (!req.files || !req.files[0])) {
            res.status(403);
            res.send(`required parameters missing, 
            example request body:
            {
                postText: "some post text"
            }`);
            return;
        }

        if (req.files && req.files[0] && req.files[0].size > 2000000) { // Check file size if a file is provided
            res.status(403).send({ message: 'File size limit exceeded, max limit 2MB' });
            return;
        }

        // Handle file upload only if a file is provided
        if (req.files && req.files[0]) {
            bucket.upload(
                req.files[0].path,
                {
                    destination: `posts/${req.files[0].filename}`,
                },
                function (err, file, apiResponse) {
                    if (!err) {
                        // Handle file upload and processing

                        file.getSignedUrl({
                            action: 'read',
                            expires: '03-09-2491'
                        }).then(async (urlData, err) => {
                            if (!err) {
                                console.log("public downloadable url: ", urlData[0]) // this is a public downloadable URL

                                // Continue handling text data
                                try {
                                    const insertResponse = await col.insertOne({
                                        title: req.body.postTitle || '', // Set to an empty string if not provided
                                        text: req.body.postText || "",
                                        time: new Date(),
                                        email: req.body.userLogEmail,
                                        userId: new ObjectId(req.body.userId),
                                        image: urlData[0], // Set to an empty string if no file was provided
                                        userImage: req.body.userImage,
                                        likes: []
                                    });
                                    console.log(insertResponse);
                                    res.send('post created');
                                } catch (e) {
                                    console.log("error inserting mongodb: ", e);
                                    res.status(500).send({ message: 'server error, please try later' });
                                }

                                // Delete the uploaded file from the server folder (if a file was provided)
                                if (req.files && req.files[0]) {
                                    try {
                                        fs.unlinkSync(req.files[0].path)
                                        //file removed
                                    } catch (err) {
                                        console.error(err)
                                    }
                                }
                            }
                        });
                    } else {
                        console.log("err: ", err)
                        res.status(500).send({
                            message: "server error"
                        });
                    }
                });
        } else {
            // Continue handling text data
            if (req.body.postText.trim() === "") {
                return;
              }
            try {
                const insertResponse = await col.insertOne({
                    title: req.body.postTitle || '', // Set to an empty string if not provided
                    text: req.body.postText,
                    time: new Date(),
                    email: req.body.userLogEmail,
                    userId: new ObjectId(req.body.userId),
                    userImage: req.body.userImage,
                    likes:[]
                });
                console.log(insertResponse);
                res.send('post created');
            } catch (e) {
                console.log("error inserting mongodb: ", e);
                res.status(500).send({ message: 'server error, please try later' });
            }
        }
});

//GET  ALL   POSTS   /api/v1/post/:postId
router.get('/feed', async (req, res, next) => {
    try {
        const projection = { _id: 1, title: 1, text: 1, time: 1, userId: 1, likes: 1, image: 1, userImage: 1 }
        const cursor = col.find({}).sort({ _id: -1 }).project(projection);
        let results = await cursor.toArray();

        console.log(results);
        res.send(results);
    } catch (error) {
        console.error(error);
    }
});

// GET  ONE   POST   /api/v1/posts/
router.get('/post/:postId', async (req, res, next) => {

    console.log(req.params.postId);

    const postId = new ObjectId(req.params.postId);

    try {
        // const projection = {_id :1, title:1, text:1, time:1, userId:1, likes:1, }
        const post = await col.findOne({ _id: postId });

        if (post) {
            res.send(post);
        } else {
            res.status(404).send('Post not found with id ' + postId);
        }
    } catch (error) {
        console.error(error);
        console.log(postId)
    }
});

// DELETE ALL   /api/v1/posts

router.delete('/posts/all', async (req, res, next) => {
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
router.delete('/post/:postId', async (req, res, next) => {
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
router.put('/post/:postId', async (req, res, next) => {
    const postId = new ObjectId(req.params.postId);
    const { text } = req.body;

    if (!text) {
        res.status(403).send('Required parameters missing. Please provide both "title" and "text".');
        return;
    }

    try {
        const updateResponse = await col.updateOne({ _id: postId }, { $set: { text } });

        if (updateResponse.matchedCount === 1) {
            res.send(`Post with id ${postId} updated successfully.`);
        } else {
            res.send('Post not found with the given id.');
        }
    } catch (error) {
        console.error(error);
    }
});

// all posts of a user

// GET ALL POSTS FOR A SPECIFIC EMAIL /api/v1/posts/:email
router.get('/posts/:userId', async (req, res, next) => {
    const userId = req.params.userId;

    if (!ObjectId.isValid(userId)) {
        res.status(403).send(`Invalid user id`);
        return;
    }

    try {
        const projection = { _id: 1, title: 1, text: 1, time: 1, userId: 1, likes: 1, userImage: 1 }
        const cursor = col.find({ userId: new ObjectId(userId) }).sort({ _id: -1 }).project(projection);
        const results = await cursor.toArray();

        console.log(results);
        res.send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// profile

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
                profileImage: result.profileImage
            },
            id: userId
        });

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

// ping auth

router.use('/ping', async (req, res, next) => {

    try {
        let result = await userCollection.findOne({ email: req.body.decoded.email });
        console.log("result: ", result); // [{...}] []
        res.send({
            message: 'profile fetched',
            data: {
                isAdmin: result.isAdmin,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                userId: result._id,
                profileImage: result.profileImage,
            }
        });

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(401).send('UnAuthorized');
    }
})

// search

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
                {
                    $project: {
                        embedding: 0,
                        score: { "$meta": "searchScore" },
                        scoreDetails: { "$meta": "searchScoreDetails" }
                    }
                }
            ])
            .toArray();

        res.send(documents);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during search');
    }
});

router.post('/post/:postId/dolike', async (req, res, next) => {

    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send(`Invalid post id`);
        return;
    }

    try {
        const doLikeResponse = await col.updateOne(
            { _id: new ObjectId(req.params.postId) },
            {
                $addToSet: {
                    likes: {
                        userId: new ObjectId(req.body.userId),
                        firstName: req.body.decoded.firstName,
                        lastName: req.body.decoded.lastName,
                        profileImage: req.body.profileImage,
                    }
                }
            }
        );
        console.log("doLikeResponse: ", doLikeResponse);
        res.send('like done');
    } catch (e) {
        console.log("error like post mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

router.delete('/post/:postId/undolike', async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;

        // Check if the post ID is valid
        if (!ObjectId.isValid(postId)) {
            res.status(403).send('Invalid post id');
            return;
        }

        // Update the post to remove the like by the specified user
        const updateResult = await col.updateOne(
            { _id: new ObjectId(postId) },
            {
                $pull: {
                    likes: { userId: new ObjectId(userId) }
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            res.status(404).send('Post not found');
            return;
        }

        res.status(200).send('Like removed successfully');
    } catch (error) {
        console.error('Error removing like:', error);
        res.status(500).send('Server error, please try later');
    }
});

router.get('/likes/:postId', async (req, res, next) => {
    const postId = req.params.postId;

    if (!ObjectId.isValid(postId)) {
        res.status(403).send(`Invalid post id`);
        return;
    }

    try {
        let result = await col.findOne({ _id: new ObjectId(postId) });

        if (result) {
            console.log("result: ", result);
            res.status(200).send(result.likes);
        } else {
            res.status(404).send('Post not found');
        }
    } catch (e) {
        console.log("error getting data from MongoDB: ", e);
        res.status(500).send('Server error, please try later');
    }
});

// profile picture upload

router.post('/profilePicture', (req, res, next) => {
    req.decoded = { ...req.body.decoded }
    next();
},
    upload.any(), async (req, res, next) => {

        if (req.files[0].size > 2000000) { // size bytes, limit of 2MB
            res.status(403).send({ message: 'File size limit exceed, max limit 2MB' });
            return;
        }

        bucket.upload(
            req.files[0].path,
            {
                destination: `profiles/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
            },
            function (err, file, apiResponse) {
                if (!err) {
                    // console.log("api resp: ", apiResponse);

                    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    }).then(async (urlData, err) => {
                        if (!err) {
                            console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                            try {
                                const updateResponse = await userCollection.updateOne(
                                    { _id: new ObjectId(req.body.userId) },
                                    { $set: { profileImage: urlData[0] } }
                                );
                                console.log(updateResponse)

                                res.send('profile uploaded');
                            } catch (e) {
                                console.log("error inserting mongodb: ", e);
                                res.status(500).send({ message: 'server error, please try later' });
                            }

                            // // delete file from folder before sending response back to client (optional but recommended)
                            // // optional because it is gonna delete automatically sooner or later
                            // // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder

                            try {
                                fs.unlinkSync(req.files[0].path)
                                //file removed
                            } catch (err) {
                                console.error(err)
                            }
                        }
                    })
                } else {
                    console.log("err: ", err)
                    res.status(500).send({
                        message: "server error"
                    });
                }
            });
})

export default router