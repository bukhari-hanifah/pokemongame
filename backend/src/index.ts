import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose'
import { CapturePokemons, StarterPkmns } from './components/addmongo';
import { storePkmn } from './components/checkDb';
import { Pokemon } from './interfaces/Pokemon';

config()
const app = express()
const port = process.env.PORT || 3000;
const pokeApi = process.env.pokeApi || 'https://pokeapi.co/api/v2/';
const mongoDb = process.env.mymongodb || 'mongodb+srv://hanifahbukhari:aoRumkey3By49lFq@testcluster.cfqpq.mongodb.net/testApp'
app.use(express.json());
app.use(cors());

mongoose.connect(mongoDb)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

  const Pkmnmodel = mongoose.model("pkmnLegend", StarterPkmns)
  const Capturemodel = mongoose.model("Captured", CapturePokemons)

app.get("/", async (req: Request, res: Response) => {
try {
  await storePkmn(Pkmnmodel);
  const count = await Capturemodel.countDocuments();
  let capturedPkmns
  if(count>0){
    capturedPkmns = await Capturemodel.find()
    console.log(capturedPkmns)
  }
  
  res.json({ message: 'Pokémons inserted successfully.', count:count, capturedPkmns: capturedPkmns});
} 
catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to fetch data' });
}
});

app.get("/start", async (req: Request, res: Response) => {
  try {
    const randomPkmn = await Pkmnmodel.aggregate([{ $sample: { size: 3 } }]);

    if (randomPkmn.length === 0) {
      res.status(404).json({ error: 'No Pokémon found in the database.' });
    }

    console.log(randomPkmn[2])
    res.json({random1: randomPkmn[0], random2: randomPkmn[1], random3: randomPkmn[2]});
  } 
  catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).json({ error: 'Failed to fetch random Pokémon.' });
  }
});

app.get("/rival", async (req: Request, res: Response) => {
  try {
    const randomPkmn = await Pkmnmodel.aggregate([{ $sample: { size: 1 } }]);

    if (randomPkmn.length === 0) {
      res.status(404).json({ error: 'No Pokémon found in the database.' });
    }

    const rivalName = randomPkmn[0].name;
    res.json(rivalName);
  } 
  catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).json({ error: 'Failed to fetch random Pokémon.' });
  }
});

app.post("/fight", async (req: Request, res: Response) => {
  const { pokemon1, pokemon2 } = req.body;
  try {
    const res1 = await fetch(`${pokeApi}pokemon/${pokemon1}`);
    const P1 = await res1.json();
    const res2 = await fetch(`${pokeApi}pokemon/${pokemon2}`);
    const P2 = await res2.json();

    console.log('Received value:', pokemon1, pokemon2);
    console.log("You can now choose your Pokemon!")
    res.json({ message: 'Pokémons inserted successfully.', pokeData1: P1, pokeData2: P2 });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
  });

app.post("/moveText", async (req: Request, res: Response) => {  
  const { myMoves} = req.body;
  console.log('Received value:', myMoves);
  try{
    const responses = await Promise.all(
      myMoves.map(async (moveObj: any) => {
        const response = await fetch(moveObj.move.url);
        return response.json();
      })
    );
  
    const result = responses.map((moveData: any) => ({
      name: moveData.name,
      flavorText: moveData.flavor_text_entries.find(
        (entry: any) => entry.language.name === "en"
      )?.flavor_text || "No flavor text in English",
      damage: moveData.power || "0"
    }));

    console.log('moveDetails:', result);
    res.json({message: "Data Hover Text", moveDetails: result});
  }
  catch(error){
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch moveText' });
  }
})

app.post("/attack", async (req: Request, res: Response) => {
  const { action, p2Health, p1atk, p2df} = req.body;
  console.log('Received value:', action, p2Health, p1atk, p2df);
  try {
    const res1 = await fetch(`${action}`);
    const power = await res1.json();
    const atkName = power.name
    let P2 = p2Health
    let damage
    //damage = (((2*level)/5)+2) * ((power*(attack/defense))/50) + 2 * modifiers
    
    console.log(power.power)
    if(power.power != null){
      const times = (power.power*(p1atk/p2df))/50
      damage = 2.4 * times +2    
      P2 = p2Health - (damage || 0)
    }

    console.log(P2, damage)
    console.log("Attack Turn successful!")
    res.json({ damage: damage || 0, pkmn2: P2, atkName: atkName});
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
  });

app.post("/counter", async (req: Request, res: Response) => {
  const { p1Health, foeAttacks, p2atk, p1df } = req.body;
  console.log('Received value:', p1Health, foeAttacks, p2atk, p1df);
  try {
      const randomIndex = Math.floor(Math.random() * foeAttacks.length);
      const foeMove = foeAttacks[randomIndex].move.name;
      const foeAttackUrl = foeAttacks[randomIndex].move.url;
      const res2 = await fetch(`${foeAttackUrl}`);
      const counter = await res2.json();
      const atkName = counter.name
      let P1 = p1Health
      let damage
      console.log(counter.power)
      if(counter.power !=null){
        const times = (counter.power*(p2atk/p1df))/50
        damage = 2.4 * times +2     
        P1 = p1Health - (damage || 0)
      }
    console.log(P1, damage)
    console.log("Counter Turn successful!")
    res.json({ pkmn1: P1, foeMove, damage: damage || 0,  atkName: atkName});
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
  });
app.post("/capture", async (req: Request, res: Response) => {
  const { maxHp, currentHp, enemyName } = req.body;
  try {
    const rate = 100 - (50 * (currentHp/maxHp))
    const randomNumber = Math.random() * 100;
    if (randomNumber <= rate) {
      const response = await fetch(`${pokeApi}pokemon/${enemyName}`)
      const data:Pokemon = await response.json();
      await Capturemodel.create({
        name: enemyName,
        hp: data?.stats?.find((s) => s.stat.name === "hp")?.base_stat || 0,
        attack: data?.stats?.find((s) => s.stat.name === "attack")?.base_stat || 0,
        defense: data?.stats?.find((s) => s.stat.name === "defense")?.base_stat || 0,
        photo: data?.sprites.other.showdown.front_default || "",
        url: `${pokeApi}pokemon/${enemyName}` 
      });
    console.log(`${enemyName} captured successfully`)
    res.json({ message: `${enemyName} captured successfully`, nab: "success" });
    }
    else{
      console.log(`${enemyName} resists`)
      res.json({ message: `You failed to capture ${enemyName}`, nab: "failed" });
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to store data' });
  }
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});