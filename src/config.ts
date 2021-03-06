import * as convict from 'convict';

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
        doc: 'Logging level.',
        format: [ 'emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug'],
        default: 'info',
        env: 'LOG_LEVEL'
    },
    firebaseSenderID: {
        doc: 'Firebase sender ID.',
        format: String,
        default: '',
        env: 'FIREBASE_ID'
    },
    firebaseServerKey: {
        doc: 'Firebase server key.',
        format: String,
        default: '',
        env: 'FIREBASE_KEY'
    }
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
    env: <string>conf.get('env'),
    logLevel: <string>conf.get('logLevel'),
    port: <number>conf.get('port'),
    firebase: {
        senderID: <string>conf.get('firebaseSenderID'),
        serverKey: <string>conf.get('firebaseServerKey'),
    }
};

export { config };
