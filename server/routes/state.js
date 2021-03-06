const express = require("express");
const expressWs = require("express-ws");
const WebSocket = require("ws");
const router = express.Router();
const HOST_COMMAND = require("../consts/hostCommand");
const manager = require("../manager");
/**
 * receive fan control command and pc temperature data
 */
router.ws("/state", function(ws, req) {
  manager.updateHost(req); // add host
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
      case HOST_COMMAND.MODE:
        manager.setMode(data.mode);
        manager.updateHost(req, data.type);
        break;
      default:
        console.debug("unknown command", msg);
        manager.updateHost(req, HOST_COMMAND.UNKNOWN);
        break;
    }
  });
  ws.on("close", () => {
    manager.updateHost(req);
  });
});
/**
 * send fan state to all clients every second
 */
setInterval(() => {
  router.wsInstance.getWss("/api/state").clients.forEach(ws => {
    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }
    let host = manager.getHostByWs(ws);
    ws.send(
      JSON.stringify({
        type: "state",
        mode: manager.getMode(),
        speed: manager.getSpeed(),
        fanList: manager.getFanList().map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            load: item.load,
            rpm: item.rpm
          };
        }),
        hostList: manager.hostList.map(item => ({
          id: item.id,
          name: item.name,
          ip: item.ip,
          cmdList: item.cmdList,
          hostData: item.hostData,
          avgData: item.avgData,
          state: item.state,
          isCurrent: item === host
        }))
      })
    );
  });
}, 1000);
/**
 * broadcasts when speed changed
 */
manager.on("update_speed", speed => {
  router.wsInstance.getWss("/api/state").clients.forEach(ws => {
    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }
    ws.send(
      JSON.stringify({
        type: "speed",
        speed
      })
    );
  });
});
manager.on("update_mode", mode => {
  router.wsInstance.getWss("/api/state").clients.forEach(ws => {
    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }
    ws.send(
      JSON.stringify({
        type: "mode",
        mode
      })
    );
  });
});
module.exports = router;
