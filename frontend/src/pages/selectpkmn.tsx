import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import selectBg from "./selection/StarterBg.png"
import { StarterPkmns } from "../interfaces/PokemonList";
import { useNavigate } from "react-router-dom";

interface SelectPokemonProps {
  setSelectedPkmn: (pkmn: string | null) => void;
}

const SelectPokemon: React.FC<SelectPokemonProps> = ({setSelectedPkmn}) =>  {
  const navigate = useNavigate();
  const backApi = "http://localhost:3000/"
  const [pkmn1, setPkmn1] = useState<StarterPkmns | null>(null);
  const [pkmn2, setPkmn2] = useState<StarterPkmns | null>(null);
  const [pkmn3, setPkmn3] = useState<StarterPkmns | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(()=> {
    getPkmns();
  }, [])

  const getPkmns = async () => {
    const response = await axios.get(`${backApi}start`)
    setPkmn1(response.data.random1);
    setPkmn2(response.data.random2);
    setPkmn3(response.data.random3);
  }

  const handleCardClick = (name: string) => {
    setSelected(selected === name ? null : name);
  };

  const handleNextClick = () => {
    if (selected) {
      setSelectedPkmn(selected);
      navigate("/selectRival");
    }
  };
  return (
    <div className="pageTitle">
      <div className="bgContainer"><img src={selectBg} className="bg_gif"/></div>
      <div className="pages">
        <h1 className="starterHead">Legendary Pokemon Battle</h1>
        <div className="pkmnCards">

          <div className={`card-div ${selected === pkmn1?.name ? "selected" : ""}`} onClick={() => handleCardClick(pkmn1?.name!)}>
            <div className="img-div"><img src={pkmn1?.showdown_front} alt="Option 1 Pokemon"/></div>
            <div className="text-container">
              <h2 className="pkmnName">{pkmn1?.name}</h2>
              <div className="pkmnInfos">
                <p className="pkmnData1">HP: {pkmn1?.hp}</p>
                <p className="pkmnData2">Attack: {pkmn1?.attack}</p>
              </div>
            </div>
          </div>
          <div className={`card-div ${selected === pkmn2?.name ? "selected" : ""}`} onClick={() => handleCardClick(pkmn2?.name!)}>
            <div className="img-div"> <img src={pkmn2?.showdown_front} alt="Option 2 Pokemon" /> </div>
            <div className="text-container">
              <h2 className="pkmnName">{pkmn2?.name}</h2>
              <div className="pkmnInfos">
                <p className="pkmnData1">HP: {pkmn2?.hp}</p>
                <p className="pkmnData2">Attack: {pkmn2?.attack}</p>
              </div>
            </div>
          </div>
          <div className={`card-div ${selected === pkmn3?.name ? "selected" : ""}`} onClick={() => handleCardClick(pkmn3?.name!)}>
            <div className="img-div"> <img src={pkmn3?.showdown_front} alt="Option 3 Pokemon"/> </div>
            <div className="text-container">
              <h2 className="pkmnName">{pkmn3?.name}</h2>
              <div className="pkmnInfos">
                <p className="pkmnData1">HP: {pkmn3?.hp}</p>
                <p className="pkmnData2">Attack: {pkmn3?.attack}</p>
              </div>
            </div>
          </div>

        </div>
        <div className="btnContainer"><button onClick={handleNextClick} className="selectBtn">Select Pokemon</button></div>
      </div>
    </div>
  )
}

export default SelectPokemon
