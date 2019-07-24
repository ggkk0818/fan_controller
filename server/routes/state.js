const express = require("express");
const router = express.Router();
const manager = require("../manager");

/**
 * send fan state every second
 * receive fan control command and pc temperature data
 */
router.ws("/state", function(ws, req) {
  let timer = setInterval(() => {
    ws.send(
      JSON.stringify({
        speed: manager.getSpeed()
      })
    );
  }, 1000);
  ws.on("message", msg => {
    //TODO receive pc state
    console.log("ws msg", msg);
  });
  ws.on("close", () => {
    clearInterval(timer);
  });
});

module.exports = router;
