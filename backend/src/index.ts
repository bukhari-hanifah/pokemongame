import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose'
import { StarterPkmns } from './components/addmongo';
import { storePkmn } from './components/checkDb';

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

  const Pkmnmodel = mongoose.model("pokemon", StarterPkmns)

app.get("/", async (req: Request, res: Response) => {
try {
  const responses = await Promise.all(
    Array.from({ length: 1025 }, (_, index) =>
      fetch(`${pokeApi}/pokemon-species/${index + 1}`)
    ));

  const speciesData = await Promise.all(responses.map(response => response.json()));
  const result = speciesData.map(species => ({
    name: species.name,
    capture_rate: species.capture_rate
  }));
  const epics = result.filter(species => species.capture_rate === 3).map(species => species.name);

  await storePkmn(epics, Pkmnmodel);
  
  console.log("You can now choose your Pokemon!")
  res.json({ message: 'Pokémons inserted successfully.' });
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});