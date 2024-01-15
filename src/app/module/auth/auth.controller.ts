import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { authUserService } from './auth.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';
// import AppError from "../../Error/errors/AppError";
// import bcrypt from 'bcrypt';
// import { UserModel } from "../user/user.model";

// import userValidationSchemaZod from "./user.validation";

const resister = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const user = req.body;

  //saving to db
  const result = await authUserService.register(user);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'user not created',
      data: res,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created Successful',
      data: result,
    });
  }
});

const login = catchAsync(async (req: Request, res: Response) => {
  // const { email, password } = req.body;
 
  const loginData = req.body;
  // console.log(loginData,'chek if it got ot not ');
  const result = await authUserService.login(loginData);

  // const { refreshToken, accessToken,  } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authUserService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  // const { email, password } = req.body;
  // console.log(req.user);
  const { ...passwordData } = req.body;

  const user = await authUserService.changePasswordService(
    req.user,
    passwordData,
  );
  

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'change successful',
    data: user,
  });
});


const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body.body;
  const user = await authUserService.forgetPasswordService(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'reset Link generated',
    data: user,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;

  const payload = req.body

  const result = await authUserService.resetPasswordService(payload, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successful!',
    data: result,
  });
});

export const authUserController = {
  resister,
  login,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword
};
