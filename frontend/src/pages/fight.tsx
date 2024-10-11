import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pokemon } from "../interfaces/Pokemon";
import waterfall from "./battle/waterfall.gif"
import torii from "./battle/torii.gif"
import pier from "./battle/pier.gif"
import grass from "./battle/grass.gif"
import field from "./battle/field.gif"
import desert from "./battle/desert.gif"

interface FightProps {
  selectedPkmn: string | null;
  Rival: string | null;
  setCapture: (pkmn: string | null) => void;
}
const Fight: React.FC<FightProps> = ({ selectedPkmn, Rival, setCapture}) =>  {
  const navigate = useNavigate();
  const backApi = "http://localhost:3000/"
  const [pkmnData, setPkmnData] = useState<Pokemon | null>(null);
  const [foeData, setfoeData] = useState<Pokemon | null>(null);
  // const [pkmnHealth, setPkmnHealth] = useState<number | null>(null);
  // const [foeHealth, setfoeHealth] = useState<number | null>(null);
  // const [Atk, setAtk] = useState<number | null>(null);
  const [moves, setMoves] = useState<any[]>([])
  const [background, setBackground] = useState("");
  
  const backgrounds = [ waterfall, torii, pier, grass, field, desert ];

  useEffect(() => {
    const fight = async () => {
      const response = await axios.post(`${backApi}fight`, {
        pokemon1: selectedPkmn,
        pokemon2: Rival,
      });
      setPkmnData(response.data.pokeData1);
      setfoeData(response.data.pokeData2);
    };
    fight();

    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBg);
  }, [selectedPkmn, Rival]);

  useEffect(() => {
    if (pkmnData?.moves) {
      const shuffledMoves = shuffleMoves([...pkmnData.moves]);
      setMoves(shuffledMoves.slice(0, 4)); // Select 5 random moves and save to state
    }
  }, [pkmnData]);

  const shuffleMoves = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleMenu = () => { navigate("/");  };
  const handleAgain = () => { navigate("/selectPkmn");  };
  const handlePkmnChange = () => { navigate("/selectPkmn");  };
  const handleEnemyChange = () => { navigate("/selectRival")  }

  return (
    <div className="pages">
    <div className="dimOverlay"></div>
    <div className="bgContainer"><img src={background} className="bg_gif"/></div>
      <h1>Fight!</h1>
      <div className="duelmatch">
        <div className="yesP">
          <div className="pkmnImg1">
            <img src={pkmnData?.sprites.other.showdown.front_default}/>
          </div>
          <div className="player">
            <div className="lifeBox">
              <p className="pkmnLabel">{pkmnData?.name}</p>
              <p className="hitPoint">HP: {pkmnData?.stats?.find((s)=>s.stat.name==="hp")?.base_stat || 0}</p>
            </div>
            <div className="moveBox">
              {moves.map((moveObj, index) => (
                <button key={index}>{moveObj.move.name}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="foeP">
          <div className="lifeBox">
            <p className="pkmnLabel">{foeData?.name}</p>
            <p className="hitPoint">HP: {foeData?.stats?.find((s)=>s.stat.name==="hp")?.base_stat || 0}</p>
          </div>          
          <div className="pkmnImg2">
            <img src={foeData?.sprites.other.showdown.front_default}/>
          </div>
        </div>
      </div>
      <div className="settings">        
        <button onClick={handleMenu}>Menu</button> | {" "}
        <button onClick={handleAgain}>Again</button> | {" "}
        <button onClick={handlePkmnChange}>Change My Pokemon</button> | {" "}
        <button onClick={handleEnemyChange}>Change Enemy Pokemon</button>
      </div>
    </div>
  )
}

export default Fight
