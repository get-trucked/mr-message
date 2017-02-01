"use strict";
const express = require("express");
let v1 = express.Router();
exports.v1 = v1;
/* GET home page. */
v1.get('/', (req, res, next) => {
    res.send({});
});
//# sourceMappingURL=api-v1.js.map