import { getEvolutionChain } from "../api.js";

export const handleSecondScreenItemClick = (selectedItemId) => {
  const secondScreen = document.querySelector(".second-screen");
  const allChildren = secondScreen.children;
  for (let i = 0; i < allChildren.length; i++) {
    if (i + 1 === selectedItemId) {
      allChildren[i].classList.remove("hidden");
    } else {
      allChildren[i].classList.add("hidden");
    }
  }
};

export const changePokemonForm = async (newPokemonUrl, setPokemonData) => {
  try {
    const pokemonDataUrl = `https://pokeapi.co/api/v2/pokemon/${newPokemonUrl}`;
    const response = await fetch(pokemonDataUrl);
    const data = await response.json();
    setPokemonData(data);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
};

export const handleImageButtonClick = () => {
  const evoRequirementsMobile = document.querySelector(
    ".evo-requirements-mobile"
  );
  evoRequirementsMobile.classList.add("hidden");

  const imageMobile = document.querySelector(".image-mobile");
  imageMobile.classList.remove("hidden");
};

export const handleDataButtonClick = () => {
  const evoRequirementsSection = document.querySelector(".evo-requirements");
  const dataSection = document.querySelector(".flavor");
  evoRequirementsSection.classList.add("hidden");
  dataSection.classList.remove("hidden");
};

export const handleAltFormsButtonClick = () => {
  const altFormsSection = document.querySelector(".alt");
  const pokemonInfoSection = document.querySelector(".info");

  altFormsSection.classList.remove("hidden");
  pokemonInfoSection.classList.add("hidden");
};

export const handleInfoButtonClick = () => {
  const altFormsSection = document.querySelector(".alt");
  const pokemonInfoSection = document.querySelector(".info");

  altFormsSection.classList.add("hidden");
  pokemonInfoSection.classList.remove("hidden");
};

export const handleStatsButtonClick = () => {
  const statsSection = document.querySelector(".stats");
  const evoSection = document.querySelector(".evo");

  statsSection.classList.remove("hidden");
  evoSection.classList.add("hidden");
};

export const handleEvoDataClick = (evolution) => {
  const evoRequirementsDiv = document.querySelector(".evo-requirements");
  evoRequirementsDiv.innerHTML = "";
  const requirementsHeader = document.createElement("p");
  requirementsHeader.className = "text-lg";
  requirementsHeader.textContent = "Evolution Requirements:";
  evoRequirementsDiv.appendChild(requirementsHeader);

  if (evolution.requirements) {
    const requirements = evolution.requirements;
    const requirementsFragment = document.createDocumentFragment();
    for (const key in requirements) {
      if (Object.hasOwnProperty.call(requirements, key)) {
        const cleanedKey = key.replace(/[^a-zA-Z0-9\s_]/g, " ");
        const value = requirements[key];
        const cleanedValue = value.toString().replace(/[^a-zA-Z0-9\s_]/g, " ");

        // Agregar el requisito de evolución
        const requirementElement = document.createElement("p");
        requirementElement.className = "text-sm ml-1";
        requirementElement.textContent = `${cleanedKey}: ${cleanedValue}`;
        requirementsFragment.appendChild(requirementElement);
      }
    }
    evoRequirementsDiv.appendChild(requirementsFragment);
  } else {
    const noRequirementsMessage = document.createElement("p");
    noRequirementsMessage.className = "text-sm ml-1";
    noRequirementsMessage.textContent = "No evolution requirements defined.";
    evoRequirementsDiv.appendChild(noRequirementsMessage);
  }

  evoRequirementsDiv.classList.remove("hidden");

  const flavorTextDiv = document.querySelector(".flavor");
  flavorTextDiv.classList.add("hidden");
};

export const handleEvoDataClickMobile = (evolution) => {
  const imageMobile = document.querySelector(".image-mobile");
  imageMobile.classList.add("hidden");

  const evoRequirementsDivMobile = document.querySelector(
    ".evo-requirements-mobile"
  );

  evoRequirementsDivMobile.innerHTML = "";

  const requirementsHeader = document.createElement("p");
  requirementsHeader.className = "text-lg";
  requirementsHeader.textContent = "Evolution Requirements:";
  evoRequirementsDivMobile.appendChild(requirementsHeader);

  if (
    evolution.requirements &&
    Object.keys(evolution.requirements).length > 1
  ) {
    const requirements = evolution.requirements;
    const requirementsFragment = document.createDocumentFragment();
    for (const key in requirements) {
      if (Object.hasOwnProperty.call(requirements, key)) {
        const cleanedKey = key.replace(/[^a-zA-Z0-9\s_]/g, " ");
        const value = requirements[key];
        const cleanedValue = value.toString().replace(/[^a-zA-Z0-9\s_]/g, " ");

        const requirementElement = document.createElement("p");
        requirementElement.className = "text-sm ml-1";
        requirementElement.textContent = `${cleanedKey}: ${cleanedValue}`;
        requirementsFragment.appendChild(requirementElement);
      }
    }
    evoRequirementsDivMobile.appendChild(requirementsFragment);
  } else {
    const noRequirementsMessage = document.createElement("p");
    noRequirementsMessage.className = "text-sm ml-1";
    noRequirementsMessage.textContent = "No evolution requirements defined.";
    evoRequirementsDivMobile.appendChild(noRequirementsMessage);
  }

  evoRequirementsDivMobile.classList.remove("hidden");

  const flavorTextDiv = document.querySelector(".flavor");
  flavorTextDiv.classList.add("hidden");
};

export const handleEvoLineClick = async (
  pokemonData,
  setEvolutionChainData
) => {
  try {
    const speciesName = pokemonData.species.url;
    const evolutionChainData = await getEvolutionChain(speciesName);
    setEvolutionChainData(evolutionChainData);
    const evoSection = document.getElementsByClassName("evo")[0];
    evoSection.classList.remove("hidden");

    const pokemonStats = document.getElementsByClassName("stats")[0];
    pokemonStats.classList.add("hidden");

    setTimeout(() => {
      const evoDataButtonsDesktop = document.querySelectorAll(".evo-data");
      for (let i = 0; i < evoDataButtonsDesktop.length; i++) {
        const button = evoDataButtonsDesktop[i];
        button.addEventListener("click", () =>
          handleEvoDataClick(evolutionChainData[i])
        );
      }

      const evoDataButtonsMobile =
        document.querySelectorAll(".evo-data-mobile");
      for (let i = 0; i < evoDataButtonsMobile.length; i++) {
        const button = evoDataButtonsMobile[i];
        button.addEventListener("click", () =>
          handleEvoDataClick(evolutionChainData[i])
        );
      }
    }, 200);
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
  }
};
