"use strict";
const Server_1 = require("./Server");
const MessageSender_1 = require("./MessageSender");
const config_1 = require("./config");
const logger_1 = require("./logger");
const api = require("./api");
function main() {
    logger_1.logger.notice('starting with config: ', config_1.config);
    let messageSender = new MessageSender_1.MessageSender(logger_1.logger, config_1.config.firebase.senderID, config_1.config.firebase.serverKey);
    let server = new Server_1.Server(logger_1.logger, config_1.config.port);
    server.addRoutes([{ route: '/api/v1', router: api.v1 }]);
    return server.start()
        .then(() => messageSender.connect()
        .then(() => logger_1.logger.debug('server ready')));
}
main();
//# sourceMappingURL=main.js.map