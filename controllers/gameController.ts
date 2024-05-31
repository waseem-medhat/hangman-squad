import { Request, Response } from "express";
import gameModel from "../models/gameModel"

export function createGame(_req: Request, res: Response) {
    res.json({ message: "Create game" })
}

export async function listAllGames(_req: Request, res: Response) {
    const games = await gameModel.find()
    res.json({ games })
}

export async function getGame(req: Request, res: Response) {
    const game = await gameModel.findById(req.body.id)
    res.json({ game })
}

export function updateGame(_req: Request, res: Response) {
    res.json({ message: "Update game (player only)" })
}

export function deleteGame(_req: Request, res: Response) {
    res.json({ message: "Delete game (player or admin)" })
}
