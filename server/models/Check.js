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
  Check_id: {
    type: Schema.Types.ObjectId,
    ref: "Check",
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
