const express = require("express");
const router = express.Router();
const manager = require("../manager");

/* GET home page. */
// 定义一个 get 请求 path 为根目录
router.post("/speed", function(req, res, next) {
  let speed = parseFloat(req.body.speed);
  if (speed >= 0 && speed <= 1) {
    manager.setSpeed(speed);
    res.json({ code: 200 });
  } else {
    res.status(400).json({ code: 400, message: "invalid speed argument" });
  }
});

module.exports = router;
