import mongoose from "mongoose";

export const StarterPkmns = new mongoose.Schema({
  name: String,
  front_default: String,
  back_default: String,
  dream_front: String,
  showdown_front: String,
  showdown_back: String,
  hp: Number,
  attack: Number  
})

export const PkmnDetails = new mongoose.Schema({
  name: String,
  cries: String,
  moves: [
    {
      name: String,
      url: String
    }],
  sprites: {
    front_default: String,
    back_default: String,
    dream_front: String,
    showdown_front: String,
    showdown_back: String,
  },
  stats: {
    hp: Number,
    attack: Number
  }
})

