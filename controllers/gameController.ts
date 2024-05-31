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
    res.status(201).json({
        game: {
            gameId: newGame.gameId,
            guesses: newGame.guesses,
            wrongGuesses: newGame.wrongGuesses
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

export async function updateGame(req: Request, res: Response) {
    const game = await gameModel.findOne({ gameId: req.params.id })
    if (!game) {
        res.status(400).json({ error: "trying to update a nonexistent game" })
        return
    }

    const guess: string = req.body.guess
    if (!guess) {
        res.status(400).json({ error: "specify the guessed letter" })
        return
    }

    const letterRegex = /[a-z]/i
    if (guess.length !== 1 || !letterRegex.test(guess)) {
        res.status(400).json({ error: "guess must be a single letter" })
        return
    }

    const updatedGame = await gameModel.findOneAndUpdate(
        { gameId: req.params.id },
        { guesses: [...game.guesses, guess] },
        { new: true }
    )

    if (!updatedGame) {
        res.status(500).json({ error: "couldn't update" })
        return
    }

    res.json({
        game: {
            gameId: updatedGame.gameId,
            guesses: updatedGame.guesses,
            wrongGuesses: updatedGame.wrongGuesses
        }
    })
}

export async function deleteGame(req: Request, res: Response) {
    const { id } = req.params
    if (!id) {
        res.status(400).json({ error: "specify an id" })
        return
    }

    await gameModel.deleteOne({ gameId: id })
    res.status(204)
}
