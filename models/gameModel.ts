import { model, Schema } from 'mongoose';

interface Game {
    gameId: string;
    word: string;
    guesses: string[];
    wrongGuesses: string[];
}

const gameSchema = new Schema<Game>({
    gameId: { type: String, required: true, unique: true },
    word: { type: String, required: true },
    guesses: { type: [String], default: [] },
    wrongGuesses: { type: [String], default: [] },
}, {
    timestamps: true
});

const GameModel = model<Game>('Game', gameSchema);

export default GameModel;

