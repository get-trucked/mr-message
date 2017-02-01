"use strict";
const convict = require("convict");
// Define a schema
let conf = convict({
    env: {
        doc: 'The applicaton environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    port: {
        doc: 'The port to bind.',
        format: 'port',
        default: 80,
        env: 'PORT'
    },
    logLevel: {
        doc: 'The port to bind.',
        format: String,
        default: 'info',
        env: 'LOG_LEVEL'
    },
});
// Load environment dependent configuration
let env = conf.get('env');
conf.loadFile(`../config/${env}.json`);
// Validate all the things
conf.validate({
    strict: true
});
// Add the config gets to a object so Typescript will check them
const config = {
    env: conf.get('env'),
    logLevel: conf.get('logLevel'),
    port: conf.get('port')
};
exports.config = config;
//# sourceMappingURL=config.js.map