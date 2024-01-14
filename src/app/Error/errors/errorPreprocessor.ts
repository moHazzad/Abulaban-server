/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
// import { TErrorResponse } from '../../types/TErrorResponse'
// import handlerDuplicateError from './handleDuplicateError'
// import handleValidationError from './handlerValidationError'
// import handlerCastError from './handlerCastError'
// import handlerGenericError from './handlerGenericError'
// import GenericError from '../../classes/errorClasses/GenericError'
import { ZodError } from 'zod'
// import handlerZodError from './handleZodError'
// import { TErrorResponse } from '../interface/TErrorResposne'
// import handleCastError from './handleCastError'
import GenericError from '../classError/GenericError'
// import handleGenericError from './handleGenericError'
import handleValidationError from './handleValidationError'
import handleCastError from './handleCastError'
import handlerDuplicateError from './handlerDuplicateError'
import handleGenericError from './handleGenericError'
import { TErrorResponse } from '../ErrorInterface/TErrorResponse'
import handlerZodError from './handlerZodError'

const errorPreprocessor = (err: any): TErrorResponse => {
  if (err instanceof ZodError) {
    return handlerZodError(err)
  } else if (err instanceof mongoose.Error.ValidationError) {
    return handleValidationError(err)
  } else if (err.code && err.code === 11000) {
    return handlerDuplicateError(err)
  } else if (err instanceof mongoose.Error.CastError) {
    return handleCastError(err)
  } else if (err instanceof GenericError) {
    return handleGenericError(err)
  } else {
    return {
      statusCode: 500,
      status: 'error',
      message: 'Unknown Error',
      issues: [
        {
          path: '',
          message: err.message,
        },
      ],
    }
    // errorResponse = handlerGenericError(err)
  }
}

export default errorPreprocessor