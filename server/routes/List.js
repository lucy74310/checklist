const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const { List } = require("../models/List");
const { Check } = require("../models/Check");

const { auth } = require("../middleware/auth");

/**
 * Get All 체크리스트 
 */
router.get("/", auth, (req, res) => {
  res.send("hello this is lists api~");
});


/**
 * Create 체크리스트 
 * 
 * - Request Param
 * name
 * goal_count
 * 
 */

router.post("/", auth, (req, res) => {
  res.
})
module.exports = router;
