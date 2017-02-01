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
    env: <string>conf.get('env'),
    logLevel: <string>conf.get('logLevel'),
    port: <number>conf.get('port')
};

export { config };
