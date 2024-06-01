import express from "express"
import dotenv from "dotenv"

import connectDB from "./config/db"
import gameRouter from "./routes/gameRouter"
import userRouter from "./routes/userRouter"

dotenv.config()
connectDB()
const port = process.env.PORT || 8080

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get("/api", (_req, res) => res.json({ message: "Welcome to Hangman Squad API!" }))
app.use("/api/games", gameRouter)
app.use("/api/users", userRouter)

app.listen(port, () => console.log(`Hangman Squad server listening to :${port}`))
