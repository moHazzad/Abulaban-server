import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { brandService } from './brand.service';
import httpStatus from 'http-status';
import AppError from '../../Error/errors/AppError';
import { ZodError } from 'zod';

export type Language = 'en' | 'ar';

const createBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.body);
  //saving to db
//   const result = await brandService.createBrandService(req.body);

try {
    const result = await brandService.createBrandService(req.body);

    if (!result) {
      return next(new AppError(404, 'Brand not created'));
    }

    res.status(200).json({
      success: true,
      message: 'Brand is created successfully',
      data: result,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: validationErrors,
        });
      }
    next(error); // Pass the error to the global error handler
  }
});

const getBrands = async (req: Request, res: Response, next: NextFunction) => {
  let { lang } = req.query;

  // Set default language to 'ar' if not provided or invalid
  if (lang !== 'en' && lang !== 'ar') {
    lang = 'ar';
  }

  try {
    // Use the service to update the category
    const brands = await brandService.getBrandNames(lang as Language);

    // Send back a success response
    res.status(httpStatus.OK).json({
      message: 'brand successfully retrieve',
      data: brands,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Send back an error response
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
        next(error);
    }
  }
};

// single brand name
const getSingleBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  let { lang } = req.query;

  // Set default language to 'ar' if not provided or invalid
  if (lang !== 'en' && lang !== 'ar') {
    lang = 'ar';
  }

  try {
    const brand = await brandService.getBrandById(id, lang as Language);

    res.status(httpStatus.OK).json({
      message: 'Brand successfully retrieved',
      data: brand,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(error);
  }
};

export const BrandController = {
  createBrand,
  getBrands,
  getSingleBrand,
};
