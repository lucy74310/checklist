const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 *
 * Check
 *
 * Check_id
 * order
 * content
 * is_done
 *
 */
const checkSchema = Schema({
  list_id: {
    type: Schema.Types.ObjectId,
    ref: "List",
  },

  done: {
    type: Boolean,
  },
  order: {
    type: Number,
  },
  date: {
    type: Date,
  },
  content: {
    type: String,
  },
});

const Check = mongoose.model("Check", checkSchema);

module.exports = { Check };
