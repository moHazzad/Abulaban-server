// import GenericError from '../../classes/errorClasses/GenericError'
import { TErrorIssue, TErrorResponse } from '../ErrorInterface/TErrorResponse'
import GenericError from '../classError/GenericError'


const handleGenericError = (err: GenericError): TErrorResponse => {
  const issues: TErrorIssue[] = [
    {
      path: '',
      message: err.message,
    },
  ]

  return {
    statusCode: err.statusCode,
    status: 'error',
    message: 'Generic Error',
    issues,
  }
}

export default handleGenericError