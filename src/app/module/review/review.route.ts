import  express  from "express";
import isAdmin from "../../midleware/isAdmin";
import { USER_ROLE } from "../../conestants/user.contents";
import { validateRequest } from "../../midleware/validateRequest";
import ReviewValidationSchema from "./review.validation";
import { createReviewController } from "./review.controller";



const router = express.Router()


router.post('/create', isAdmin(USER_ROLE.user ), validateRequest(ReviewValidationSchema ), createReviewController.createReview)
router.get('/:roomId',   createReviewController.getSingleRoomReview)


export const RoomReviewRoute = router