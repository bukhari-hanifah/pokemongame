import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./components/titleMenu.css"
import autumn1 from "./titlemenu/autumn1.gif"
import park1 from "./titlemenu/park1.gif";
import park2 from "./titlemenu/park2.gif";
import river1 from "./titlemenu/river1.gif"
import river2 from "./titlemenu/river2.gif";;
import cave1 from "./titlemenu/cave1.gif";
import beach1 from "./titlemenu/beach1.gif";
import green1 from "./titlemenu/green1.gif";
import hall1 from "./titlemenu/hall1.gif";
import pond1 from "./titlemenu/pond1.gif";
import stump1 from "./titlemenu/stump1.gif";
import { Captured } from "../interfaces/Captured";

interface SelectPokemonProps {
  setSelectedPkmn: (pkmn: string | null) => void;
}

const TitleMenu: React.FC<SelectPokemonProps> = ({setSelectedPkmn}) => {
  const navigate = useNavigate();
const backApi = "http://localhost:3000/"
const [background, setBackground] = useState("");
const [capturebox, setCapturebox] = useState<Captured[] | null>(null);
const [count, setCount] = useState<number>(0);
const [selected, setSelected] = useState<string | null>(null);

const backgrounds = [ autumn1, park1, park2, river1, river2, cave1, beach1, green1, hall1, pond1, stump1 ];

  useEffect(()=> {
    titleScreen();
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBg);
    console.log(count)
  }, [])

  useEffect(() => {
    if (capturebox) {
      console.log("Updated capturebox state:", capturebox);
    }
  }, [capturebox]);

  const titleScreen = async () => {
    try {
    const response = await axios.get(`${backApi}`);
    setCount(response.data.count)
    console.log("Response from backend:", response.data.capturedPkmns);
    setCapturebox(response.data.capturedPkmns)
    } catch(error) {
      console.error("Failed to fetch data", error)
    }
  }
  
  const chosen = (name: string) => {
    setSelected(selected === name ? null : name);
    setSelectedPkmn(name)
  }

  const handleNavigation = () => {
    if (selected === null) {
      navigate("/selectPokemon");
    } else {
      navigate("/selectRival");
    }
  };
  return (
    <div className="pageTitle">
      <div className="dimOverlay"></div>
      <div className="bgContainer"><img src={background} className="bg_gif"/></div>
      <div className="pages">
        <h1 className="startTitle">Legendary Pokemon Battle</h1>
        {count>0 && (
          <div className="capturedBox">
            <div className="Capcounts">Captured Pokemons: <span className="counts">{count}</span></div>
            <div className="pkmnLists">
                {capturebox && (capturebox.map((captured, index) => (
                  <div key={index} className={`list ${selected === captured.name ? "selectedP" : ""}`} onClick={() => chosen(captured.name)}>
                    <h3 className="listTitle">{captured.name}</h3>
                    <div className="listImg"><img src={captured.photo} alt={captured.photo}/></div>
                    <p>HP: <span>{captured.hp}</span></p>
                    <p>Attack: <span>{captured.attack}</span></p>
                    <p>Defense: <span>{captured.defense}</span></p>
                  </div>
                )))}
            </div>
          </div>
        )}
        <div className="btnContainer">
          <button onClick={handleNavigation} className="startBtn">
            {selected === null ? "Start" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TitleMenu

