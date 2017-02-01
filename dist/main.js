"use strict";
const winston = require("winston");
const Server_1 = require("./Server");
const config_1 = require("./config");
const api = require("./api");
function main() {
    let logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)()
        ]
    });
    logger.setLevels(winston.config.syslog.levels);
    logger.level = config_1.config.logLevel;
    logger.notice('starting with config: ', config_1.config);
    let server = new Server_1.Server(logger, config_1.config.port);
    server.addRouters([{ route: '/api/v1', router: api.v1 }]);
    return server.start();
}
main();
//# sourceMappingURL=main.js.map