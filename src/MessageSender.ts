import * as when from 'when';
import * as winston from 'winston';

let Sender = require('node-xcs').Sender;
// let Result = require('node-xcs').Result;
// let Message = require('node-xcs').Message;
// let Notification = require('node-xcs').Notification;

export class MessageSender {
    private client: NodeJS.EventEmitter;

    constructor(private log: winston.LoggerInstance, private senderID: string, private serverKey: string) {
    }

    connect(): when.Promise<boolean> {
        return when.promise<boolean>((resolve, reject) => {
            this.client = new Sender(this.senderID, this.serverKey);

            this.client.on('connected', () => {
                this.log.debug('connected to firebase');
                resolve(true);
            });

            this.client.on('error', (err: string) => {
                this.log.debug('firebase error', err);
                reject(new Error(err));
            });
        });
    }

}
