import React, { useEffect, useState } from "react";
import { getPokemonWithSameSpeciesName } from "../api.js";
import { getTypeBgColor, statsNames } from "./StaticComponents.js";
import {
  handleSecondScreenItemClick,
  changePokemonForm,
  handleImageButtonClick,
  handleDataButtonClick,
  handleAltFormsButtonClick,
  handleInfoButtonClick,
  handleStatsButtonClick,
  handleEvoDataClick,
  handleEvoDataClickMobile,
  handleEvoLineClick,
} from "./ButtonHandlers.js";

function Modal({ isOpen, onClose, pokemonUrl }) {
  const [pokemonData, setPokemonData] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [lastFlavorText, setLastFlavorText] = useState(null);
  const [pokemonWithSameSpecies, setPokemonWithSameSpecies] = useState([null]);
  const [evolutionChainData, setEvolutionChainData] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setPokemonData(null);
      setIsAnimated(false);
      setLastFlavorText(null);
      setEvolutionChainData(null);
      setPokemonWithSameSpecies(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(pokemonUrl);
        const data = await response.json();
        setPokemonData(data);
        const pokemonWithSameSpeciesData = await getPokemonWithSameSpeciesName(
          data.name
        );
        setPokemonWithSameSpecies(pokemonWithSameSpeciesData);

        const speciesUrl = data.species.url;
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        const flavorTextEntries = speciesData.flavor_text_entries;
        const flavorTextEntry = flavorTextEntries.find(
          (entry) => entry.language.name === "en"
        );
        if (flavorTextEntry) {
          const sanitizedText = flavorTextEntry.flavor_text
            .replace(/[^A-Za-z0-9áéíóúüÜÁÉÍÓÚ _\-+&]/g, " ")
            .trim();
          setLastFlavorText(sanitizedText);
        } else {
          setLastFlavorText(
            "Currently, there is no information available about this Pokémon."
          );
        }
      } catch (error) {
        setLastFlavorText(
          "This Pokémon is so new that we currently lack any information about it. Stay tuned for updates"
        );
      }
    };

    if (isOpen) {
      fetchData();

      const animationTimeout = setTimeout(() => {
        setIsAnimated(true);
      }, 500);

      return () => clearTimeout(animationTimeout);
    } else {
      setIsAnimated(false);
    }
  }, [isOpen, pokemonUrl]);

  if (!pokemonData) return null;

  const statsChartData = [
    ["Stat", "Value"],
    ["HP", pokemonData.stats[0].base_stat],
    ["Attack", pokemonData.stats[1].base_stat],
    ["Defense", pokemonData.stats[2].base_stat],
    ["Special Attack", pokemonData.stats[3].base_stat],
    ["Special Defense", pokemonData.stats[4].base_stat],
    ["Speed", pokemonData.stats[5].base_stat],
  ];

  const legendItems = statsNames.map((statName, index) => (
    <div key={index} className="flex items-center">
      <div className="w-1 h-1 rounded-full mr-1 font-semibold bg-black"></div>
      <span className="font-semibold text-sm">
        {statName}: {statsChartData[index + 1][1]}
      </span>
    </div>
  ));

  return (
    <div
      id="modal-container"
      className={`fixed inset-0 z-50 flex justify-center items-center pokemon ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => {
          handleSecondScreenItemClick(1);
          onClose();
        }}
      ></div>
      <div className="ml-48 mb-32 md:block hidden overscroll-contain">
        <div className="relative bg-red-500 rounded-lg flex ml-24 justify-center">
          <div
            className={`book w-100 relative rounded-lg border-4 border-red-800 bg-red-500 shadow-lg ${
              isAnimated ? "animate" : ""
            }`}
          >
            <div className={`page6 ${isAnimated ? "page-transformed" : ""}`}>
              <div className="shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] w-full rounded-r-lg  border-4 border-red-800 bg-gradient-to-r from-red-600 to-red-900">
                <div className="  absolute left-1 top-1 h-6 w-6 animate-ping rounded-full bg-opacity-20"></div>
                <div className="imagen bg-teal-400 border border-black m-6 flex h-32  justify-center overflow-y-auto overscroll-contain rounded-md shadow-[0_-1px_1px_rgba(0,0,0,0.6)] flavor">
                  {lastFlavorText ? (
                    <p className="text-lg px-4 mt-2 text-black font-semibold uppercase">
                      {lastFlavorText}
                    </p>
                  ) : (
                    <p className="text-lg px-4 mt-2 text-black font-semibold uppercase">
                      Loading...
                    </p>
                  )}
                </div>
                <div className="evo-requirements hidden font-semibold text-xl  bg-teal-400 border border-black relative m-6  h-32  justify-center  overflow-y-auto overscroll-contain rounded-md shadow-[0_-1px_1px_rgba(0,0,0,0.6)] pl-4 pt-2 uppercase"></div>
                <div className=" mb-4 mt-4 text-white ">
                  <div>
                    <div className="mb-6 flex justify-evenly px-10 ">
                      <button
                        type="button"
                        className="uppercase mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] bg-gradient-to-l from-gray-800  to-gray-600"
                        onClick={handleStatsButtonClick}
                      >
                        Stats
                      </button>

                      <button
                        type="button"
                        className="uppercase mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] bg-gradient-to-l from-gray-800  to-gray-600"
                        onClick={() =>
                          handleEvoLineClick(pokemonData, setEvolutionChainData)
                        }
                      >
                        EVO-LINE
                      </button>

                      <button
                        type="button"
                        className="uppercase mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] bg-gradient-to-l from-gray-800  to-gray-600"
                        onClick={handleDataButtonClick}
                      >
                        Data
                      </button>
                    </div>
                  </div>
                  <div className="mx-6 border rounded-md border-black  bg-teal-400  text-black font-semibold shadow-[0_-2px_2px_rgba(0,0,0,0.6)] uppercase h-32 overflow-y-auto overscroll-contain">
                    <div className="ml-3 stats mt-2">
                      <div className="">
                        <p className="font-semibold text-lg">STATS:</p>
                        <div className="ml-2">{legendItems}</div>
                      </div>
                    </div>
                    <div className="ml-2 z-50 pt-1 evo hidden">
                      <div className="max-h-32 ml-2">
                        {evolutionChainData ? (
                          <>
                            <p className="font-semibold text-lg">
                              Evolution Line:
                            </p>
                            {(() => {
                              const elements = [];
                              for (
                                let i = 0;
                                i < evolutionChainData.length;
                                i++
                              ) {
                                const evolution = evolutionChainData[i];
                                const subElements = [];
                                const hasEvolutions =
                                  evolution.evolutionLine.length > 0;

                                if (!hasEvolutions) {
                                  subElements.push(
                                    <p
                                      key={i}
                                      className="text-sm my-1 uppercase"
                                    >
                                      {evolution.evolutionLine}
                                    </p>
                                  );
                                } else {
                                  for (
                                    let j = 0;
                                    j < evolution.evolutionLine.length;
                                    j++
                                  ) {
                                    const pokemon = evolution.evolutionLine[j];
                                    subElements.push(
                                      <button
                                        key={j}
                                        onClick={() =>
                                          handleEvoDataClick(
                                            evolutionChainData[i]
                                          )
                                        }
                                        className={`flex text-sm my-1 hover:bg-black hover:text-teal-400 focus:bg-black focus:text-teal-400 uppercase evo-data ${
                                          pokemon === pokemonData.species.name
                                            ? "bg-black text-teal-400"
                                            : ""
                                        }`}
                                      >
                                        <div className="flex">
                                          {evolution.evolvesFrom !== null && (
                                            <>
                                              {evolution.evolvesFrom}
                                              <p className="mx-2"> => </p>
                                            </>
                                          )}
                                          {evolution.evolutionLine}
                                        </div>
                                      </button>
                                    );
                                  }
                                }
                                elements.push(<div key={i}>{subElements}</div>);
                              }
                              return elements;
                            })()}
                          </>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`page5 ${isAnimated ? "page-transformed" : ""}`}>
              <div className="first shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] w-full rounded-l-lg  border-4 border-red-800 bg-gradient-to-r from-red-600 to-red-900">
                <div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-gradient-to-r  from-blue-300 to-blue-700 "></div>

                <div className="absolute left-1 top-1 h-6 w-6 bg-white animate-ping rounded-full bg-opacity-20"></div>
                <div className="container">
                  <div className="imagen video-overlay  border border-black relative m-6 flex h-32 items-center justify-center overflow-hidden rounded-md shadow-[0_-1px_1px_rgba(0,0,0,0.6)]">
                    {pokemonData.sprites.other.showdown.front_default ? (
                      <img
                        src={pokemonData.sprites.other.showdown.front_default}
                        alt={pokemonData.name}
                        className="max-w-full max-h-full"
                      />
                    ) : (
                      <img
                        src={pokemonData.sprites.front_default || "error.png"}
                        alt={pokemonData.name}
                        className="max-w-full max-h-full"
                      />
                    )}
                  </div>
                </div>
                <div className="mb-4 mt-4 text-white">
                  <div>
                    <div className="mb-6 flex justify-evenly px-10 ">
                      <button
                        type="button"
                        className="uppercase mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] bg-gradient-to-r from-gray-800  to-gray-600"
                        onClick={handleInfoButtonClick}
                      >
                        Information
                      </button>
                      <button
                        type="button"
                        className="uppercase mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] bg-gradient-to-r from-gray-800  to-gray-600"
                        onClick={handleAltFormsButtonClick}
                      >
                        ALT-Forms
                      </button>
                    </div>
                  </div>
                  <div className="mx-6 border rounded-md border-black  bg-teal-400  text-black font-semibold shadow-[0_-2px_2px_rgba(0,0,0,0.6)] uppercase h-32 overflow-y-auto overscroll-contain imagen">
                    <div className="ml-3 info mt-2">
                      <p className="font-semibold text-lg">
                        {pokemonData.species.name}
                      </p>

                      <ul className="text-sm">
                        <li className="flex ml-4 items-center">
                          <div className="w-1 h-1 rounded-full mr-1 font-semibold bg-black"></div>
                          <p className="font-semibold mr-1">Height:</p>
                          <p>{pokemonData.height / 10} m</p>
                        </li>
                        <li className="flex ml-4 items-center">
                          <div className="w-1 h-1 rounded-full mr-1 font-semibold bg-black"></div>
                          <p className="font-semibold mr-1">weight:</p>
                          <p>{pokemonData.weight / 10} kg</p>
                        </li>
                      </ul>
                      <p className="font-semibold text-lg">TYPES:</p>
                      <div className="flex justify-center">
                        {pokemonData.types.map((type, index) => (
                          <div
                            key={index}
                            className={`pill rounded-l-xl rounded-r-xl px-3 text-sm ${getTypeBgColor(
                              type.type.name
                            )} ${
                              type.type.name === "bug" ||
                              type.type.name === "normal" ||
                              type.type.name === "flying" ||
                              type.type.name === "electric" ||
                              type.type.name === "fairy"
                                ? "text-gray-700"
                                : "text-white"
                            } mr-2`}
                          >
                            {type.type.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="ml-2 alt pt-1 hidden">
                      {pokemonWithSameSpecies ? (
                        pokemonWithSameSpecies.length > 0 ? (
                          <div className="pokemon-same-species">
                            <p className="font-semibold text-lg">
                              Alternative Forms:
                            </p>
                            <div className="uppercase text-sm">
                              {pokemonWithSameSpecies.map((pokemon, index) => (
                                <button
                                  key={index}
                                  className="flex hover:bg-black hover:text-teal-400 focus:bg-black focus:text-teal-400 uppercase my-1"
                                  onClick={() =>
                                    changePokemonForm(
                                      pokemon.name,
                                      setPokemonData
                                    )
                                  }
                                >
                                  <p>{pokemon.name}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p>Loading alternative forms...</p>
                        )
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`flex items-center shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] front bg-gradient-to-br from-red-600 to-red-900 pokemon text-3xl uppercase ${
                isAnimated ? "front-transformed" : ""
              }`}
            >
              <div className="mr-8">
                <div className="row flex justify-center">
                  <p className="text-yellow-200 font-bold ml-8">
                    Global pokedex
                  </p>
                </div>
                <div className="row flex justify-center ml-8">
                  <img src="/pokeball.png" alt="" />
                </div>
                <div className="row flex justify-center mb-10">
                  <p className="text-yellow-200 font-bold ml-8 text-lg">
                    By Gaston Toledo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden mx-3 scale-x-[-1] w-full">
        <div className="">
          <div className="first shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] w-full rounded-lg  border-4 border-red-800 bg-red-600 ">
            <div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-gradient-to-r  from-blue-300 to-blue-700 "></div>
            <div className="absolute left-1 top-1 h-6 w-6 bg-white animate-ping rounded-full bg-opacity-20"></div>
            <div className="absolute right-2 top-0 text-xl">
              <button
                onClick={() => {
                  handleSecondScreenItemClick(1);
                  onClose();
                }}
              >
                x
              </button>
            </div>
            <div className="container">
              <div className="video-overlay image-mobile border border-black relative m-6 flex h-48 items-center justify-center overflow-hidden rounded-md shadow-[0_-1px_1px_rgba(0,0,0,0.6)]">
                {pokemonData ? (
                  pokemonData.sprites.other.showdown.front_default ? (
                    <img
                      src={pokemonData.sprites.other.showdown.front_default}
                      alt={pokemonData.name}
                      className="h-1/2"
                    />
                  ) : (
                    <img
                      src={pokemonData.sprites.front_default || "error.png"}
                      alt={pokemonData.name}
                      className="max-w-full max-h-full"
                    />
                  )
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="evo-requirements-mobile hidden font-semibold text-xl  bg-teal-400 border border-black relative m-6  h-48  justify-center  overflow-y-auto overscroll-contain rounded-md shadow-[0_-1px_1px_rgba(0,0,0,0.6)] pl-4 pt-2 uppercase"></div>
            </div>
            <div className="mb-4 mt-4 text-white">
              <div>
                <div className="flex justify-evenly px-4">
                  <button
                    type="button"
                    className="uppercase image-button w-16 mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] "
                    onClick={handleImageButtonClick}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    className="uppercase w-16 mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] "
                    onClick={() => {
                      handleSecondScreenItemClick(1);
                    }}
                  >
                    Data
                  </button>
                  <button
                    type="button"
                    className="uppercase w-16 mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] "
                    onClick={() => {
                      handleSecondScreenItemClick(2);
                    }}
                  >
                    Info
                  </button>
                </div>
                <div className="mb-6 flex justify-evenly px-4">
                  <button
                    type="button"
                    className="uppercase w-16 mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] "
                    onClick={() => {
                      handleSecondScreenItemClick(3);
                    }}
                  >
                    ALT-Forms
                  </button>
                  <button
                    type="button"
                    className="uppercase w-16 mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] "
                    onClick={() => {
                      handleSecondScreenItemClick(4);
                    }}
                  >
                    Stats
                  </button>

                  <button
                    type="button"
                    className="uppercase w-16 mb-2 me-2 rounded-md bg-gray-800 px-2 py-1.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] "
                    onClick={() => {
                      handleEvoLineClick(pokemonData, setEvolutionChainData);
                      handleSecondScreenItemClick(5);
                    }}
                  >
                    EVO-LINE
                  </button>
                </div>
              </div>
              <div className="mx-6 border rounded-md border-black  bg-teal-400  text-black font-semibold shadow-[0_-2px_2px_rgba(0,0,0,0.6)] uppercase h-32 max-w-100 overflow-y-auto overscroll-contain second-screen">
                <div className="flavor">
                  {lastFlavorText ? (
                    <p className="text-lg px-4 mt-2 text-black font-semibold uppercase">
                      {lastFlavorText}
                    </p>
                  ) : (
                    <p className="text-lg px-4 mt-2 text-black font-semibold uppercase">
                      Loading...
                    </p>
                  )}
                </div>

                <div className="ml-2 info hidden">
                  <p className="font-semibold text-lg">
                    {pokemonData.species.name}
                  </p>

                  <ul className="text-sm">
                    <li className="flex ml-4 items-center">
                      <div className="w-1 h-1 rounded-full mr-1 font-semibold bg-black"></div>
                      <p className="font-semibold mr-1">Height:</p>
                      <p>{pokemonData.height / 10} m</p>
                    </li>
                    <li className="flex ml-4 items-center">
                      <div className="w-1 h-1 rounded-full mr-1 font-semibold bg-black"></div>
                      <p className="font-semibold mr-1">weight:</p>
                      <p>{pokemonData.weight / 10} kg</p>
                    </li>
                  </ul>
                  <p className="font-semibold text-lg">TYPES:</p>
                  <div className="flex justify-center ">
                    {pokemonData.types.map((type, index) => (
                      <div
                        key={index}
                        className={`pill rounded-l-xl rounded-r-xl px-3 text-sm ${getTypeBgColor(
                          type.type.name
                        )} text-white mr-2`}
                      >
                        {type.type.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ml-2 alt pt-1 hidden">
                  {pokemonWithSameSpecies ? (
                    pokemonWithSameSpecies.length > 0 ? (
                      <div className="pokemon-same-species">
                        <p className="font-semibold text-lg">
                          Alternative Forms:
                        </p>
                        <div className="uppercase text-sm">
                          {pokemonWithSameSpecies.map((pokemon, index) => (
                            <button
                              key={index}
                              className="flex hover:bg-black hover:text-teal-400 focus:bg-black focus:text-teal-400 uppercase my-1"
                              onClick={() =>
                                changePokemonForm(pokemon.name, setPokemonData)
                              }
                            >
                              <p>{pokemon.name}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p>Loading alternative forms...</p>
                    )
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
                <div className="ml-3 stats mt-2 hidden">
                  <div className="">
                    <p className="font-semibold text-lg">STATS:</p>
                    <div className="ml-2">{legendItems}</div>
                  </div>
                </div>
                <div className="ml-2 z-50 pt-1 hidden">
                  <div className="max-h-32 ml-2">
                    {evolutionChainData ? (
                      <>
                        <p className="font-semibold text-lg">Evolution Line:</p>
                        {(() => {
                          const elements = [];
                          for (let i = 0; i < evolutionChainData.length; i++) {
                            const evolution = evolutionChainData[i];
                            const subElements = [];
                            const hasEvolutions =
                              evolution.evolutionLine.length > 0;

                            if (!hasEvolutions) {
                              subElements.push(
                                <p key={i} className="text-sm my-1 uppercase">
                                  {evolution.evolutionLine}
                                </p>
                              );
                            } else {
                              for (
                                let j = 0;
                                j < evolution.evolutionLine.length;
                                j++
                              ) {
                                const pokemon = evolution.evolutionLine[j];
                                subElements.push(
                                  <button
                                    onClick={() =>
                                      handleEvoDataClickMobile(
                                        evolutionChainData[i]
                                      )
                                    }
                                    key={j}
                                    className={`flex text-sm my-1 hover:bg-black hover:text-teal-400 focus:bg-black focus:text-teal-400 uppercase evo-data-mobile ${
                                      pokemon === pokemonData.species.name
                                        ? "bg-black text-teal-400"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex">
                                      {evolution.evolvesFrom !== null && (
                                        <>
                                          {evolution.evolvesFrom}
                                          <p className="mx-2"> => </p>
                                        </>
                                      )}
                                      {evolution.evolutionLine}
                                    </div>
                                  </button>
                                );
                              }
                            }
                            elements.push(<div key={i}>{subElements}</div>);
                          }
                          return elements;
                        })()}
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
