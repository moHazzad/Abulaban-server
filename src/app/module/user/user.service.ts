/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import AppError from '../../Error/errors/AppError';
// import AppError from "../../Error/errors/appError";

const createUserInDb = async (userData: TUser) => {
  console.log(userData);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // const user = new UserModel(userData)
    // const result = await user.save()
    const user = await UserModel.create([userData], { session });

    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    await session.commitTransaction();
    await session.endSession();
    // Convert the Mongoose document to a plain JavaScript object
    // const userObject = user;

    // Remove the password field from the response
    // delete userObject.password;

    return user;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// //  retrieve all user with specific field
const getAllUserUserFromDb = async () => {
  const result = await UserModel.aggregate([
    {
      $addFields: {
        fullName: { $concat: ['$firstName', ' ', '$lastName'] },
      },
    },
    {
      $project: {
        username: 1,
        fullName: 1,
        email: 1,
      },
    },
  ]);
  return result;
};

const getSingleUserById = async (userId: string) => {
  const result = await UserModel.findById(userId); //finding by _id
  return result;
};

const updateUserInformation = async (
  userId: string,
  updateInfo: Partial<TUser>,
) => {
  const { ...updateUserInfoPayload } = updateInfo;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...updateUserInfoPayload,
  };

  if (updateUserInformation && Object.keys(updateUserInformation).length) {
    for (const [key, value] of Object.entries(updateUserInformation)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await UserModel.findOneAndUpdate(
    { _id: userId },
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );
  return result;
};

const deleteUser = async (userId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true, isActive: false },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedUser;

  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};

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

export const userService = {
  createUserInDb,
  getAllUserUserFromDb,
  getSingleUserById,
  updateUserInformation,
  deleteUser,
  // addOrderToUser,
  // getSingleUserOrderFromDb,
  // getSingleUserTotalPriceFromDb
};
