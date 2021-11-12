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

    // list save
    let list = new List({ ...req.body, user_id });
    await list.save();
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
            : new Date(
                moment(start_date, "YYYY-MM-DD 00:00:00").add(addDays, "days")
              ),
        done: false,
        goal_order: i + 1,
        list_id: list._id,
        user_id: user_id,
      });
      todoInsert.push(todo);
    }
    const todos = await Todo.insertMany(todoInsert);
    const todos_id = todos.map((todo) => todo._id);
    List.findOneAndUpdate({ _id: list._id }, { todos: todos_id });

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
    });
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
    const year = parseInt(yearMonth[0]);
    const month = parseInt(yearMonth[1]);
    if (year < 1970 || year > 2100)
      return res.status(400).json({ err: "Invalid year." });
    if (month < 1 || month > 12)
      return res.status(400).json({ err: "Invalid month." });

    const days = new Date(year, month, 0).getDate(); // 0 은 전달의 마지막날을 반환하는데 month는 0부터 1월이므로 2021,12,0 하면 12월의 마지막 날을 반환한다.

    let test = await Todo.aggregate([
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
        $project: {},
      },
    ]);

    // for (let i = 0; i < days; i++) {
    //   Todo.aggregate([{ $group: "$date" }]);
    // }
    return res.json({ test });
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
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  listRoute,
};
