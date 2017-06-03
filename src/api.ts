import * as express from 'express';
import * as when from 'when';
import * as request from 'request';

let v1 = express.Router();
let cache: any = {};

/* GET home page. */
v1.get('/', (req, res, next) => {
    res.send({});
});

export {
    v1
};
