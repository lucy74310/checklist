const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const Schema = mongoose.Schema;

/*
List
*/
const listSchema = new Schema(
  {
    user_id: { type: ObjectId, required: true, ref: "user" },
    name: { type: String, required: true, maxlength: 50 },
    goal_count: { type: Number, required: true },
  },
  { timestamps: true }
);

const List = model("list", listSchema);

module.exports = { List };
