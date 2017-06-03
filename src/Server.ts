import * as express from 'express';
import * as winston from 'winston';
import * as when from 'when';
import * as _ from 'lodash';
import * as http from 'http';

const expressWinston = require('express-winston');

export class Server {
    private app: express.Express;
    private server: http.Server;

    constructor(private log: winston.LoggerInstance, private port: number) {
        this.app = express();
        this.app.use(expressWinston.logger({
          transports: [
            new winston.transports.Console({
              json: true,
              colorize: true
            })
          ],
          meta: true, // optional: control whether you want to log the meta data about the request (default to true)
          msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g.
          // '{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}'
          expressFormat: true,
          colorize: true
        }));


    }

    public addRoutes(routers: { route: string, router: express.Router }[]): void {
        _.forEach(routers, (router) => {
            this.app.use(router.route, router.router);
        });
    }

    public start(): when.Promise<boolean> {
        return when.promise<boolean>((resolve, reject) => {
            this.server = this.app.listen(this.port)
            .on('listening', () => {
                this.log.info('listening on port: ', this.port);
                resolve(true);
            })
            .on('error', (err) => {
                this.log.error('error binding to port', { port: this.port});
                reject(err);
            });
        });
    }

    public stop(): when.Promise<boolean> {
        return when.promise<boolean>((resolve, reject) => {
            try {
                this.server.close(() => {
                    this.log.debug('server shutdown');
                    resolve(true);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}
