const mongoose = require('mongoose');

// 정성표

/**
 * User
 * 
 * id
 * name
 * password
 */

/**
 * List
 * name(정성표명)
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
const userSchema = mongoose.Schema({
  name : {
      type: String,
      maxlength: 50,
  },
  email : {
      type: String,
      trim: true,
      unique : 1
  },
  password: {
      type: String,
      minlength: 5
  },
  lastname : {
      type: String,
      maxlength: 50
  },
  role: {
      type: Number,
      default: 0
  },
  image: String,
  token: {
      type: String
  },
  tokenExp: {
      type: Number
  }

})