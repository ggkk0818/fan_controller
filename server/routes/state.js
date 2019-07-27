const express = require("express");
const expressWs = require("express-ws");
const router = express.Router();
const manager = require("../manager");
const wsInstance = expressWs(router);
/**
 * receive fan control command and pc temperature data
 */
router.ws("/state", function(ws, req) {
  ws.on("message", msg => {
    //TODO receive pc state
    let data = null;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      console.debug("invalid socket message", msg);
    }
    if (data == null) {
      return;
    }
    switch (data.type) {
      case "state":
        manager.setState(data);
        break;
      case "speed":
        if (data.speed >= 0 && data.speed <= 1) {
          manager.setSpeed(data.speed);
        }
        break;
      default:
        console.debug("unknown command", msg);
        break;
    }
  });
  ws.on("close", () => {});
});
/**
 * send fan state to all clients every second
 */
setInterval(() => {
  router.wsInstance.getWss("/api/state").clients.forEach(ws => {
    ws.send(
      JSON.stringify({
        type: "state",
        speed: manager.getSpeed(),
        fanList: manager.getRpm().map((item, index) => {
          return {
            id: index,
            name: `Fan${index}`,
            load: manager.getSpeed(),
            rpm: item
          };
        })
      })
    );
  });
}, 1000);
/**
 * broadcasts when speed changed
 */
manager.on("update_speed", speed => {
  router.wsInstance.getWss().clients.forEach(ws => {
    ws.send(
      JSON.stringify({
        type: "speed",
        speed
      })
    );
  });
});
module.exports = router;
