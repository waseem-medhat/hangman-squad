import { Request, Response } from "express";
import userModel from "../models/userModel"

export async function createUser(req: Request, res: Response) {
    const { username, nickname, password } = req.body
    if (!username || !nickname || !password) {
        res.status(400).json({ error: "incomplete user data" })
        return
    }

    const user = await userModel.findOne({ username })
    if (user) {
        res.status(400).json({ error: "username already exists" })
        return
    }

    const newUser = await userModel.create({ username, nickname, password })
    res.status(201).json({
        user: {
            username: newUser.username,
            nickname: newUser.nickname,
            password: newUser.password
        }
    })
}

export async function getUser(req: Request, res: Response) {
    const user = await userModel.findOne({ username: req.params.username })
    if (!user) {
        res.status(404).json({ error: "not found" })
        return
    }

    res.json({ user })
}

export async function listAllUsers(_req: Request, res: Response) {
    const users = await userModel.find()
    res.json({ users })
}

export async function updateUser(req: Request, res: Response) {
    const user = await userModel.findOne({ username: req.params.id })
    if (!user) {
        res.status(400).json({ error: "trying to update a nonexistent user" })
        return
    }
    res.json({ message: "update user (unimplemented)" })
}

export async function deleteUser(req: Request, res: Response) {
    const { id: username } = req.params
    if (!username) {
        res.status(400).json({ error: "specify an id" })
        return
    }

    await userModel.deleteOne({ username: username })
    res.status(204)
}
