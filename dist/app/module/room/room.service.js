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
exports.roomService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const room_model_1 = require("./room.model");
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const category_model_1 = require("../category/category.model");
// const createRoomInDb = async (roomData: TRoom) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         // Check if the category exists
//         const findCategory = await CategoryModel.findById(roomData.type);
//         if (!findCategory) {
//             throw new AppError(httpStatus.NOT_FOUND, "Invalid category");
//         }
//         // Create the room
//         const room = await RoomModel.create([roomData], { session });
//         if (!room) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create room');
//         }
//         // Fetch the newly created room with populated type
//         const populatedRoom = await RoomModel.findById(room[0]._id)
//                                       .populate('type')
//                                       .session(session);
//         await session.commitTransaction();
//         await session.endSession();
//         return populatedRoom;
//     } catch (err: any) {
//         await session.abortTransaction();
//         await session.endSession();
//         if (err instanceof AppError) {
//             throw err;
//         }
//         throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create room due to an unexpected error. Try again with valid room type.');
//     }
// };
const createRoomInDb = (roomData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if the category exists
        const findCategory = yield category_model_1.CategoryModel.findById(roomData.type);
        if (!findCategory) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Invalid category");
        }
        // Ensure that roomData contains multilingual fields
        // (You might want to add more validation based on your requirements)
        if (!roomData.title.en || !roomData.title.ar) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Both English and Arabic room titles are required');
        }
        // Create the room
        const room = yield room_model_1.RoomModel.create([roomData], { session });
        if (!room) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create room');
        }
        // Fetch the newly created room with populated type
        const populatedRoom = yield room_model_1.RoomModel.findById(room[0]._id)
            .populate('type')
            .session(session);
        yield session.commitTransaction();
        yield session.endSession();
        return populatedRoom;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        console.error('Error in createRoomInDb:', err);
        if (err instanceof AppError_1.default) {
            throw err;
        }
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create room due to an unexpected error. Try again with valid room type.');
    }
});
// const findAllRoomsFromDb = async () => {
//     try {
//         const rooms = await RoomModel.find().populate('type');
//         return rooms;
//     } catch (err) {  
//         throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve rooms.');
//     }
// };
const findAllRoomsFromDb = (language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield room_model_1.RoomModel.find().populate('type').lean();
        // Map over each room and construct a new object with the desired structure
        const localizedRooms = rooms.map(room => ({
            id: room._id,
            title: room.title[language],
            description: room.description[language],
            maxGuests: room.maxGuests,
            roomQTY: room.roomQTY,
            size: room.size[language],
            features: room.features.map(feature => feature[language]),
            images: room.images,
            priceOptions: room.priceOptions.map(priceOption => (Object.assign(Object.assign({}, priceOption), { breakfast: priceOption.breakfast[language], cancellation: priceOption.cancellation[language], prepayment: priceOption.prepayment[language] }))),
            type: room.type, // Assuming this is already in the desired format
        }));
        return localizedRooms;
    }
    catch (err) {
        console.error('Error in findAllRoomsFromDb:', err);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to retrieve rooms.');
    }
});
const findSingleRoomFromDb = (roomId, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield room_model_1.RoomModel.findById(roomId).populate('type').lean();
        if (!room) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room not found');
        }
        const localizedRooms = {
            id: room._id,
            title: room.title[language],
            description: room.description[language],
            maxGuests: room.maxGuests,
            roomQTY: room.roomQTY,
            size: room.size[language],
            features: room.features.map(feature => feature[language]),
            services: room.services.map(service => service[language]),
            images: room.images,
            priceOptions: room.priceOptions.map(priceOption => (Object.assign(Object.assign({}, priceOption), { breakfast: priceOption.breakfast[language], cancellation: priceOption.cancellation[language], prepayment: priceOption.prepayment[language] }))),
            type: room.type, // Assuming this is already in the desired format
        };
        return localizedRooms;
    }
    catch (err) {
        if (err instanceof AppError_1.default) {
            throw err;
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to retrieve the room.');
    }
});
const updateRoomById = (roomId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if the room exists
        const existingRoom = yield room_model_1.RoomModel.findById(roomId).session(session);
        if (!existingRoom) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room not found');
        }
        // Update the room
        const updatedRoom = yield room_model_1.RoomModel.findByIdAndUpdate(roomId, { $set: updateData }, { new: true, session: session } // 'new: true' returns the updated document
        );
        yield session.commitTransaction();
        yield session.endSession();
        return updatedRoom;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        if (err instanceof AppError_1.default) {
            throw err;
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update the room.');
    }
});
const deleteRoomById = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if the room exists
        const existingRoom = yield room_model_1.RoomModel.findById(roomId).session(session);
        if (!existingRoom) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room not found');
        }
        // Soft delete the room by updating isDeleted and isActive
        const updatedRoom = yield room_model_1.RoomModel.findByIdAndUpdate(roomId, { isDeleted: true, isActive: false }, { new: true, session: session });
        yield session.commitTransaction();
        yield session.endSession();
        return updatedRoom; // Return the updated room for confirmation
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        if (err instanceof AppError_1.default) {
            throw err;
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to delete the room.');
    }
});
// //  retrieve all user with specific field
// const getAllUserUserFromDb = async () => {
//   const result = await UserModel.aggregate([
//     {
//       $addFields: {
//         fullName: { $concat: ['$firstName', ' ', '$lastName'] },
//       },
//     },
//     {
//       $project: {
//         username: 1,
//         fullName: 1,
//         email: 1,
//       },
//     },
//   ]);
//   return result;
// };
// const getSingleUserById = async (userId: string) => {
//   const result = await UserModel.findById(userId); //finding by _id
//   return result;
// };
// const updateUserInformation = async (
//   userId: string,
//   updateInfo: Partial<TUser>,
// ) => {
//   const { ...updateUserInfoPayload } = updateInfo;
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...updateUserInfoPayload,
//   };
//   if (updateUserInformation && Object.keys(updateUserInformation).length) {
//     for (const [key, value] of Object.entries(updateUserInformation)) {
//       modifiedUpdatedData[`name.${key}`] = value;
//     }
//   }
//   const result = await UserModel.findOneAndUpdate(
//     { _id: userId },
//     modifiedUpdatedData,
//     { new: true, runValidators: true },
//   );
//   return result;
// };
// const deleteUser = async (userId: string) => {
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const deletedUser = await UserModel.findByIdAndUpdate(
//       userId,
//       { isDeleted: true, isActive: false },
//       { new: true, session },
//     );
//     if (!deletedUser) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
//     }
//     await session.commitTransaction();
//     await session.endSession();
//     return deletedUser;
//   } catch (err) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new Error('Failed to delete student');
//   }
// };
// // order
// // add order to the user
// const addOrderToUser = async (userId:number,orderData:object  )=>{
//     const user = await getSingleUserById(userId);
//     // Check if user is not null
//     if (!user) {
//         throw new Error('User not found');
//     }
//     if (!user.orders) {
//         user.orders = [];
//     }
//     user.orders.push(orderData);
//     // Save the updated user
//     await user.save();
//     return user;
// }
// const getSingleUserOrderFromDb =async (userId: number) => {
//     const user = await getSingleUserById(userId);
//     if (!user) {
//         return user
//     } else{
//         if (!user?.orders || user?.orders?.length === 0) {
//         // if the orders array is empty
//         return;
//     }
//     return user.orders;
//     }
// }
// const getSingleUserTotalPriceFromDb = async(userId:number)=>{
//     const userOrders = await getSingleUserOrderFromDb(userId);
//     // Check if userOrders is an array (which means there are orders) or an object with a 'message' key (no orders or user not found)
//     if (Array.isArray(userOrders)) {
//         const totalPrice = userOrders.reduce((sum, order) => sum + (order.price || 0), 0);
//         return { totalPrice };
//     } else {
//         // Return the message from getSingleUserOrderFromDb (no orders or user not found)
//         return userOrders;
//     }
// }
exports.roomService = {
    createRoomInDb,
    findAllRoomsFromDb,
    findSingleRoomFromDb,
    updateRoomById,
    deleteRoomById
};
