import { Request, Response } from "express";
import gameModel from "../models/gameModel"

export async function createGame(req: Request, res: Response) {
    const { id } = req.body
    if (!id) {
        res.status(400).json({error: "specify an id"})
        return
    }

    const dbGame = await gameModel.findOne({ gameId: id })
    if (dbGame) {
        res.status(400).json({error: "a game with same id already exists"})
        return
    }

    const newGame = await gameModel.create({ gameId: id, word: "Hello" })
    console.log(newGame);

    res.status(201).json({
        game: {
            gameId: newGame.gameId,
            guesses: newGame.guesses,
            newGame: newGame.wrongGuesses
        }
    })
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
