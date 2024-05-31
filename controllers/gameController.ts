import { Request, Response } from "express";

export function createGame(_req: Request, res: Response) {
    res.json({ message: "Create game" })
}

export function listAllGames(_req: Request, res: Response) {
    res.json({ message: "Get all games (admin only)" })
}

export function getGame(_req: Request, res: Response) {
    res.json({ message: "Get game (player only)" })
}

export function updateGame(_req: Request, res: Response) {
    res.json({ message: "Update game (player only)" })
}

export function deleteGame(_req: Request, res: Response) {
    res.json({ message: "Delete game (player or admin)" })
}
