const express = require("express");
const router = express.Router();
const manager = require("../manager");

/* GET home page. */
// 定义一个 get 请求 path 为根目录
router.ws("/state", function(ws, req) {
  let timer = setInterval(() => {
    ws.send(
      JSON.stringify({
        speed: manager.getSpeed()
      })
    );
  }, 1000);
  ws.on("message", msg => {
    console.log("ws msg", msg);
  });
  ws.on("close", () => {
    clearInterval(timer);
  });
});

module.exports = router;
