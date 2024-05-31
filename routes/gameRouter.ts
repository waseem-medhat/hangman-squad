import {Router} from "express"
import { createGame, deleteGame, getGame, listAllGames, updateGame } from "../controllers/gameController"

const router = Router()

router.post("/", createGame)
router.get("/", listAllGames)
router.get("/:id", getGame)
router.put("/:id", updateGame)
router.delete("/:id", deleteGame)

export default router
