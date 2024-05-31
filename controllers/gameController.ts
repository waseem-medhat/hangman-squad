import { Request, Response } from "express";
import gameModel from "../models/gameModel"

export async function createGame(req: Request, res: Response) {
    const { id } = req.body
    if (!id) {
        res.status(400).json({ error: "specify an id" })
        return
    }

    const dbGame = await gameModel.findOne({ gameId: id })
    if (dbGame) {
        res.status(400).json({ error: "a game with same id already exists" })
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
    const game = await gameModel.findOne({ gameId: req.params.id })

    if (!game) {
        res.status(404).json({ error: "not found" })
        return
    }

    res.json({ game })
}

export function updateGame(_req: Request, res: Response) {
    res.json({ message: "Update game (player only)" })
}

export async function deleteGame(req: Request, res: Response) {
    const { id } = req.params
    if (!id) {
        res.status(400).json({ error: "specify an id" })
        return
    }

    const deletion = await gameModel.deleteOne({ gameId: id })
    if (deletion.acknowledged && deletion.deletedCount > 0) {
        res.status(204)
        return
    }

    res.status(500).json({ error: "unknown error" })
}
