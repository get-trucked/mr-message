import * as winston from 'winston';

import { config } from './config';

let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)()
    ]
});
logger.setLevels(winston.config.syslog.levels);
logger.level = config.logLevel;

export { logger };
