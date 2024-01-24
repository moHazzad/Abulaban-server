/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { LanguageKey, MaxGuestsType,  SortOrder, TRoom } from './room.interface';
import { RoomModel } from './room.model';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';
import { CategoryModel } from '../category/category.model';

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

const createRoomInDb = async (roomData: TRoom) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Check if the category exists
    const findCategory = await CategoryModel.findById(roomData.type);
    if (!findCategory) {
      throw new AppError(httpStatus.NOT_FOUND, 'Invalid category');
    }

    // Ensure that roomData contains multilingual fields
    // (You might want to add more validation based on your requirements)
    if (!roomData.title.en || !roomData.title.ar) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Both English and Arabic room titles are required',
      );
    }

    // Create the room
    const room = await RoomModel.create([roomData], { session });

    if (!room) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create room');
    }

    // Fetch the newly created room with populated type
    const populatedRoom = await RoomModel.findById(room[0]._id)
      .populate('type')
      .session(session);

    await session.commitTransaction();
    await session.endSession();

    return populatedRoom;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    // console.error('Error in createRoomInDb:', err);
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create room due to an unexpected error. Try again with valid room type.',
    );
  }
};

// const findAllRoomsFromDb = async () => {
//     try {
//         const rooms = await RoomModel.find().populate('type');
//         return rooms;
//     } catch (err) {
//         throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve rooms.');
//     }
// };

const findAllRoomsFromDb = async (language: LanguageKey) => {
  try {
    const rooms = await RoomModel.find().populate('type').lean();

    // Map over each room and construct a new object with the desired structure
    const localizedRooms = rooms.map((room) => ({
      id: room._id,
      title: room.title[language],
      description: room.description[language],
      maxGuests: room.maxGuests,
      roomQTY: room.roomQTY,
      size: room.size[language],
      features: room.features.map((feature) => feature[language]),
      images: room.images,
      priceOptions: room.priceOptions.map((priceOption) => ({
        price: priceOption.price,
        currency: priceOption.currency[language], // Localize the currency here
        taxesAndCharges: priceOption.taxesAndCharges,
        breakfast: priceOption.breakfast[language],
        cancellation: priceOption.cancellation[language],
        prepayment: priceOption.prepayment[language],
        refundable: priceOption.refundable,
      })),
      type: room.type, // Assuming this is already in the desired format
    }));

    return localizedRooms;
  } catch (err) {
    // console.error('Error in findAllRoomsFromDb:', err);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve rooms.',
    );
  }
};

const findSingleRoomFromDb = async (roomId: string, language: LanguageKey) => {
  try {
    const room = await RoomModel.findById(roomId).populate('type').lean();
    if (!room) {
      throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
    }

    const localizedRooms = {
      id: room._id,
      title: room.title[language],
      description: room.description[language],
      maxGuests: room.maxGuests,
      roomQTY: room.roomQTY,
      size: room.size[language],
      features: room.features.map((feature) => feature[language]),
      services: room.services.map((service) => service[language]),
      images: room.images,
      priceOptions: room.priceOptions.map((priceOption) => ({
        price: priceOption.price,
        currency: priceOption.currency[language], // Localize the currency here
        taxesAndCharges: priceOption.taxesAndCharges,
        breakfast: priceOption.breakfast[language],
        cancellation: priceOption.cancellation[language],
        prepayment: priceOption.prepayment[language],
        refundable: priceOption.refundable,
      })),
      type: room.type, // Assuming this is already in the desired format
    };

    return localizedRooms;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve the room.',
    );
  }
};

const updateRoomById = async (roomId: string, updateData: Partial<TRoom>) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Check if the room exists
    const existingRoom = await RoomModel.findById(roomId).session(session);
    if (!existingRoom) {
      throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
    }

    // Update the room
    const updatedRoom = await RoomModel.findByIdAndUpdate(
      roomId,
      { $set: updateData },
      { new: true, session: session }, // 'new: true' returns the updated document
    );

    await session.commitTransaction();
    await session.endSession();

    return updatedRoom;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update the room.',
    );
  }
};

