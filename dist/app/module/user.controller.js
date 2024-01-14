"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = void 0;
const user_service_1 = require("./user.service");
const user_validation_1 = __importDefault(require("./user.validation"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        // parsing user data into zod 
        const zodParsedData = user_validation_1.default.parse(user);
        //saving to db
        const result = yield user_service_1.userService.createUserInDb(zodParsedData);
        if (!result) {
            return res
                .status(404)
                .json({
                success: false,
                message: 'user not created'
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: 'user is created successfully',
                data: result,
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'user went wrong',
            data: err,
        });
    }
});
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_service_1.userService.getAllUserUserFromDb();
        if (!users) {
            return res
                .status(404)
                .json({ success: false, message: 'No users found' });
        }
        else {
            res.status(200).json({
                success: true,
                message: 'users data are retrieved',
                data: users,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Error in retrieving user',
            error: err
        });
    }
});
const singleUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const user = yield user_service_1.userService.getSingleUserById(userId);
        if (!user) {
            return res
                .status(404)
                .json({
                success: false,
                message: 'No user found',
                error: {
                    code: 404,
                    details: "The user with the given ID was not found."
                }
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: 'single user data retrieved',
                data: user,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Error retrieved  user',
            error: err
        });
    }
});
// update user info 
const updateSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // getting user id to find the exect user and the body of update info 
    const userId = parseInt(req.params.userId);
    const updateInfo = req.body;
    try {
        const updateUser = yield user_service_1.userService.updateUserInformation(userId, updateInfo);
        if (!updateUser) {
            return res
                .status(404)
                .json({
                success: false,
                message: 'No user found',
                error: {
                    code: 404,
                    details: "The user with the given id was not found."
                }
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: 'user update successfully',
                data: updateUser,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Error update user',
            error: err
        });
    }
});
const deleteSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    const result = yield user_service_1.userService.deleteUser(userId);
    try {
        if (!result) {
            return res
                .status(404)
                .json({
                success: false,
                message: "User Not Found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: `Delete User Successfully`,
                data: null
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error
        });
    }
});
const addOrderToUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    const order = req.body;
    //console.log('order',order)
    try {
        const result = yield user_service_1.userService.addOrderToUser(userId, order);
        if (!result) {
            return res
                .status(404)
                .json({
                success: false,
                message: 'No user found',
                error: {
                    code: 404,
                    details: "The user with the given id was not found."
                }
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: 'Order placed successfully',
                data: null,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Error in user or some other',
            error: err
        });
    }
});
const getSingleUserOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const users = yield user_service_1.userService.getSingleUserOrderFromDb(userId);
        if (!users) {
            return res
                .status(404)
                .json({ success: false, message: 'No users found' });
        }
        else {
            res.status(200).json({
                success: true,
                message: 'users order data are retrieved',
                data: users,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Error in retrieving user order',
            error: err
        });
    }
});
const getOrderTotalPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const users = yield user_service_1.userService.getSingleUserTotalPriceFromDb(userId);
        if (!users) {
            return res
                .status(404)
                .json({ success: false, message: 'No users found' });
        }
        else {
            res.status(200).json({
                success: true,
                message: 'users order data are retrieved',
                data: users,
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Error in retrieving user order',
            error: err
        });
    }
});
exports.createUserController = {
    createUser,
    allUsers,
    singleUserById,
    updateSingleUser,
    deleteSingleUser,
    addOrderToUserController,
    getSingleUserOrder,
    getOrderTotalPrice
};
