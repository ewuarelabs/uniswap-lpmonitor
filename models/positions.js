import mongoose from 'mongoose';
const Schema = mongoose.Schema; 

const userPositionSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    liquidityPositions: {
        lpname: {type: String, required: true, unique: true},
        pairAddress: String,
        upperTick: String,
        lowerTick: String
    }
}, {timestamps: true});

export const Position = mongoose.model('Position', userPositionSchema); 