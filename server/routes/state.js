const express = require("express");
const expressWs = require("express-ws");
const router = express.Router();
const HOST_COMMAND = require("../consts/hostCommand");
const manager = require("../manager");
/**
 * receive fan control command and pc temperature data
 */
router.ws("/state", function(ws, req) {
  ws.on("message", msg => {
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
      case HOST_COMMAND.STATE:
        manager.updateHost(req, data.type, data);
        break;
      case HOST_COMMAND.SPEED:
        if (data.speed >= 0 && data.speed <= 1) {
          manager.setSpeed(data.speed);
        }
        manager.updateHost(req, data.type);
        break;
      default:
        console.debug("unknown command", msg);
        manager.updateHost(req, HOST_COMMAND.UNKNOWN);
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
        fanList: manager.getFanList().map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            load: manager.getSpeed(),
            rpm: item.rpm
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
