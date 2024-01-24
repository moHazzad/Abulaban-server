import  express  from "express";
import { createRoomController } from "./room.conroller";
import { validateRequest } from "../../midleware/validateRequest";
import RoomValidationSchema from "./room.validation";
import isAdmin from "../../midleware/isAdmin";
import { USER_ROLE } from "../../conestants/user.contents";


const router = express.Router()

router.get('/available',  createRoomController.availableRoomController)
router.get('/search',  createRoomController.searchRoomController)
router.post('/create', isAdmin(USER_ROLE.admin), validateRequest(RoomValidationSchema), createRoomController.createRoom )
router.get('/',  createRoomController.findAllRooms )
router.get('/:id',  createRoomController.singleRoomById )
router.put('/:id', isAdmin(USER_ROLE.admin), createRoomController.updateSingleRoom)
router.delete('/:id', isAdmin(USER_ROLE.admin), createRoomController.deleteSingleRoom)


export const RoomRoute = router