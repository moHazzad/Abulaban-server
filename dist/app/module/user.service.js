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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_model_1 = require("./user.model");
const createUserInDb = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userData.orders) {
        userData.orders = [];
    }
    const user = new user_model_1.userModel(userData);
    const result = yield user.save();
    return result;
});
//  retrieve all user with specific field 
const getAllUserUserFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.aggregate([
        {
            $project: {
                username: 1,
                fullName: 1,
                age: 1,
                email: 1,
                address: 1
            }
        }
    ]);
    return result;
});
const getSingleUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.findOne({ userId });
    return result;
});
const updateUserInformation = (userId, updateInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.findOneAndUpdate({ userId }, updateInfo, { new: true });
    return result;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.findOneAndDelete({ userId });
    return result;
});
// order 
// add order to the user 
const addOrderToUser = (userId, orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getSingleUserById(userId);
    // Check if user is not null
    if (!user) {
        throw new Error('User not found');
    }
    if (!user.orders) {
        user.orders = [];
    }
    user.orders.push(orderData);
    // Save the updated user
    yield user.save();
    return user;
});
const getSingleUserOrderFromDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield getSingleUserById(userId);
    if (!user) {
        return user;
    }
    else {
        if (!(user === null || user === void 0 ? void 0 : user.orders) || ((_a = user === null || user === void 0 ? void 0 : user.orders) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            // if the orders array is empty 
            return;
        }
        return user.orders;
    }
});
const getSingleUserTotalPriceFromDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userOrders = yield getSingleUserOrderFromDb(userId);
    // Check if userOrders is an array (which means there are orders) or an object with a 'message' key (no orders or user not found)
    if (Array.isArray(userOrders)) {
        const totalPrice = userOrders.reduce((sum, order) => sum + (order.price || 0), 0);
        return { totalPrice };
    }
    else {
        // Return the message from getSingleUserOrderFromDb (no orders or user not found)
        return userOrders;
    }
});
exports.userService = {
    createUserInDb,
    getAllUserUserFromDb,
    getSingleUserById,
    updateUserInformation,
    deleteUser,
    addOrderToUser,
    getSingleUserOrderFromDb,
    getSingleUserTotalPriceFromDb
};
