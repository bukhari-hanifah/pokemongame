import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MoveDetails, Pokemon } from "../interfaces/Pokemon";
import waterfall from "./battle/waterfall.gif"
import torii from "./battle/torii.gif"
import pier from "./battle/pier.gif"
import grass from "./battle/grass.gif"
import field from "./battle/field.gif"
import desert from "./battle/desert.gif"
import "./components/titleMenu.css"

interface FightProps {
  selectedPkmn: string | null;
  Rival: string | null;
  setCapture: (pkmn: string | null) => void;
  capture: string | null
}

const Fight: React.FC<FightProps> = ({ selectedPkmn, Rival, setCapture, capture}) =>  {
  const navigate = useNavigate();
  const [background, setBackground] = useState("");  
  const backgrounds = [ waterfall, torii, pier, grass, field, desert ];

  const backApi = "http://localhost:3000/"
  const [pkmnData, setPkmnData] = useState<Pokemon | null>(null);
  const [foeData, setfoeData] = useState<Pokemon | null>(null);
  const [pkmnHealth, setPkmnHealth] = useState<number>(0);
  const [foeHealth, setFoeHealth] = useState<number>(0);
  const [moves, setMoves] = useState<any[]>([])
  const [foemoves, setFoeMoves] = useState<any[]>([])
  const [moveDescription, setMovedescription] = useState<MoveDetails[]>([])
  const [attackTriggered, setAttackTriggered] = useState(false);
  const [getPkmn, setGetpkmn] = useState(false);
  const [failed, setFailed] = useState(false);
  const [conclude, setConclude] = useState<Boolean | null>(null);
  const [actText, setactText] = useState<any[] | null>(null);
  const [foeText, setFoeText] = useState<any[] | null>(null);

  useEffect(() => {
    const fight = async () => {
      const response = await axios.post(`${backApi}fight`, {
        pokemon1: selectedPkmn,
        pokemon2: Rival,
      });
      setPkmnData(response.data.pokeData1);
      setfoeData(response.data.pokeData2);
      setConclude(null)
    };
    fight();

    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBg);
    if(conclude!=null){
      setConclude(null)
    }
  }, [selectedPkmn, Rival]);

  useEffect(() => {
    if (pkmnData?.moves) {
      getMoveDetails(pkmnData?.moves);
      const shuffledMoves = shuffleMoves([...pkmnData.moves]);
      setMoves(shuffledMoves.slice(0, 4));
    }
    if (foeData?.moves) {
      const shuffledMoves = shuffleMoves([...foeData.moves]);
      setFoeMoves(shuffledMoves.slice(0, 4));
    }
    if (pkmnData) {
      setPkmnHealth(pkmnData?.stats?.find((s) => s.stat.name === "hp")?.base_stat || 0);
    }
  
    if (foeData) {
      setFoeHealth(foeData?.stats?.find((s) => s.stat.name === "hp")?.base_stat || 0);
    }
  }, [pkmnData, foeData]);

  const getMoveDetails = async (movesArray: any[]) => {
    const response = await axios.post(`${backApi}moveText`, {
      myMoves: movesArray.slice(0, 4)
    });
    const shuffledMoves = shuffleMoves([...movesArray.slice(0, 4)]);
    setMoves(shuffledMoves)
    setMovedescription(response.data.moveDetails)
  }

  const shuffleMoves = (array: any[]) => {
    if(array.length>3){
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }}
    return array;
  }

  const getFlavorText = (moveName: string): string => {
    const move = moveDescription.find((desc) => {
      return desc.name === moveName;
    });
    return move ? move.flavorText : "Why";
  };

  const getDamage = (moveName: string): string => {
    const move = moveDescription.find((desc) => {
      return desc.name === moveName;
    });
    return move ? move.damage.toString() : "";
  };

  const handleAttack = async(moveUrl: string) => {
    const response = await axios.post(`${backApi}attack`, {
      action: moveUrl,
      p2Health: foeHealth,
      p1atk: pkmnData?.stats?.find((s) => s.stat.name === "attack")?.base_stat || 0,
      p2df: foeData?.stats?.find((s) => s.stat.name === "defense")?.base_stat || 0
    });
    setFoeHealth(response.data.pkmn2)
    setactText([response.data.atkName, response.data.damage])
    if(foeHealth>0){
      handleCounter()
    }
    else{
      setConclude(true)
    }
  };

  const handleCounter = async() => {
    const response = await axios.post(`${backApi}counter`, {
      p1Health: pkmnHealth,
      foeAttacks: foemoves,
      p2atk: foeData?.stats?.find((s) => s.stat.name === "attack")?.base_stat || 0,
      p1df: pkmnData?.stats?.find((s) => s.stat.name === "defense")?.base_stat || 0,
    });
    setPkmnHealth(response.data.pkmn1)
    if(pkmnHealth<0){
      setConclude(false)
    }
    setFoeText([response.data.atkName, response.data.damage])
    if(attackTriggered===false){
    setAttackTriggered(true)}
  };

  const handleCapture = async() => {
    const response = await axios.post(`${backApi}capture`, {
      maxHp: foeData?.stats?.find((s) => s.stat.name === "hp")?.base_stat,
      currentHp: foeHealth,
      enemyName: foeData?.name
    });
    setCapture(response.data.message)
    if(response.data.nab === "failed"){
      handleCounter()
      setFailed(true)
    }
    else{      
      setGetpkmn(true)
      setConclude(true)
      setfoeData(null)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setGetpkmn(false)
    }, 5000); 
    return () => clearTimeout(timer);
  }, [getPkmn])

  useEffect(() => {
    const timer = setTimeout(() => {
      setFailed(false)
    }, 5000); 
    return () => clearTimeout(timer);
  }, [failed])

  useEffect(() => {
    const timer = setTimeout(() => {
      setactText(null)
    }, 3000); 
    return () => clearTimeout(timer);
  }, [actText])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFoeText(null)
    }, 3000); 
    return () => clearTimeout(timer);
  }, [foeText])

  useEffect(() => {
    if (pkmnHealth !== null && pkmnHealth <= 0) {
      setConclude(false);
      setPkmnData(null);
    }
  }, [pkmnHealth]);
  
  useEffect(() => {
    if (foeHealth !== null && foeHealth <= 0) {
      setConclude(true);
      setfoeData(null);
    }
  }, [foeHealth]);

  const handleMenu = () => { navigate("/");  };
  const handleAgain = () => { navigate("/selectPokemon");  };
  const handlePkmnChange = () => { navigate("/selectPokemon");  };
  const handleEnemyChange = () => { navigate("/selectRival")  }

  return (
    <div className="fightPages">
    <div className="bgContainer"><img src={background} className="bg_gif"/></div>
      <h1>Battle!</h1>
      <div className="duelmatch">
        <div className="player">
          <p className="pokemon">{pkmnData?.name}</p>
          <div className="hitPoint">
            <p>HP :</p>
            <div className="hpContainer playerHp" 
            data-hover={`${pkmnHealth.toFixed(2)} / ${pkmnData?.stats?.find((s) => s.stat.name === "hp")?.base_stat || 1}.`}>
            <div className="hpBar" 
            style={{ width: `${ pkmnHealth && pkmnData ? Math.max(0, Math.min((pkmnHealth / (pkmnData?.stats?.find((s) => s.stat.name === "hp")?.base_stat || 1)) * 100, 100)) : 100
          }%`, }}></div>
            </div>
          </div>
        </div>
        <div className="yesP">
          <div className="pkmnImg1">
            <img src={pkmnData?.sprites.other.showdown.back_default || pkmnData?.sprites.back_default}/>
          </div>
        </div>
        {conclude !=true && (
          <>
          <div className="foeP">       
          <img src={foeData?.sprites.other.showdown.front_default}/>
        </div>
        <div className="enemy">
        <p className="pokemon">{foeData?.name}</p>
        <div className="hitPoint">
              <p>HP : </p>
              <div className="hpContainer enemyHp" data-hover={`${foeHealth.toFixed(2)} / ${foeData?.stats?.find((s) => s.stat.name === "hp")?.base_stat || 1}`}>
                <div  className="hpBar" style={{ width: `${foeHealth && foeData ? Math.max(0, Math.min((foeHealth / (foeData?.stats?.find((s) => s.stat.name === "hp")?.base_stat || 1)) * 100, 100)) : 100}%` }}></div>
              </div>
            </div>
        </div></>
        )}

        <div className="playerAction">
          <div className="lifeBox">
            {conclude=== null && (
              <>
                {actText===null && foeText===null &&(
                  <p>What will <br></br><span className="pkmnLabel">{pkmnData?.name}</span> do?</p>
                )}
                {actText &&(
                  <p className="actionText">{pkmnData?.name} used <span className="pkmnAtk">{actText[0]}</span>.<br></br>causing damage of {actText[1].toFixed(2)}</p>
                )}
                {foeText &&(
                  <p className="actionText">{foeData?.name} used <span className="pkmnAtk">{foeText[0]}</span>.<br></br>causing damage of {foeText[1].toFixed(2)}</p>
                )}
                {getPkmn &&(
                  <p><span className="pkmnLabel">{capture}</span></p>
                )}
                {failed &&(
                  <p><span className="pkmnLabel">{capture}</span></p>
                )}
              </>
            )}
            {conclude === true && (
              <p>You won the battle!</p>
            )}
            {conclude === false && (
              <p>You lost the battle!</p>
            )}
          </div>
          {conclude ===null && (              
          <div className="moveBox">            
            {moves.map((moveObj, index) => (
              <div className={`move${index}`}>
                <button key={index} onClick={() => handleAttack(moveObj.move.url)} >{moveObj.move.name}</button>
                <div className="hoverMove">
                  <p>Damage: <span>{getDamage(moveObj.move.name)}</span></p>
                  <p>Details: <span>{getFlavorText(moveObj.move.name)}</span></p>
                </div>
              </div>
            ))}
              <div className="change">
              <button onClick={handleEnemyChange} className="">Change Opponent</button>
                <div className="hoverMove">
                <p>Find another Pokemon other than <span>{foeData?.name}</span></p>
                </div>
              </div>
              {foeHealth <foeData?.stats?.find((s) => s.stat.name === "hp")?.base_stat! && attackTriggered &&(
              <div className="captureBtn">
                <div className="hoverMove">
                <p>Capture <span>{foeData?.name}</span></p>
                </div>
                <button className="" onClick={handleCapture}>Capture</button>
              </div>
              )}
          </div>
          )}
        </div>
      </div>
      
      <div className={`settings`}>        
        <button onClick={handleMenu}>Menu</button> | {" "}
        <button onClick={handleAgain}>Again</button> | {" "}
        <button onClick={handlePkmnChange}>Change My Pokemon</button> | {" "}
        <button onClick={handleEnemyChange}>Change Enemy Pokemon</button>
      </div>
    </div>
  )
}

export default Fight
