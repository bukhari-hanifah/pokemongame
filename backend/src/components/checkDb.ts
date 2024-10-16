import mongoose from 'mongoose';
import { StarterPkmns} from './addmongo';

export async function storePkmn(PkmnModel: mongoose.Model<any>) {
  const pokeApi = process.env.pokeApi || 'https://pokeapi.co/api/v2/';
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

    const count = await mongoose.model('pkmnLegend', StarterPkmns).countDocuments();
    if (count === null || count === 0) {
      console.log("MongoDB is empty. New Pokémon will be added.");

      await Promise.all(epics.map(async (epic) => {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${epic}`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch Pokémon data for ${epic}: ${response.statusText}`);
          }
          const pkmnData = await response.json();

          await PkmnModel.create({
            name: pkmnData.name,
            dream_front: pkmnData.sprites?.other?.dream_world?.front_default,
            showdown_front: pkmnData.sprites?.other?.showdown?.front_default,
            showdown_back: pkmnData.sprites?.other?.showdown?.back_default,
            hp: pkmnData.stats?.[0]?.base_stat || 0,
            attack: pkmnData.stats?.[1]?.base_stat || 0,
            defense: pkmnData.stats?.[2]?.base_stat || 0,
            cry: pkmnData.cries?.latest || pkmnData.cries?.legacy
          });
          console.log("1 Pokémon stored successfully.");
        } 
        catch (error) {
          console.error("Error fetching or storing Pokémon:", error);
        }
      }));
      console.log("All Pokémons stored successfully.");
    }
    else{
      console.log("MongoDB is not empty. No new Pokémon will be added.");
    }
  } catch (error) {
    console.error("Error while storing Pokémon:", error);
  }
}