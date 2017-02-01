import { Server } from './Server';
import { config } from './config';
import { logger } from './logger';
import * as api from './api';

function main() {
    let server = new Server(logger, config.port);
    server.addRoutes([{route: '/api/v1', router: api.v1}]);

    return server.start();
}

main();
