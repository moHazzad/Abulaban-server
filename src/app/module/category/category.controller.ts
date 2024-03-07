import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import AppError from "../../Error/errors/AppError";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";



const createCategory = catchAsync(async(req: Request, res: Response) =>{
    // console.log(req.body);
    //saving to db
    const result = await categoryService.createCategoryDb(req.body)

    if (!result) {
        return res
        .status(404)
        .json({
            success: false,
            message: 'category not created',
            data: res
        })
    } else {
        res.status(200).json({
            success: true,
            message: 'category is created successfully',
            data: result,
          });
    }    

})

const getCategoryController = catchAsync(async(req: Request, res: Response) =>{
    
    const languageParam = req.query.lang;
    const language = (typeof languageParam === 'string' && (languageParam === 'en' || languageParam === 'ar')) 
                     ? languageParam 
                     : 'en';
    const result = await categoryService.getCategoryFromDb(language)

    if (!result) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'No category found.'
        )
          
      } else {
          sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message:" Successful",
            data: result
          }
          )
      }  

})



export const createCategoryController = {
    createCategory,
    getCategoryController
}