const express = require("express");

const listRouter = express.Router();

const { User } = require("../models/User");
const { List } = require("../models/List");
const { Check } = require("../models/Check");

const { auth } = require("../middleware/auth");

/**
 * Get All Cheklist
 */
listRouter.get("/", auth, (req, res) => {
  console.log(req.user);
  res.send("hello this is lists api~");
  const getListQuery = List.find({ user_id: req.user._id });
  const lists = await getListQuery;
  console.log(lists);
});

/*
 * Get One Checklist
 */
listRouter.get("/:listId", auth, async (req, res) => {
  console.log(req.user);
  const { listId } = req.params;

  const list = await List.findById(listId);

  console.log(lists);
});

/**
 * Create 체크리스트
 *
 * - Request Param
 * name
 * goal_count
 *
 */

listRouter.post("/", auth, (req, res) => {
  console.log(req.body);
  console.log(req);
  const list = new List({
    name: req.body.name,
    goal_count: req.body.goal_count,
    user_id: req.user._id,
  });

  list.save((err, listInfo) => {
    if (err) return res.json({ success: false, err });

    return res.json({
      success: true,
    });
  });
});

module.exports = {
  listRouter,
};
