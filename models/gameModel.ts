import { model, Schema } from 'mongoose';

interface Game {
    word: string;
    guesses: string[];
    wrongGuesses: string[];
}

const gameSchema = new Schema<Game>({
    word: { type: String, required: true },
    guesses: { type: [String], default: [] },
    wrongGuesses: { type: [String], default: [] },
}, {
    timestamps: true
});

const GameModel = model<Game>('Game', gameSchema);

export default GameModel;

