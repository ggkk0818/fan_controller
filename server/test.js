const RPMReader = require("./model/RPMReader");
const PWM = require("./model/PWM");
let reader = new RPMReader(27);
reader.on("update", val => {
  console.log("rpm", val);
});

let pwm = new PWM(18);
pwm.percent = 1;
