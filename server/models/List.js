const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// cheklist

/**
 * List
 * name(리스트명)
 * user_id
 * days(목표일수)
 * is_done
 *
 * list_no [primary key (unique)]
 *
 */

/**
 * Check
 *
 * list_no
 * date
 * count
 * is_done
 *
 *
 */
const listSchema = Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    maxlength: 50,
  },
  goal_count: {
    type: Number,
  },
  ins_timestamp: {
    type: Date,
    default: Date.now,
  },
});

const List = mongoose.model("List", listSchema);

module.exports = { List };
