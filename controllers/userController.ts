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

    const existingUser = await userModel.findOne({ username })
    if (existingUser) {
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
    if (req.user.username !== req.params.username) {
        res.status(401).json({ error: "unauthorized" })
        return
    }

    const user = await userModel.findOne({ username: req.user.username })
    if (!user) {
        res.status(404).json({ error: "not found" })
        return
    }

    res.json({ username: user.username, nickname: user.nickname })
}

export async function listAllUsers(_req: Request, res: Response) {
    const users = await userModel.find()
    res.json({ users })
}

export async function updateUser(req: Request, res: Response) {
    if (req.user.username !== req.params.username) {
        res.status(401).json({ error: "unauthorized" })
        return
    }

    const user = await userModel.findOne({ username: req.params.username })
    if (!user) {
        res.status(400).json({ error: "trying to update a nonexistent user" })
        return
    }

    let pwNew = user.password
    if (req.body.password) {
        const salt = await genSalt(10)
        pwNew = await hash(req.body.password, salt)
    }

    let nicknameNew = user.nickname
    if (req.body.nickname) {
        nicknameNew = req.body.nickname
    }

    const newUser = await userModel.findOneAndUpdate(
        { username: user.username },
        { nickname: nicknameNew, password: pwNew },
        { new: true }
    )

    if (!newUser) {
        res.status(500).json({ error: "an error occurred" })
        return
    }

    res.status(200).json({
        user: {
            usrname: newUser.username,
            nickname: newUser.nickname
        }
    })
}

export async function deleteUser(req: Request, res: Response) {
    if (req.user.username !== req.params.username) {
        res.status(401).json({ error: "unauthorized" })
        return
    }

    const username = req.params.username
    if (!username) {
        res.status(400).json({ error: "specify an id" })
        return
    }

    await userModel.deleteOne({ username })
    res.status(204).send()
}
