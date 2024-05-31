import express from "express"
import dotenv from "dotenv"

dotenv.config()
const port = process.env.PORT || 8080

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get("/v1", (_req, res) => res.json({ message: "Welcome to Hangman Squad API V1!" }))
app.listen(port, () => console.log(`Hangman Squad server listening to :${port}`))
