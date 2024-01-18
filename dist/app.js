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
const app = (0, express_1.default)();
// parser
app.use((0, cors_1.default)({
    origin: ['https://mutlilangualawalive.vercel.app', 'http://127.0.0.1:5173'], // Update this to your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api', Routers_1.default);
app.get('/', (req, res) => {
    res.send('Hotel Awalive is running');
});
app.use(noteFound_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
