import * as winston from 'winston';

import { Server } from './Server';
import { config } from './config';
import * as api from './api';

function main() {
    let logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)()
        ]
    });
    logger.setLevels(winston.config.syslog.levels);
    logger.level = config.logLevel;
    logger.notice('starting with config: ', config);

    let server = new Server(logger, config.port);
    server.addRouters([{route: '/api/v1', router: api.v1}]);

    return server.start();
}

main();
