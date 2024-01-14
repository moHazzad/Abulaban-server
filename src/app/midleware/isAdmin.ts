import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, } from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config';
import AppError from '../Error/errors/AppError';
import catchAsync from '../utils/catchAsync';
import { TUserRole } from '../module/user/user.interface';


const isAdmin = (...requiredRoles: TUserRole[] ) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
        token,
        config.jwt_access_token as string,
      ) as JwtPayload;

      const { role } = decoded;

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized  hi!',
        );
      }
    req.user = decoded as JwtPayload

    next();
  });
};

export default isAdmin;