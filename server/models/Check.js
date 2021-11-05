const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

/*
Check (One by One)
*/
const checkSchema = new Schema(
  {
    list_id: { type: ObjectId, ref: "list" },
    user_id: { type: ObjectId, ref: "user" },
    done: { type: Boolean, default: false },
    num_in_list: { type: Number },
    date: { type: Date },
    content: { type: String },
    order: { type: Number },
  },
  { timestamps: true }
);

const Check = model("check", checkSchema);

module.exports = { Check };
