import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const createToken = (
  jwtPayload: JwtPayload,
  secret: string,
  options: SignOptions
) => {
  return jwt.sign(jwtPayload, secret, options);
};

const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};


// import jwt, { JwtPayload } from 'jsonwebtoken'

// const createToken = (
//   jwtPayload: JwtPayload,
//   secret: string,
//   options: {
//     expiresIn: string
//   },
// ) => {
//   return jwt.sign(jwtPayload, secret, options)
// }

// const verifyToken = (token: string, secret: string) => {
//   return jwt.verify(token, secret)
// }

// export const jwtHelpers = {
//   createToken,
//   verifyToken,
// }