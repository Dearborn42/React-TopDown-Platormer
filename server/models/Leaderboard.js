import mongoose from "mongoose"
const { Schema } = mongoose

const leaderboardSchema = new Schema({
    first:{
        playerName: {
            type: String,
        },
        playerScore:{
            type: Number,
        }
    },
    second:{
        playerName: {
            type: String,
        },
        playerScore:{
            type: Number,
        }
    },
    third:{
        playerName: {
            type: String,
        },
        playerScore:{
            type: Number,
        }
    },
    fourth:{
        playerName: {
            type: String,
        },
        playerScore:{
            type: Number,
        }
    },
    fifth:{
        playerName: {
            type: String,
        },
        playerScore:{
            type: Number,
        }
    },

}, {  database: 'leaderboard', collection: 'players'})

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;