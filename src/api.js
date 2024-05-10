import axios from "axios";

export async function getAllPokemon(offset = 0, limit = 100) {
  const startTime = Date.now();
  let allPokemon = [];
  let pokemonCount = 0;

  try {
    while (pokemonCount < 10000) {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      const pokemonList = response.data.results;

      if (pokemonList.length === 0) break; // No more Pokémon to fetch

      const pokemonDataPromises = pokemonList.map(async (pokemon) => {
        const pokemonDetailsResponse = await axios.get(pokemon.url);
        const pokemonData = pokemonDetailsResponse.data;
        return { ...pokemonData, url: pokemon.url };
      });

      const pokemonData = await Promise.all(pokemonDataPromises);
      allPokemon = [...allPokemon, ...pokemonData];
      pokemonCount += pokemonData.length;

      offset += limit;
    }

    const filteredPokemonData = allPokemon.filter(
      (pokemon) => pokemon.id < 10000
    );

    const endTime = Date.now();
    const deltaTime = endTime - startTime;
    console.log(`Execution time (getAllPokemon): ${deltaTime} ms`);

    return filteredPokemonData;
  } catch (error) {
    throw new Error("Error fetching Pokémon");
  }
}

export async function getPokemonWithSameSpeciesName(basePokemonSpeciesName) {
  const pokemonWithIdGreaterThan10000 = [];
  const pokemonWithIdLessThanOrEqualTo10000 = [];

  try {
    const originalPokemonResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${basePokemonSpeciesName}`
    );
    const originalPokemonData = originalPokemonResponse.data;

    const originalPokemonSpecies = originalPokemonData.species.name;

    pokemonWithIdLessThanOrEqualTo10000.push(originalPokemonData);

    let nextUrl = "https://pokeapi.co/api/v2/pokemon";

    while (nextUrl) {
      const response = await axios.get(nextUrl);
      const pokemonList = response.data.results;

      const filteredPokemon = pokemonList.filter(
        (pokemon) => parseInt(pokemon.url.split("/").slice(-2)[0]) > 10000
      );

      const pokemonDataPromises = filteredPokemon.map(async (pokemon) => {
        const pokemonDetailsResponse = await axios.get(pokemon.url);
        const pokemonDetails = pokemonDetailsResponse.data;
        return pokemonDetails;
      });

      const pokemonData = await Promise.all(pokemonDataPromises);

      const pokemonWithSameSpecies = pokemonData.filter(
        (pokemon) => pokemon.species.name === originalPokemonSpecies
      );

      pokemonWithIdGreaterThan10000.push(...pokemonWithSameSpecies);

      nextUrl = response.data.next;
    }

    const finalPokemonList = [
      ...pokemonWithIdLessThanOrEqualTo10000,
      ...pokemonWithIdGreaterThan10000,
    ];

    return finalPokemonList;
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
}

export async function getEvolutionChain(pokemonSpecies) {
  try {
    const response = await axios.get(pokemonSpecies);
    const evolutionChain = response.data.evolution_chain.url;
    const targetPokemon = response.data.name;

    try {
      const response = await axios.get(evolutionChain);
      const evolutionChainData = response.data.chain;

      const stack = [];
      stack.push({ speciesData: evolutionChainData, prevSpecies: null });

      const evolutionInfo = [];

      while (stack.length > 0) {
        const { speciesData, prevSpecies } = stack.pop();
        const currentInfo = {
          pokemon: targetPokemon,
          evolutionLine: [],
          requirements: {},
          evolvesFrom: prevSpecies,
        };

        currentInfo.evolutionLine.push(speciesData.species.name);

        if (
          speciesData.evolution_details &&
          speciesData.evolution_details.length > 0
        ) {
          currentInfo.requirements = extractRequirements(
            speciesData.evolution_details
          );
        }

        evolutionInfo.push(currentInfo);

        if (speciesData.evolves_to && speciesData.evolves_to.length > 0) {
          speciesData.evolves_to.forEach((evolution) => {
            stack.push({
              speciesData: evolution,
              prevSpecies: speciesData.species.name,
            });
          });
        }
      }

      return evolutionInfo;
    } catch (error) {
      console.log("Error fetching evolution chain:", error);
    }
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
}

function extractRequirements(evolutionDetails) {
  const requirements = {};

  evolutionDetails.forEach((detail) => {
    addRequirement("gender", detail.gender);
    if (detail.gender === 1) addRequirement("gender", "female");
    if (detail.gender === 2) addRequirement("gender", "male");
    addRequirement("held_item", detail.held_item && detail.held_item.name);
    addRequirement("item", detail.item && detail.item.name);
    addRequirement("known_move", detail.known_move && detail.known_move.name);
    addRequirement(
      "known_move_type",
      detail.known_move_type && detail.known_move_type.name
    );
    addRequirement("location", detail.location && detail.location.name);
    addRequirement("min_affection", detail.min_affection);
    addRequirement("min_beauty", detail.min_beauty);
    addRequirement("min_happiness", detail.min_happiness);
    addRequirement("min_level", detail.min_level);
    addRequirement("needs_overworld_rain", detail.needs_overworld_rain);
    addRequirement(
      "party_species",
      detail.party_species && detail.party_species.name
    );
    addRequirement("party_type", detail.party_type && detail.party_type.name);
    addRequirement("relative_physical_stats", detail.relative_physical_stats);
    addRequirement("time_of_day", detail.time_of_day);
    addRequirement(
      "trade_species",
      detail.trade_species && detail.trade_species.name
    );
    addRequirement("trigger", detail.trigger && detail.trigger.name);
    addRequirement("turn_upside_down", detail.turn_upside_down);

    function addRequirement(name, value) {
      if (value !== null && value !== false && value !== "") {
        requirements[name] = value;
      }
    }
  });

  return requirements;
}
