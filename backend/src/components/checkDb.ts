import mongoose from 'mongoose';
import { StarterPkmns } from './addmongo';

export async function storePkmn(epics: string[], PkmnModel: mongoose.Model<any>) {
  try {
    const count = await mongoose.model('pokemon', StarterPkmns).countDocuments();
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
            front_default: pkmnData.sprites?.front_default,
            back_default: pkmnData.sprites?.back_default,
            dream_front: pkmnData.sprites?.other?.dream_world?.front_default || null,
            showdown_front: pkmnData.sprites?.other?.showdown?.front_default || null,
            showdown_back: pkmnData.sprites?.other?.showdown?.back_default || null,
            hp: pkmnData.stats?.[0]?.base_stat || 0,
            attack: pkmnData.stats?.[1]?.base_stat || 0
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