const RPM = require("./RPM");
const PWM = require("./PWM");
let rpm = new RPM(27);
rpm.on("update", val => {
  console.log("rpm", val);
});

let pwm = new PWM(18);
pwm.setPercent(1);
