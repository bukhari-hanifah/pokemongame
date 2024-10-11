import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Bg1 from "./selection/StarterBg7.png"
import Bg2 from "./selection/StarterBg2.png"
import Bg3 from "./selection/StarterBg3.png"
import Bg4 from "./selection/StarterBg4.png"
import Bg5 from "./selection/StarterBg5.png"
import Bg6 from "./selection/StarterBg6.png"
import { useNavigate } from "react-router-dom";

//pokeapi.co/api/v2/location-area/168/pokemon_encounters.version_details[0].encounter_details[0]
interface RivalProps {
  setRival: (pkmn: string | null) => void;
  selectedPkmn: string | null;
}

const SelectRival: React.FC <RivalProps> = ({ setRival, selectedPkmn }) =>  {
  const navigate = useNavigate();
  const backApi = "http://localhost:3000/"
const [background, setBackground] = useState("");

const backgrounds = [ Bg1, Bg2, Bg3, Bg4, Bg5, Bg6 ];

  useEffect(()=> {
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBg);
  }, [])

  const getRandom = async () => {
    const response = await axios.get(`${backApi}rival`)
    setRival(response.data);
    navigate("/fight");
  }

  return (
    <div className="pageTitle">
      <div className="dimOverlay"></div>
      <div className="bgContainer"><img src={background} className="bg_gif"/></div>
      <div className="pages">
        <h1 className="startTitle">Find Rival Pokemon for {selectedPkmn}</h1>
        <div className="btnContainer">
          <button className="startBtn" onClick={getRandom}>Find and Fight</button>
          </div>
      </div>
    </div>
  )
}

export default SelectRival
