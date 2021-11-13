const { Router } = require("express");
const todoRoute = Router();
const { Todo } = require("../models");
const { auth } = require("../middleware/auth");
const { isValidObjectId } = require("mongoose");

todoRoute.post("/", auth, async (req, res) => {
  try {
    const { title, date, comment, day_order } = req.body;
    const userId = req.user._id;
    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required" });

    if (typeof date !== "string")
      return res.status(400).send({ err: "goal_count is required" });

    if (typeof day_order !== "number")
      return res.status(400).send({ err: "day_order is required" });

    const todo = new Todo({ ...req.body, userId });
    await todo.save();
    return res.json({ todo });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

todoRoute.patch("/:todoId", auth, async (req, res) => {
  try {
    const { todoId } = req.params;
    const { done, day_order } = req.body;
    if (typeof done !== "boolean" && typeof day_order !== "number")
      return res.status(400).send({ err: "There is no data to update" });
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId },
      { done, day_order },
      { new: true }
    );
    return res.send({ todo });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

todoRoute.put("/:todoId", auth, async (req, res) => {
  try {
    const { todoId } = req.params;
    const { title, comment, date } = req.body;
    if (
      typeof title !== "string" &&
      typeof comment !== "string" &&
      typeof date !== "string"
    )
      return res.status(400).send({ err: "There is no data to update" });

    const todo = await Todo.findOneAndUpdate(
      { _id: todoId },
      { title, comment, date },
      { new: true }
    );
    return res.send({ todo });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  todoRoute,
};
