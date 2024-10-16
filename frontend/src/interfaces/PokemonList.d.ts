export interface PokemonList {
    count: number
    next: string
    previous: any
    results: Result[]
  }

export interface pkmnWinner {
  name: string
  hp: number
  attack: number
  image: string
}
  
export interface Result {
  winner: string
  message: string
}

export interface StarterPkmns{
  name: string,
  dream_front: string,
  showdown_front: string,
  showdown_back: string,
  hp: number,
  attack: number,
  defense: number,
  cry: string
}