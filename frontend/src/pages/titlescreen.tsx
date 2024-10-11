import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/titleMenu.css"
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


const TitleMenu: React.FC = () => {
  const navigate = useNavigate();
const backApi = "http://localhost:3000/"
const [background, setBackground] = useState("");

const backgrounds = [ autumn1, park1, park2, river1, river2, cave1, beach1, green1, hall1, pond1, stump1 ];

  useEffect(()=> {
    titleScreen();
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBg);
  }, [])

  const titleScreen = async () => {
    await axios(`${backApi}`);
  }
  return (
    <div className="pageTitle">
      <div className="dimOverlay"></div>
      <div className="bgContainer"><img src={background} className="bg_gif"/></div>
      <div className="pages">
        <h1 className="startTitle">Legendary Pokemon Battle</h1>
        <div className="btnContainer"><button onClick={() => navigate("/selectPokemon")} className="startBtn">Start</button></div>
      </div>
    </div>
  )
}

export default TitleMenu

