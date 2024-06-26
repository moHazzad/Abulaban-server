/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
// import { UserModel } from './user.model';
import AppError from '../../Error/errors/AppError';
import { ILogin, User } from './user.interface';
import UserModel from './user.model';
// import { LoginInput } from './user.validation';
import { jwtHelpers } from '../../helper/jwtHelper';
import config from '../../config';
// import AppError from "../../Error/errors/appError";

// const hashPassword = async (password: string) => {
//   return await bcrypt.hash(password, 10);
// };

const register = async (userData: User) => {
  const existingUser = await UserModel.findOne({
    'profile.email': userData.profile.email,
  });

  if (existingUser) {
    throw new AppError(httpStatus.FORBIDDEN, 'Email already in use');
  }

  const user = new UserModel({
    ...userData,
    password: userData.password,
    profile: userData.profile,
    // password: userData.password,
    // profile: {
    //   firstName: userData.profile.firstName,
    //   lastName: userData.profile.lastName,
    //   phone: userData.profile.phone,
    //   email: userData.profile.email,
    // },
  });

  try {
    const savedUser = await user.save();
    return savedUser;
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User not created: ${error.message}`,
    );
  }
};

const login = async (loginData: ILogin) => {
  const user = await UserModel.findOne({ 'profile.email': loginData.email });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  if (user.isDelete === true) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This user account has been deleted',
    );
  }

  const isPasswordMatch = await bcrypt.compare(
    loginData.password,
    user.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  const token = jwtHelpers.createToken(
    {
      id: user._id,
      name: user.profile.firstName,
      phone: user.profile.phone,
      email: user.profile.email,
      role: user.role,
    },
    config.jwt_access_token, // Use the imported configuration value
    { expiresIn: config.jwt_access_expires_in }, // Use the imported configuration value
  );

  return { token };
};

const singleUser = async (userId: string) => {
  try {
    const result = await UserModel.findOne({ _id: userId, isDelete: false });
    return result;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }
};

// const updateSingleUser = async (userId: string, updateData: Partial<User>) => {
//   try {
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//    // Update only the fields provided in the updateData
//    Object.keys(updateData).forEach((key) => {
//      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//      // @ts-ignore
//     if (updateData[key] !== undefined) {
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       user[key] = updateData[key];
//     }
//   });

//     await user.save();
//     return user;
//   } catch (error:any) {
//     throw new AppError(httpStatus.BAD_REQUEST, `Unable to update user ${error.message}`);
//   }
// };

const updateSingleUser = async (userId: string, updateData: Partial<any>) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Update only the fields provided in the updateData
    for (const key of Object.keys(updateData)) {
      // Check if the updateData key is an object (like profile or shippingAddress)
      if (typeof updateData[key] === 'object' && !Array.isArray(updateData[key]) && updateData[key] !== null) {
        // Update nested fields
        for (const nestedKey of Object.keys(updateData[key])) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          user[key][nestedKey] = updateData[key][nestedKey];
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user[key] = updateData[key];
      }
    }

    await user.save();
    return user;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `Unable to update user ${error.message}`);
  }
};


// const createUser = async (userData: User, creatorRole: UserRole) => {
//   // Hash password
//   const hashedPassword = await hashPassword(userData.passwordHash);

//   // Check role validity
//   if (userData.role !== UserRole.User && creatorRole !== UserRole.Admin) {
//     throw new AppError(httpStatus.FORBIDDEN, "Only admins can assign elevated roles.");
//   }

//   const newUser = new UserModel({
//     ...userData,
//     passwordHash: hashedPassword
//   });

//   try {
//     const savedUser = await newUser.save();
//     return savedUser;
//   } catch (error: any) {
//     throw new AppError( httpStatus.BAD_REQUEST,`user is not create ${error.message}`)
//   }
// };
// <-------- end------>

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

// const getSingleUserById = async (userId: string) => {
//   const result = await UserModel.findById(userId); //finding by _id
//   return result;
// };

// const updateUserInformation = async (
//   userId: string,
//   updateInfo: Partial<User>,
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
  register,
  login,
  getAllUserUserFromDb,
  singleUser,
  updateSingleUser,
  deleteUser,
  // addOrderToUser,
  // getSingleUserOrderFromDb,
  // getSingleUserTotalPriceFromDb
};
