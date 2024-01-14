import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    const result = await schema.safeParseAsync({
      body:req.body,
      cookies: req.cookies,
  })
    if (!result.success) {
      next(result.error)
    } else {
      // req.body = result.data
      req.body = result.data.body;
      req.cookies = result.data.cookies;
      
      next()
    }
  }
}