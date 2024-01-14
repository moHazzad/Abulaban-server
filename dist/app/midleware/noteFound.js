"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Route Not Found for ${req.originalUrl}`,
    });
};
exports.default = notFound;
