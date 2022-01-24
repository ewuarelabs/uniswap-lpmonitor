import mongoose from 'mongoose';
const Schema = mongoose.Schema; 

const userPositionSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    liquidityPositions: [{
        pairAddress: String,
        upperTick: Number,
        lowerTick: Number
    }]
}, {timestamps: true});

export const Position = mongoose.model('Position', userPositionSchema); 