import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

// Extend the Request type to include user
declare global {
    namespace Express {
        interface Request {
            user: {
                username: string;
            };
        }
    }
}

export function requireLogin(req: Request, res: Response, next: NextFunction) {
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

    req.user = { username: decoded.username }
    next()
}
