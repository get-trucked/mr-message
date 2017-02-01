"use strict";
const Server_1 = require("./Server");
const config_1 = require("./config");
const logger_1 = require("./logger");
const api = require("./api");
function main() {
    let server = new Server_1.Server(logger_1.logger, config_1.config.port);
    server.addRoutes([{ route: '/api/v1', router: api.v1 }]);
    return server.start();
}
main();
//# sourceMappingURL=main.js.map