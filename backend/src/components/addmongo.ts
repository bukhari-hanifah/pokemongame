import mongoose from "mongoose";

export const StarterPkmns = new mongoose.Schema({
  name: String,
  dream_front: String,
  showdown_front: String,
  showdown_back: String,
  hp: Number,
  attack: Number,
  defense: Number,
  cry: String
})
export const CapturePokemons = new mongoose.Schema({
  name: String,
  hp: Number,
  attack: Number,
  defense: Number,
  photo: String,
  url: String  
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

