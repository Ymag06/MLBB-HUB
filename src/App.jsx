import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import MatchDetails from "./components/MatchDetails";
import Standings from "./components/Standings";

export default function App() {
  // Search lives here because both the Navbar (input) and Home (filtering) need it.
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-canvas text-zinc-200">
      <Navbar search={search} onSearchChange={setSearch} />
      <Routes>
        <Route path="/" element={<Home search={search} />} />
        <Route path="/match/:matchId" element={<MatchDetails />} />
        <Route path="/standings" element={<Standings />} />
      </Routes>
    </div>
  );
}
