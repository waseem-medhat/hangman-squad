import {Router} from "express"
import { createUser, deleteUser, getUser, listAllUsers, updateUser } from "../controllers/userController"

const router = Router()

router.post("/", createUser)
router.get("/", listAllUsers)
router.get("/:id", getUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router
