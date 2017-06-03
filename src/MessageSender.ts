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

            this.client.on('online', () => {
                this.log.debug(`${this.constructor.name}: firebase is online`);
            });

            this.client.on('error', (err: string) => {
                this.log.error(`${this.constructor.name}: firebase error`, err);
                reject(new Error(err));
            });

            this.client.on('message', (messageId: string, from: string,  data: any, category: string) => {
                // TODO add message handlers to get what is revieved here
                this.log.debug(messageId, from,  data, category);
            });
            this.client.on('receipt', (messageId: string, from: string,  data: any, category: string) => {
                this.log.debug(messageId, from,  data, category);
            });

            this.client.on('disconnected', console.log);
            this.client.on('error', console.log);
            this.client.on('message-error', console.log);
        });
    }

    send(message: Message): when.Promise<any> {
        let firebaseMag = this.buildMessage(message, this.buildNotification());
        return this.sendMessage(firebaseMag, message.to);
    }

    private buildNotification() {
        return new Notification('ic_launcher')
            .title('Hello buddy!')
            .body('node-xcs is awesome.')
            .build();
    }

    private buildMessage(data: Message, notification: any) {
        let message =  new Message(data.id)
            .notification(notification)
            .priority(data.priority)
            .deliveryReceiptRequested(data.deliveryReceiptRequested);

        _.forEach(data.data, (data, key) => {
            message.addData(key, data);
        });

        message.build();
        return message;
    }

    private sendMessage(message: any, to: string) {
        return when.promise((resolve, reject) => {
            // TODO look into why the client does this. calling a method to check for an error is strange
            // not a normal nodejs callback pattern
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
