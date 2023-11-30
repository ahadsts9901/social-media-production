import express from "express";
import { client } from "../mongodb.mjs";
import { ObjectId } from "mongodb";
import "dotenv/config";

const db = client.db("weapp");
const notifyCol = db.collection("notifications");

let router = express.Router();

router.post(`/notification`, async (req, res, next) => {
  const { fromId, toId, actionId, message } = req.body;

  if (!ObjectId.isValid(fromId)) {
    res.status(403).send(`Invalid id 1`);
    return;
  }

  if (!ObjectId.isValid(toId)) {
    res.status(403).send(`Invalid id 2`);
    return;
  }

  if (!ObjectId.isValid(actionId)) {
    res.status(403).send(`Invalid id 3`);
    return;
  }

  if (!message) {
    res.status(403).send(`message not provided`);
    return;
  }

  try {
    const notifyResp = await notifyCol.insertOne({
      sender: new ObjectId(fromId),
      receiver: new ObjectId(toId),
      action_id: new ObjectId(actionId),
      content: message,
      time: new Date(),
    });

    console.log("Done");

    console.log(notifyResp);

    res.status(200).send("notification sent");
  } catch (error) {
    console.error(error);
  }
});

router.get(`/notifications`, async (req, res, next) => {
  const { userId } = req.body;

  if (!ObjectId.isValid(userId)) {
    res.status(403).send(`Invalid id`);
    return;
  }

  try {
    const getNotifyResp = notifyCol
      .find({
        reciever: new ObjectId(userId),
      })
      .sort({ _id: -1 });

    const notifications = getNotifyResp.toArray();

    console.log(notifications);

    res.status(200).send(notifications);
  } catch (error) {
    console.error(error);
  }
});

router.delete(`/notifications/:notifyId`, async (req, res, next) => {
  const { notifyId } = req.params;

  if (!ObjectId.isValid(notifyId)) {
    res.status(403).send(`Invalid id`);
    return;
  }

  try {
    const deleteNotResp = notifyCol.deleteOne({
      _id: new ObjectId(notifyId),
    });

    console.log(deleteNotResp);

    res.status(200).send(`notification deleted`);
  } catch (error) {
    console.error(error);
  }
});

router.delete(`/delete/notification`, async (req, res, next) => {
  const { fromId, toId, actionId } = req.body;

  if (!ObjectId.isValid(fromId)) {
    res.status(403).send(`Invalid id 1`);
    return;
  }

  if (!ObjectId.isValid(toId)) {
    res.status(403).send(`Invalid id 2`);
    return;
  }

  if (!ObjectId.isValid(actionId)) {
    res.status(403).send(`Invalid id 3`);
    return;
  }

  try {
    const pullNotificationResp = await notifyCol.deleteOne({
      $and: [
        { sender: new ObjectId(fromId) },
        { receiver: new ObjectId(toId) },
        { action_id: new ObjectId(actionId) },
      ],
    });

    if (pullNotificationResp.deletedCount === 1) {
      res.status(200).send(`disliked notification deleted`);
    } else {
      res.status(404).send(`Notification not found`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(`Internal Server Error`);
  }
});

export default router;
