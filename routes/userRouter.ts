import { Router } from "express"
import { createUser, deleteUser, getUser, listAllUsers, loginUser, updateUser } from "../controllers/userController"

const router = Router()

router
    .route("/")
    .post(createUser)
    .get(listAllUsers)

router.post("/login", loginUser)

router
    .route("/:id")
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

export default router
