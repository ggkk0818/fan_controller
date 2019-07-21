const path = require("path");
const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const expressWs = require("express-ws")(app);
const speedRouter = require("./routes/speed");
const stateRouter = require("./routes/state");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", speedRouter);
app.use("/api", stateRouter);

app.listen(80, () => console.log("Fan conroller app listening on port 80!"));
