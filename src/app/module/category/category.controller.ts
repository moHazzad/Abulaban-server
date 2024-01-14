import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { categoryService } from "./category.service";



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

export const createCategoryController = {
    createCategory
}