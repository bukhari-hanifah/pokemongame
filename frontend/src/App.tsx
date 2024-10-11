import React from "react";
import { useEffect, useState } from "react";
import "./App.css"
import TitleMenu from "./pages/titlescreen";
import SelectPokemon from "./pages/selectpkmn";
import SelectRival from "./pages/selectRival";
import Fight from "./pages/fight";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

function App() {
  
  const [selectedPkmn, setSelectedPkmn] = useState<string | null>(null);
  const [Rival, setRival] = useState<string | null>(null);
  const [capture, setCapture] = useState<string | null>(null);

  return (
    <Router>
      <div className="container">
        {/* Define routes for different pages */}
        <Routes>
          <Route path="/" element={<TitleMenu />} />
          <Route path="/selectPokemon" element={<SelectPokemon setSelectedPkmn={setSelectedPkmn}/>} />
          <Route path="/selectRival" element={<SelectRival setRival={setRival} selectedPkmn={selectedPkmn} />} />
          <Route path="/fight" element={<Fight selectedPkmn={selectedPkmn} Rival={Rival} setCapture={setCapture} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
