import express from "express"
import dotenv from "dotenv"

import gameRouter from "./routes/gameRouter"

dotenv.config()
const port = process.env.PORT || 8080

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get("/api", (_req, res) => res.json({ message: "Welcome to Hangman Squad API!" }))
app.use("/api/games", gameRouter)

app.listen(port, () => console.log(`Hangman Squad server listening to :${port}`))
