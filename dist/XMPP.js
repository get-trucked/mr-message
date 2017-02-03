"use strict";
const when = require("when");
let Sender = require('node-xcs').Sender;
// let Result = require('node-xcs').Result;
// let Message = require('node-xcs').Message;
// let Notification = require('node-xcs').Notification;
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
                this.log.debug('connected to firebase');
                resolve(true);
            });
            this.client.on('error', (err) => {
                this.log.debug('firebase error', err);
                reject(err);
            });
        });
    }
}
exports.MessageSender = MessageSender;
//# sourceMappingURL=XMPP.js.map