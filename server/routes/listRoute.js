const express = require("express");
const listRoute = express.Router();
const { User, List, Todo } = require("../models");
const { auth } = require("../middleware/auth");
const { isValidObjectId } = require("mongoose");

// Create List
listRoute.post("/", auth, async (req, res) => {
  try {
    const { title, goal_count } = req.body;
    const user_id = req.user.id;

    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required" });

    if (typeof goal_count !== "number")
      return res.status(400).send({ err: "goal_count is required" });

    const list = new List({ ...req.body, user_id });

    await list.save();
    return res.send({ list });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// Get All Cheklist
listRoute.get("/", auth, async (req, res) => {
  try {
    const lists = await List.find({ user_id: req.user._id });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// Get List Detail
listRoute.get("/detail/:listId", auth, async (req, res) => {
  try {
    const { listId } = req.params;

    if (!isValidObjectId(listId))
      return res.status(400).send({ err: "listId is invalid" });

    const list = await List.findOne({
      _id: listId,
      populate: [{ path: "Todo" }],
    });

    return res.send({ list });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

listRoute.put("/:listId", auth, async (req, res) => {
  try {
    const { listId } = req.params;

    if (!isValidObjectId(listId))
      return res.status(400).send({ err: "listId is not available" });

    const { name, goal_count } = req.body;

    if (typeof name !== "string")
      return res.status(400).send({ err: "name is required" });

    if (typeof goal_count !== "number")
      return res.status(400).send({ err: "goal_count is required" });

    const list = await List.findOneAndUpdate(
      listId,
      { name, goal_count },
      { new: true }
    );

    if (!list) return res.status(400).send({ err: "listId does not exist" });

    return res.send({ list });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  listRoute,
};
