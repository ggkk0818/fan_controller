const RPM = require("./RPM");

let rpm = new RPM(27);
rpm.on("update", val => {
  console.log("rpm", val);
});
