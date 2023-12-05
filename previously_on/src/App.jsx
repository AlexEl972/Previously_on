import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Accueil from "./components/Accueil";
import Login from "./components/Login";
import SerieDetail from "./components/SerieDetail";
import FriendSection from "./components/FriendSection";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/serie/:id" element={<SerieDetail />} />
        <Route path="/friend" element={<FriendSection />} />
      </Routes>
    </div>
  );
}

export default App;
