/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { User, UserRole } from './user.interface';
import bcrypt from 'bcrypt';
import { UserModel } from './user.model';
import AppError from '../../Error/errors/AppError';
// import AppError from "../../Error/errors/appError";


const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const createUser = async (userData: User, creatorRole: UserRole) => {
  // Hash password
  const hashedPassword = await hashPassword(userData.passwordHash);

  // Check role validity
  if (userData.role !== UserRole.User && creatorRole !== UserRole.Admin) {
    throw new AppError(httpStatus.FORBIDDEN, "Only admins can assign elevated roles.");
  }

  const newUser = new UserModel({
    ...userData,
    passwordHash: hashedPassword
  });

  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error: any) {
    throw new AppError( httpStatus.BAD_REQUEST,`user is not create ${error.message}`)
  }
};
// const createUser  = async (userData: User) => {
  
//   const session = await mongoose.startSession();
//   session.startTransaction();

// // Hash password
//     const hashedPassword = await bcrypt.hash(userData.passwordHash, 10);

//     // Prepare new user document
//     const userDocument = new UserModel({
//       ...userData,
//       passwordHash: hashedPassword
//     });


//     try {
      
//       const savedUser = await userDocument.save();
      
//     await session.commitTransaction();
//     await session.endSession();
//     return savedUser;
       
//   } catch (err: any) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError( httpStatus.BAD_REQUEST,`user is not create ${err.message}`)
    
//   }finally {
//     session.endSession();
//   }

// };

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
        role: 1,
        isActive: 1,
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
    throw new Error('Failed to delete user');
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
  // createUserInDb,
  createUser,
  getAllUserUserFromDb,
  getSingleUserById,
  updateUserInformation,
  deleteUser,
  // addOrderToUser,
  // getSingleUserOrderFromDb,
  // getSingleUserTotalPriceFromDb
};
