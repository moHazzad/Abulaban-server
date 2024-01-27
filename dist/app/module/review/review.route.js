"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomReviewRoute = void 0;
const express_1 = __importDefault(require("express"));
const isAdmin_1 = __importDefault(require("../../midleware/isAdmin"));
const user_contents_1 = require("../../conestants/user.contents");
const validateRequest_1 = require("../../midleware/validateRequest");
const review_validation_1 = __importDefault(require("./review.validation"));
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.post('/create', (0, isAdmin_1.default)(user_contents_1.USER_ROLE.user), (0, validateRequest_1.validateRequest)(review_validation_1.default), review_controller_1.createReviewController.createReview);
router.get('/:roomId', review_controller_1.createReviewController.getSingleRoomReview);
exports.RoomReviewRoute = router;
