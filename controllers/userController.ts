import { Request, Response } from "express";
import { compareSync, genSalt, hash } from "bcryptjs"
import userModel from "../models/userModel"
import { JwtPayload, sign, verify } from "jsonwebtoken";


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
    const authRegex = /Bearer .+/

    const authHeader = req.header("authorization")
    if (!authHeader || !authRegex.test(authHeader)) {
        res.status(401).json({ error: "invalid or no authorization header" })
        return
    }

    const token = authHeader.split(' ')[1]

    let decoded: JwtPayload
    try {
        const jwtSecret = process.env.JWT_SECRET || ""
        decoded = verify(token, jwtSecret) as JwtPayload
    } catch (error) {
        res.status(401).json({ error: "bad token" })
        return
    }

    if (decoded.username !== req.params.username) {
        res.status(401).json({ error: "unauthorized" })
        return
    }

    const user = await userModel.findOne({ username: decoded.username })
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
    const user = await userModel.findOne({ username: req.params.username })
    if (!user) {
        res.status(400).json({ error: "trying to update a nonexistent user" })
        return
    }

    const { nickname, password } = req.body
    const newUser = await userModel.findOneAndUpdate({
        username: user.username,
        nickname: nickname ? nickname : user.nickname,
        password: password ? password : user.password
    })

    if (!newUser) {
        res.status(500).json({ error: "an error occurred" })
    }

    res.status(200).send()
}

export async function deleteUser(req: Request, res: Response) {
    const username = req.params.username
    if (!username) {
        res.status(400).json({ error: "specify an id" })
        return
    }

    await userModel.deleteOne({ username })
    res.status(204).send()
}
