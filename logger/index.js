const log4js = require("log4js");
log4js.configure({
  appenders: { errors: { type: "file", filename: "errors.log" } },
  categories: { default: { appenders: ["errors"], level: "error" } }
});

const logger = log4js.getLogger("errors");
module.exports = logger;
