const express = require("express");
const listRoute = express.Router();
const { User, List, Todo } = require("../models");
const { auth } = require("../middleware/auth");
const { isValidObjectId } = require("mongoose");
const moment = require("moment");

// POST:/list 리스트생성
listRoute.post("/", auth, async (req, res) => {
  try {
    const { title, goal_count, type, start_date } = req.body;
    const user_id = req.user.id;

    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required" });

    if (typeof goal_count !== "number")
      return res.status(400).send({ err: "goal_count is required" });

    if (typeof type !== "string")
      return res.status(400).send({ err: "type is required" });

    // list
    let list = new List({ ...req.body, user_id });

    // todo save
    let interval = 0;
    let todoInsert = [];
    if (type == "everyday") {
      if (!start_date) {
        start_date = moment().format("YYYY-MM-DD");
      }
      interval = 1;
    }
    let addDays = 0;
    for (let i = 0; i < goal_count; i++) {
      if (i != 0) {
        addDays += interval;
      }

      let todo = new Todo({
        title: title,
        date:
          type == "after"
            ? null
            : new Date(moment(start_date, "YYYY-MM-DD").add(addDays, "days")),
        done: false,
        goal_order: i + 1,
        list_id: list._id,
        user_id: user_id,
      });
      todoInsert.push(todo);
    }
    const todo = await Todo.insertMany(todoInsert);
    const todo_id = todo.map((todo) => todo._id);
    list.todos = todo_id;
    await list.save();

    return res.send({ list });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// GET:/list 로그인한 유저의 모든 list
listRoute.get("/", auth, async (req, res) => {
  try {
    const list = await List.find({ user_id: req.user._id });
    return res.json({ list });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// GET:/list/:listId 특정 list의 정보
listRoute.get("/:listId", auth, async (req, res) => {
  try {
    const { listId } = req.params;
    console.log(listId);
    if (!isValidObjectId(listId))
      return res.status(400).send({ err: "listId is invalid" });

    const list = await List.findOne({ _id: listId })
      .populate(["todos"])
      .sort({ "todos.goal_order": "asc" });

    return res.send({ list });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

// GET:/list/date/:date 특정한 날짜에 해야할 todolist
listRoute.get("/date/:date", auth, async (req, res) => {
  try {
    const { date } = req.params;
    const todos = await Todo.find({
      date: {
        $gte: new Date(date + " 00:00:00"),
        $lte: new Date(date + " 23:59:59"),
      },
    }).sort({ day_order: 1 });
    return res.json({ todos });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

// GET:/list/month/:month 특정한 달에 done 카운트
listRoute.get("/month/:yearMonth", auth, async (req, res) => {
  try {
    let { yearMonth } = req.params;
    yearMonth = yearMonth.split("-");
    const inputYear = parseInt(yearMonth[0]);
    const inputMonth = parseInt(yearMonth[1]);
    if (inputYear < 1970 || inputYear > 2100)
      return res.status(400).json({ err: "Invalid year." });
    if (inputMonth < 1 || inputMonth > 12)
      return res.status(400).json({ err: "Invalid month." });

    const startDate = new Date(inputYear, inputMonth - 1, 1);
    const endDate = new Date(inputYear, inputMonth, 0, 23, 59, 59);
    let todo_all = await Todo.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            date: "$date",
            done: "$done",
          },
          doneCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          done_result: {
            $push: {
              done: "$_id.done",
              count: "$doneCount",
            },
          },
          count: { $sum: "$doneCount" },
        },
      },
      {
        $sort: {
          date: 1,
          done: 1,
        },
      },
    ]);
    let month = {};
    let dateString;
    for (let i = 0; i < todo_all.length; i++) {
      dateString = moment(todo_all[i]._id).format("YYYY-MM-DD");
      month[dateString] = {
        count: todo_all[i].count,
        done_count: null,
        all_done: false,
      };
      for (let done_result of todo_all[i].done_result) {
        if (done_result.done === true) {
          month[dateString].done_count = done_result.count;
          month[dateString].all_done =
            done_result.count === month[dateString].count ? true : false;
        }
      }
    }

    return res.json({ month });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});
// PUT: /list/:listId 제목수정
listRoute.put("/:listId", auth, async (req, res) => {
  try {
    const { listId } = req.params;

    if (!isValidObjectId(listId))
      return res.status(400).send({ err: "listId is not available" });

    const { title, goal_count } = req.body;

    if (typeof title !== "string")
      return res.status(400).send({ err: "name is required" });

    const [list] = await Promise.all([
      List.findOneAndUpdate({ _id: listId }, { title }, { new: true }),
      Todo.updateMany({ list_id: listId }, { title }),
    ]);

    if (!list) return res.status(400).send({ err: "listId does not exist" });

    return res.send({ list });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  listRoute,
};
