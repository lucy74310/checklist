const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

/*
목표생성
*/
const ListSchema = new Schema(
  {
    user_id: { type: ObjectId, required: true, ref: "user" },
    title: { type: String, required: true, maxlength: 50 },
    goal_count: { type: Number, required: true },
    done_count: { type: Number, default: 0 },
    type: { type: String, required: false },
    todos: [{ type: ObjectId, required: false, ref: "todo" }],
  },
  { timestamps: true }
);

// ListSchema.virtual("todo", {
//   ref: "todo",
//   localField: "_id",
//   foreignField: "list_id",
// });

// ListSchema.set("toObject", { virtuals: true });
// ListSchema.set("toJson", { virtuals: true });
const List = model("list", ListSchema);

module.exports = { List };
