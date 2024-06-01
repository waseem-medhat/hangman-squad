import { Request, Response } from "express";
import { compareSync, genSalt, hash } from "bcryptjs"
import userModel from "../models/userModel"
import { sign } from "jsonwebtoken";

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

    const salt = await genSalt(10)
    const pwHash = await hash(password, salt)

    const newUser = await userModel.create({ username, nickname, password: pwHash })
    res.status(201).json({
        user: {
            username: newUser.username,
            nickname: newUser.nickname
        }
    })
}

export async function loginUser(req: Request, res: Response) {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400).json({ error: "incomplete data" })
        return
    }

    const user = await userModel.findOne({ username })

    if (!user) {
        res.status(400).json({ error: "invalid credentials" })
        return
    }

    if (!compareSync(password, user.password)) {
        res.status(400).json({ error: "invalid credentials" })
        return
    }

    const jwtSecret = process.env.JWT_SECRET || ""
    const token = sign({ username }, jwtSecret, { expiresIn: '1d', })

    res.status(200).json({ token })
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