const deleteRoomById = async (roomId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Check if the room exists
    const existingRoom = await RoomModel.findById(roomId).session(session);
    if (!existingRoom) {
      throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
    }

    // Soft delete the room by updating isDeleted and isActive
    const updatedRoom = await RoomModel.findByIdAndUpdate(
      roomId,
      { isDeleted: true, isActive: false },
      { new: true, session: session },
    );

    await session.commitTransaction();
    await session.endSession();

    return updatedRoom; // Return the updated room for confirmation
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();

    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete the room.',
    );
  }
};

const searchService = async (
  categoryId: string,
  maxGuests: MaxGuestsType,
  sortOrder: SortOrder = 'asc',
  language: LanguageKey
//   checkInDate: Date,
//   checkOutDate: Date,
) => {
  const queryConditions = [];

  if (categoryId) {
    queryConditions.push({ type: new mongoose.Types.ObjectId(categoryId) });
  }

  if (maxGuests) {
    queryConditions.push({ maxGuests: { $gte: maxGuests } });
  }

  const query = queryConditions.length > 0 ? { $or: queryConditions } : {}
  


    const rooms = await RoomModel.find(query).sort({ 'priceOptions.price': sortOrder === 'asc' ? 1 : -1 }).lean().exec() ;
    const localizedRooms = rooms.map((room) => ({
        id: room._id,
        title: room.title[language],
        description: room.description[language],
        maxGuests: room.maxGuests,
        roomQTY: room.roomQTY,
        size: room.size[language],
        features: room.features.map((feature) => feature[language]),
        images: room.images,
        priceOptions: room.priceOptions.map((priceOption) => ({
          price: priceOption.price,
          currency: priceOption.currency[language], // Localize the currency here
          taxesAndCharges: priceOption.taxesAndCharges,
          breakfast: priceOption.breakfast[language],
          cancellation: priceOption.cancellation[language],
          prepayment: priceOption.prepayment[language],
          refundable: priceOption.refundable,
        })),
        type: room.type, // Assuming this is already in the desired format
      }));
  
      return localizedRooms;
    // return rooms;
  
};

