import React, { useState } from "react";

function Navbar({ setSearchTerm }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleKeyPress = (e) => {
    setSearchTerm(e.target.value);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <nav className="sticky top-0 bg-gray-800 text-white p-4 z-10 flex items-center pokemon">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-center text-2xl md:text-3xl font-bold">
          GLOBAL POKEDEX
        </h1>
      </div>
      <div className="">
        <form action="">
          <div className="border-black border-3 flex">
            <input
              className="uppercase px-4 py-1 text-black rounded-md shadow-[0_-2px_4px_rgba(0,0,0,0.6)] active:border-2 active:border-white"
              placeholder="SEARCH BY NAME"
              type="text"
              onKeyUp={handleKeyPress}
            />
            <button
              type="button"
              className={`w-10 ${isAnimating ? "tada" : ""}`}
            >
              <img className="boton h-10" src="/pokeball.png" alt="" />
            </button>
          </div>
          <div></div>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
