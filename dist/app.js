"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import { UserRoute } from './app/module/user/user.route';
const noteFound_1 = __importDefault(require("./app/midleware/noteFound"));
const Routers_1 = __importDefault(require("./app/Routers"));
const globalErrorHandler_1 = __importDefault(require("./app/midleware/globalErrorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorPreprocessor_1 = __importDefault(require("./app/Error/errors/errorPreprocessor"));
const app = (0, express_1.default)();
// parser
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'], // Update this to your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api', Routers_1.default);
app.get('/', (req, res) => {
    res.send('Abulaban E-commerce is running');
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err, req, res) => {
    // Log the error for server-side debugging
    console.error(err);
    // Process the error using your errorPreprocessor function or similar
    const { statusCode, message, issues } = (0, errorPreprocessor_1.default)(err);
    res.status(statusCode).json({
        status: 'error',
        message,
        issues,
    });
});
app.use(noteFound_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
