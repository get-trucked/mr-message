import * as when from 'when';
import * as winston from 'winston';
import * as _ from 'lodash';

let Sender = require('node-xcs').Sender;
// let Result = require('node-xcs').Result;
let Message = require('node-xcs').Message;
let Notification = require('node-xcs').Notification;

export interface Message {
    id: string;
    priority: string;
    dryRun?: boolean;
    to: string;
    deliveryReceiptRequested: boolean;
    data: {
        [key: string]: any;
    };
}

export class MessageSender {
    private client: any; // TODO write an interface for this

    constructor(private log: winston.LoggerInstance, private senderID: string, private serverKey: string) {
    }

    connect(): when.Promise<boolean> {
        return when.promise<boolean>((resolve, reject) => {
            this.client = new Sender(this.senderID, this.serverKey);

            this.client.on('connected', () => {
                this.log.debug(`${this.constructor.name}: connected to firebase`);
                resolve(true);
            });

            this.client.on('error', (err: string) => {
                this.log.debug(`${this.constructor.name}: firebase error`, err);
                reject(new Error(err));
            });
        });
    }

    send(data: Message): when.Promise<any> {
        let message = this.buildMessage(data, this.buildNotification());
        return this.sendMessage(message, data.to);
    }

    private buildNotification() {
        return new Notification('ic_launcher')
            .title('Hello buddy!')
            .body('node-xcs is awesome.')
            .build();
    }

    private buildMessage(data: Message, notification: any) {
        let message =  new Message('messageId_1046')
            .notification(notification)
            .priority(data.priority)
            .notification(notification)
            .deliveryReceiptRequested(data.deliveryReceiptRequested);

        _.forEach(data.data, (data, key) => {
            message.addData(key, data);
        });

        message.build();
        return message;
    }

    private sendMessage(message: any, to: string) {
        return when.promise((resolve, reject) => {
            this.client.sendNoRetry(message, to, (result: any) => {
                if (result.getError()) {
                    this.log.debug(`${this.constructor.name}: send error`, {
                        id: message.id,
                        err: result.getErrorDescription()
                    });
                    reject(new Error(result.getErrorDescription()));
                    return;
                }
                resolve(result);
            });
        });
    }
}