const checkAllRoomAvailability = async (checkInDateStr : string, checkOutDateStr: string ) => {
  console.log(checkInDateStr,checkOutDateStr,'service ' );

  // const availableRooms = await RoomModel.aggregate([
  //     {
  //         $lookup: {
  //             from: "bookings",
  //             let: { roomId: "$_id" },
  //             pipeline: [
  //                 {
  //                     // $match: {
  //                     //     $expr: {
  //                     //         $and: [
  //                     //             { $eq: ["$room", "$$roomId"] },
  //                     //             { $or: [
  //                     //                 { $and: [{ $gte: ["$checkInDate", new Date(checkInDate)], $lt: ["$checkInDate", new Date(checkOutDate)] }] },
  //                     //                 { $and: [{ $gt: ["$checkOutDate", new Date(checkInDate)], $lte: ["$checkOutDate", new Date(checkOutDate)] }] }
  //                     //             ]}
  //                     //         ]
  //                     //     }
  //                     // }
  //                   //   $match: {
  //                   //     $expr: {
  //                   //         $and: [
  //                   //             { $eq: ["$room", "$$roomId"] },
  //                   //             { $or: [
  //                   //                 { $and: [{ $gte: ["$checkInDate", checkInDateStr], $lt: ["$checkInDate", checkOutDateStr] }] },
  //                   //                 { $and: [{ $gt: ["$checkOutDate", checkInDateStr], $lte: ["$checkOutDate", checkOutDateStr] }] }
  //                   //             ]}
  //                   //         ]
  //                   //     }
  //                   // }
  //                   $match: {
  //                     $expr: {
  //                         $and: [
  //                             { $eq: ["$room", "$$roomId"] },
  //                             { $or: [
  //                                 { 
  //                                     $and: [
  //                                         { $gte: ["$checkIn", { $dateFromString: { dateString: checkInDateStr, format: "%Y/%m/%d" } }] },
  //                                         { $lt: ["$checkIn", { $dateFromString: { dateString: checkOutDateStr, format: "%Y/%m/%d" } }] }
  //                                     ]
  //                                 },
  //                                 { 
  //                                     $and: [
  //                                         { $gt: ["$checkOut", { $dateFromString: { dateString: checkInDateStr, format: "%Y/%m/%d" } }] },
  //                                         { $lte: ["$checkOut", { $dateFromString: { dateString: checkOutDateStr, format: "%Y/%m/%d" } }] }
  //                                     ]
  //                                 }
  //                             ]}
  //                         ]
  //                     }
  //                 }
  //                 },
  //                 { $group: { _id: "$room", bookingCount: { $sum: 1 } } }
  //             ],
  //             as: "bookings"
  //         }
  //     },
  //     {
  //         $project: {
  //             title: 1,
  //             roomQTY: 1,
  //             bookings: 1,
  //             availableQty: {
  //                 $subtract: ["$roomQTY", { $ifNull: [{ $arrayElemAt: ["$bookings.bookingCount", 0] }, 0] }]
  //             }
  //             // ... include other fields you need
  //         }
  //     },
  //     { $match: { availableQty: { $gt: 0 } } }
  // ]);
  const availableRooms = await RoomModel.aggregate([
    {
      $lookup: {
          from: "bookings",
          let: { roomId: "$_id" },
          pipeline: [
              {
                  $match: {
                      $expr: {
                          $and: [
                              { $eq: ["$roomId", "$$roomId"] },
                              {
                                  $or: [
                                      { $and: [{ $lte: ["$checkIn", checkInDateStr] }, { $gt: ["$checkOut", checkInDateStr] }] },
                                      { $and: [{ $lt: ["$checkIn", checkOutDateStr] }, { $gte: ["$checkOut", checkInDateStr] }] }
                                  ]
                              }
                          ]
                      }
                  }
              },
              { $group: { _id: "$roomId", bookingCount: { $sum: 1 } } }
          ],
          as: "bookings"
      }
  },
  {
      $project: {
          title: 1,
          roomQTY: 1,
          bookings: 1,
          availableQty: {
              $subtract: ["$roomQTY", { $ifNull: [{ $arrayElemAt: ["$bookings.bookingCount", 0] }, 0] }]
          }
      }
  },
  { $match: { availableQty: { $gt: 0 } } }
  ])

  return availableRooms;
};

// const checkAllRoomAvailability = async (checkInDate:string , checkOutDate:string) => {
//   const availableRooms = await RoomModel.aggregate([
//       {
//           $lookup: {
//               from: "bookings",
//               let: { roomId: "$_id" },
//               pipeline: [
//                   {
//                       $match: {
//                           $expr: {
//                               $and: [
//                                   { $eq: ["$room", "$$roomId"] },
//                                   { $lt: ["$checkInDate", checkOutDate] },
//                                   { $gt: ["$checkOutDate", checkInDate] }
//                               ]
//                           }
//                       }
//                   },
//                   { $group: { _id: "$room", bookingCount: { $sum: 1 } } }
//               ],
//               as: "bookings"
//           }
//       },
//       {
//           $project: {
//               title: 1,
//               roomQTY: 1,
//               availableQty: {
//                   $subtract: ["$roomQTY", { $ifNull: [{ $arrayElemAt: ["$bookings.bookingCount", 0] }, 0] }]
//               }
//               // ... include other fields you need
//           }
//       },
//       { $match: { availableQty: { $gt: 0 } } } // Filter out rooms with no available quantity
//   ]);

//   return availableRooms;
// };

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

export const roomService = {
  createRoomInDb,
  findAllRoomsFromDb,
  findSingleRoomFromDb,
  updateRoomById,
  deleteRoomById,
  searchService,
  checkAllRoomAvailability
};
