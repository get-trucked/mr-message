import * as express from 'express';

let v1 = express.Router();

/* GET home page. */
v1.get('/', (req, res, next) => {
  res.send({});
});

export { v1 };
