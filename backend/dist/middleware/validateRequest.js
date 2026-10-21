"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
/** handles potential validation errors (to be used with express-validator) */
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        throw new Error(JSON.stringify(errors.array()));
    next();
};
exports.validateRequest = validateRequest;
