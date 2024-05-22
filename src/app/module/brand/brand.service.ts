import mongoose from 'mongoose';
import { TBrand } from './brand.interface';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';
import { BrandModel } from './brand.model';
import { Language } from './brand.controller';

const createBrandService = async (brandData: TBrand) => { 
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await BrandModel.create([brandData], {
      session,
    });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Brand');
    }

    await session.commitTransaction();

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();

    let errorMessage = 'Failed to create Brand due to an unexpected error.';
    if (err instanceof mongoose.Error.ValidationError) {
      errorMessage = `Validation error: ${err.message}`;
    } else if (err instanceof mongoose.Error) {
      errorMessage = `Database error: ${err.message}`;
    } else if (err.code && err.code === 11000) {
      errorMessage =
        'Database error: Duplicate key error, such an brand already exists.';
    }

    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(httpStatus.BAD_REQUEST, errorMessage);
  } finally {
    await session.endSession();
  }
};

//   get all brans
const getBrandNames = async (lang: Language) => {
  const brands = await BrandModel.find().lean();

  if (!brands.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No brands found');
  }

  // Extract the names in the specified language
  // Extract the _id and names in the specified language
  const brandNames = brands.map((brand) => ({
    _id: brand._id,
    name: brand.Name[lang],
  }));

  return brandNames;
};

// single brand get 
const getBrandById = async (id: string, lang: Language) => {
    const brand = await BrandModel.findById(id).lean();
    
    if (!brand) {
      throw new AppError(httpStatus.NOT_FOUND, 'Brand not found');
    }
  
    return {
      _id: brand._id,
      name: brand.Name[lang]
    };
  };


export const brandService = {
  createBrandService,
  getBrandNames,
  getBrandById
};
