import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAudioPlayer } from "react-use-audio-player";
import selectBg from "./selection/StarterBg.png"
import { StarterPkmns } from "../interfaces/PokemonList";
import { useNavigate } from "react-router-dom";
import "./components/titleMenu.css"

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

  const { load, playing, stop } = useAudioPlayer();
  useEffect(()=> {
    getPkmns();
  }, [])

  const getPkmns = async () => {
    const response = await axios.get(`${backApi}start`)
    setPkmn1(response.data.random1);
    setPkmn2(response.data.random2);
    setPkmn3(response.data.random3);
  }

  const handleCardClick = (name: string, cry: string) => {
    console.log(cry)
    setSelected(selected === name ? null : name);
    if (selected) {
      load(cry, { autoplay: true });
      return;
    }
    if (playing) {
      stop();
    }
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

          <div className={`card-div ${selected === pkmn1?.name ? "selected" : ""}`} onClick={() => handleCardClick(pkmn1?.name!, pkmn1?.cry!)}>
            <h2 className="pkmnName">{pkmn1?.name}</h2>
            <div className="img-div"><img src={pkmn1?.showdown_front} alt="Option 1 Pokemon"/></div>
            <div className="pkmnInfos">
              <p className="pkmnData">HP: <span>{pkmn1?.hp}</span></p>
              <p className="pkmnData">Attack: <span>{pkmn1?.attack}</span></p>
              <p className="pkmnData">Defense: <span>{pkmn1?.defense}</span></p>
            </div>
          </div>
          <div className={`card-div ${selected === pkmn2?.name ? "selected" : ""}`} onClick={() => handleCardClick(pkmn2?.name!, pkmn2?.cry!)}>
            <h2 className="pkmnName">{pkmn2?.name}</h2>
            <div className="img-div"> <img src={pkmn2?.showdown_front} alt="Option 2 Pokemon" /> </div>
            <div className="pkmnInfos">
              <p className="pkmnData">HP: <span>{pkmn2?.hp}</span></p>
              <p className="pkmnData">Attack: <span>{pkmn2?.attack}</span></p>
              <p className="pkmnData">Defense: <span>{pkmn2?.defense}</span></p>
            </div>
          </div>
          <div className={`card-div ${selected === pkmn3?.name ? "selected" : ""}`} onClick={() => handleCardClick(pkmn3?.name!, pkmn3?.cry!)}>
            <h2 className="pkmnName">{pkmn3?.name}</h2>
            <div className="img-div"> <img src={pkmn3?.showdown_front} alt="Option 3 Pokemon"/> </div>
            <div className="pkmnInfos">
              <p className="pkmnData">HP: <span>{pkmn3?.hp}</span></p>
              <p className="pkmnData">Attack: <span>{pkmn3?.attack}</span></p>
              <p className="pkmnData">Defense: <span>{pkmn3?.defense}</span></p>
            </div>
          </div>

        </div>
        <div className="btnContainer"><button onClick={handleNextClick} className="selectBtn">Select Pokemon</button></div>
      </div>
    </div>
  )
}

export default SelectPokemon
