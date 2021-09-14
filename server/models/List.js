const mongoose = require('mongoose');

// cheklist

/**
 * User
 * 
 * id
 * name
 * password
 */

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
const listSchema = mongoose.Schema({
    list_id: {
        type: Number,
    },
    name: {
        type: String,
        maxlength: 50,
    },
    user_email: {
        type: String
    },
    goal_days: {
        type: Number
    },
    checked_days: {
        type: Number
    },
    ins_timestamp: {
        type: TimeRanges
    }

    

})