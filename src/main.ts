import { Server } from './Server';
import { MessageSender } from './MessageSender';
import { config } from './config';
import { logger as log } from './logger';
import * as api from './api';

function main() {
    log.notice('starting with config: ', config);

    let messageSender = new MessageSender(log, config.firebase.senderID, config.firebase.serverKey);

    let server = new Server(log, config.port);
    server.addRoutes([{route: '/api/v1', router: api.v1}]);

    return server.start()
    .then(() => messageSender.connect()
    .then(() => log.debug('server ready')));
}

main();
