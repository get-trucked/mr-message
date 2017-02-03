"use strict";
const winston = require("winston");
const config_1 = require("./config");
let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)()
    ]
});
exports.logger = logger;
logger.setLevels(winston.config.syslog.levels);
logger.level = config_1.config.logLevel;
//# sourceMappingURL=logger.js.map