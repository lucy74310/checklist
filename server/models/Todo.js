const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

/*
Todo (One by One)
*/
const TodoSchema = new Schema(
  {
    title: { type: String },
    date: { type: Date },
    done: { type: Boolean, default: false },
    content: { type: String },
    day_order: { type: Number }, // 하루의 todo list 에서의 순서
    goal_order: { type: Number }, // 목표 리스트에서의 순서
    list_id: { type: ObjectId, ref: "list" },
    user_id: { type: ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const Todo = model("todo", TodoSchema);

module.exports = { Todo };
