"use strict";
const express = require("express");
const when = require("when");
const _ = require("lodash");
class Server {
    constructor(log, port) {
        this.log = log;
        this.port = port;
        this.app = express();
    }
    addRouters(routers) {
        _.forEach(routers, (router) => {
            this.app.use(router.route, router.router);
        });
    }
    start() {
        return when.promise((resolve, reject) => {
            this.server = this.app.listen(this.port)
                .on('listening', () => {
                this.log.info('listening on port: ', this.port);
                resolve(true);
            })
                .on('error', (err) => {
                this.log.error('error binding to port', { port: this.port });
                reject(err);
            });
        });
    }
    stop() {
        return when.promise((resolve, reject) => {
            try {
                this.server.close(() => {
                    this.log.debug('server shutdown');
                    resolve(true);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map