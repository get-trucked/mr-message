"use strict";
const when = require("when");
const _ = require("lodash");
let Sender = require('node-xcs').Sender;
// let Result = require('node-xcs').Result;
let Message = require('node-xcs').Message;
let Notification = require('node-xcs').Notification;
class MessageSender {
    constructor(log, senderID, serverKey) {
        this.log = log;
        this.senderID = senderID;
        this.serverKey = serverKey;
    }
    connect() {
        return when.promise((resolve, reject) => {
            this.client = new Sender(this.senderID, this.serverKey);
            this.client.on('connected', () => {
                this.log.debug(`${this.constructor.name}: connected to firebase`);
                resolve(true);
            });
            this.client.on('error', (err) => {
                this.log.debug(`${this.constructor.name}: firebase error`, err);
                reject(new Error(err));
            });
        });
    }
    send(data) {
        let message = this.buildMessage(data, this.buildNotification());
        return this.sendMessage(message, data.to);
    }
    buildNotification() {
        return new Notification('ic_launcher')
            .title('Hello buddy!')
            .body('node-xcs is awesome.')
            .build();
    }
    buildMessage(data, notification) {
        let message = new Message('messageId_1046')
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
    sendMessage(message, to) {
        return when.promise((resolve, reject) => {
            this.client.sendNoRetry(message, to, (result) => {
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
exports.MessageSender = MessageSender;
//# sourceMappingURL=MessageSender.js.map