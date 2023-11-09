import express from "express";
import { client } from "../mongodb.mjs";
import { ObjectId } from "mongodb";
import openai from "openai";
import admin from "firebase-admin";
import multer, { diskStorage } from "multer";
import fs from "fs";

const db = client.db("weapp");
const col = db.collection("posts");
const userCollection = db.collection("auth");
const commentsCollection = db.collection("comments");

//==============================================
const storageConfig = diskStorage({
  // https://www.npmjs.com/package/multer#diskstorage
  destination: "./uploads/",
  filename: function (req, file, cb) {
    console.log("mul-file: ", file);
    cb(null, `postImg-${new Date().getTime()}-${file.originalname}`);
  },
});
let upload = multer({ storage: storageConfig });
//==============================================

let router = express.Router();

router.post(
  "/comment",
  (req, res, next) => {
    req.decoded = { ...req.body.decoded };
    next();
  },
  upload.any(),
  async (req, res, next) => {
    try {
      const insertResponse = await commentsCollection.insertOne({
        time: new Date(),
        userId: new ObjectId(req.body.userId),
        userImage: req.body.userImage,
        userName: req.body.userName,
        postId: new ObjectId(req.body.postId),
        comment: req.body.comment,
        authorId: req.body.authorId,
      });
      console.log(insertResponse);
      res.send("comment done");
    } catch (e) {
      console.log("error inserting mongodb: ", e);
      res.status(500).send({ message: "server error, please try later" });
    }
  }
);

router.get("/comments/:postId", async (req, res, next) => {
  const postId = new ObjectId(req.params.postId);

  try {
    const cursor = commentsCollection
      .find({ postId: postId })
      .sort({ _id: -1 });
    let results = await cursor.toArray();
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/comment/:commentId", async (req, res, next) => {
  const commentId = new ObjectId(req.params.commentId);
  console.log("commentId", commentId);

  try {
    const deleteResponse = await commentsCollection.deleteOne({
      _id: commentId,
    });
    if (deleteResponse.deletedCount === 1) {
      res.send(`Comment with id ${commentId} deleted successfully.`);
    } else {
      res.send("Comment not found with the given id.");
    }
  } catch (error) {
    console.error(error);
  }
});

router.put("/comment/:commentId", async (req, res, next) => {
  const commentId = new ObjectId(req.params.commentId);

  const { comment } = req.body;

  if (!comment) {
    res
      .status(403)
      .send('Required parameters missing. Please provide comment".');
    return;
  }

  try {
    const updateResponse = await commentsCollection.updateOne(
      { _id: commentId },
      { $set: { comment } }
    );

    if (updateResponse.matchedCount === 1) {
      res.send(`Comment with id ${commentId} updated successfully.`);
    } else {
      res.send("Comment not found with the given id.");
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/post/:postId/dolike", async (req, res, next) => {
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
          },
        },
      }
    );
    console.log("doLikeResponse: ", doLikeResponse);
    res.send("like done");
  } catch (e) {
    console.log("error like post mongodb: ", e);
    res.status(500).send("server error, please try later");
  }
});

router.delete("/post/:postId/undolike", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    // Check if the post ID is valid
    if (!ObjectId.isValid(postId)) {
      res.status(403).send("Invalid post id");
      return;
    }

    // Update the post to remove the like by the specified user
    const updateResult = await col.updateOne(
      { _id: new ObjectId(postId) },
      {
        $pull: {
          likes: { userId: new ObjectId(userId) },
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      res.status(404).send("Post not found");
      return;
    }

    res.status(200).send("Like removed successfully");
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).send("Server error, please try later");
  }
});

router.get("/likes/:postId", async (req, res, next) => {
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
      res.status(404).send("Post not found");
    }
  } catch (e) {
    console.log("error getting data from MongoDB: ", e);
    res.status(500).send("Server error, please try later");
  }
});

// profile picture upload

router.post(
  "/profilePicture",
  (req, res, next) => {
    req.decoded = { ...req.body.decoded };
    next();
  },
  upload.any(),
  async (req, res, next) => {
    if (req.files[0].size > 2000000) {
      // size bytes, limit of 2MB
      res
        .status(403)
        .send({ message: "File size limit exceed, max limit 2MB" });
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
          file
            .getSignedUrl({
              action: "read",
              expires: "03-09-2491",
            })
            .then(async (urlData, err) => {
              if (!err) {
                console.log("public downloadable url: ", urlData[0]); // this is public downloadable url
                try {
                  const updateResponse = await userCollection.updateOne(
                    { _id: new ObjectId(req.body.userId) },
                    { $set: { profileImage: urlData[0] } }
                  );
                  console.log(updateResponse);

                  res.send("profile uploaded");
                } catch (e) {
                  console.log("error inserting mongodb: ", e);
                  res
                    .status(500)
                    .send({ message: "server error, please try later" });
                }

                // // delete file from folder before sending response back to client (optional but recommended)
                // // optional because it is gonna delete automatically sooner or later
                // // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder

                try {
                  fs.unlinkSync(req.files[0].path);
                  //file removed
                } catch (err) {
                  console.error(err);
                }
              }
            });
        } else {
          console.log("err: ", err);
          res.status(500).send({
            message: "server error",
          });
        }
      }
    );
  }
);

export default router;
