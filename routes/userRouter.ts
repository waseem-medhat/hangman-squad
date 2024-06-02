import { Router } from "express"
import { createUser, deleteUser, getUser, listAllUsers, loginUser, updateUser } from "../controllers/userController"
import { requireLogin } from "../middleware/authMiddleware"

const router = Router()

router
    .route("/")
    .post(createUser)
    .get(listAllUsers)

router.post("/login", loginUser)

router
    .route("/:username")
    .get(requireLogin, getUser)
    .put(requireLogin, updateUser)
    .delete(requireLogin, deleteUser)

export default router
