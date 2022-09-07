"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validate = function (schema) { return function (req, res, _next) {
    try {
        schema.parse({
            body: req.body,
            params: req.params
        });
        return;
    }
    catch (e) {
        return res.status(400).send(e.errors);
    }
}; };
exports.default = validate;
