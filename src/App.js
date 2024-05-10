import React, { useEffect, useState } from "react";
import { getAllPokemon } from "./api.js";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Card from "./components/Card";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllPokemon();
        setPokemonList(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [pokemonList]);

  const handleOpenModal = (pokemonUrl) => {
    setSelectedPokemonUrl(pokemonUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredPokemonList =
    searchTerm.trim() !== ""
      ? pokemonList.filter((pokemon) =>
          pokemon.species.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : pokemonList;

  return (
    <div className="relative">
      <Navbar setSearchTerm={setSearchTerm} />
      {loading && (
        <>
          <div className="hidden fixed inset-0 z-50 bg-black opacity-50 md:flex justify-center items-center">
            <p className="text-white uppercase pokemon text-3xl font-bold">
              L O A D I N G...
            </p>
            <img className="z-51 animate-spin" src="/pokeball.png" alt="" />
          </div>
          <div className="fixed h-screen z-50 bg-black opacity-50 w-screen md:hidden">
            <div className="flex justify-center mt-10">
              <div className="items-center">
                <p className="text-white uppercase pokemon text-3xl font-bold flex justify-center">
                  L O A D I N G...
                </p>
                <img className="z-51 animate-spin" src="/pokeball.png" alt="" />
              </div>
            </div>
          </div>
        </>
      )}
      <div className="fixed top-16 left-0 w-full h-full bg-black z-0 grid grid-cols-10 gap-1">
        {[...Array(70)].map((_, index) => (
          <div key={index} className={`h-full bg-teal-500`}></div>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="z-3">
          <ul className="px-4 pb-20 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPokemonList.map((pokemon) => (
              <Card
                key={pokemon.id}
                pokemon={pokemon}
                onOpenModal={handleOpenModal}
              />
            ))}
          </ul>
        </div>
      </div>
      <Footer />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pokemonUrl={selectedPokemonUrl}
      />
    </div>
  );
}

export default App;
