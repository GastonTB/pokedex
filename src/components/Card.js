import React, { useState } from "react";

function Card({ pokemon, onOpenModal }) {
  const [isHovered, setIsHovered] = useState(false);
  const primaryType = pokemon.types[0].type.name;

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleHoverOut = () => {
    setIsHovered(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "normal":
        return "to-gray-200";
      case "fire":
        return "to-orange-500";
      case "water":
        return "to-blue-500";
      case "grass":
        return "to-green-500";
      case "electric":
        return "to-yellow-300";
      case "ice":
        return "to-cyan-300";
      case "fighting":
        return "to-red-600";
      case "poison":
        return "to-fuchsia-500";
      case "ground":
        return "to-amber-500";
      case "flying":
        return "to-sky-200";
      case "psychic":
        return "to-indigo-400";
      case "bug":
        return "to-lime-300";
      case "rock":
        return "to-stone-400";
      case "ghost":
        return "to-purple-950";
      case "dark":
        return "to-black";
      case "steel":
        return "to-zinc-500";
      case "fairy":
        return "to-fuchsia-200";
      case "dragon":
        return "to-blue-900";
      default:
        return "";
    }
  };

  const getColorClass = () => {
    return `bg-gradient-to-r from-black ${getTypeColor(primaryType)}`;
  };

  const getAnimationClass = () => {
    const animations = {
      flash: ["ghost", "dark"],
      swing: ["flying", "dragon"],
      shake: ["ground", "grass"],
      wobble: ["rock", "steel"],
      slideInDown: ["psychic"],
      rubberBand: ["fighting", "fire"],
      vibrate: ["bug", "electric", "ice"],
      tada: ["normal", "fairy", "poison"],
      slideInRight: ["water"],
    };

    if (isHovered) {
      for (let animation in animations) {
        if (animations[animation].includes(primaryType)) {
          return animation;
        }
      }
    }

    return "";
  };

  return (
    <li
      onClick={() => onOpenModal(pokemon.url)}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
      onTouchStart={handleHover}
      onTouchEnd={handleHoverOut}
      className={`py-2 shadow-md m-4 pokemon text-white font-semi-bold ${getColorClass()} card w-82 h-30 transform skew-x-[-12deg] items-center hover:border-4 hover:border-red-500 transition duration-300 ease-in-out`}
    >
      <div className="boder-4 border-black">
        <span className="flex justify-center mb-2 text-3xl">
          <div className="flex items-center md:justify-evenly">
            <div className="relative">
              <div>
                <img
                  className={`sprite ${isHovered ? getAnimationClass() : ""}`}
                  src={pokemon.sprites.front_default}
                  alt={pokemon.species.name}
                />
                <div className="absolute bottom-0 left-0 w-full flex justify-center">
                  <div className="grid grid-cols-3 frame z-10">
                    {Array.from({ length: 9 }).map((_, index) => {
                      let borderClasses = "w-7 h-7 border";

                      switch (index) {
                        case 0:
                          borderClasses +=
                            " border-lime-500 border-t-4 border-l-4 border-b-0 border-r-0";
                          break;
                        case 2:
                          borderClasses +=
                            " border-lime-500 border-t-4 border-r-4  border-b-0 border-l-0";
                          break;
                        case 6:
                          borderClasses +=
                            " border-lime-500 border-t-0 border-r-0  border-b-4 border-l-4";
                          break;
                        case 8:
                          borderClasses +=
                            " border-lime-500 border-b-4 border-r-4  border-t-0 border-l-0";
                          break;
                        case 1:
                        case 3:
                        case 5:
                        case 7:
                          borderClasses += " border-0";
                          break;
                        case 4:
                          borderClasses += "border-0";
                          break;
                        default:
                          break;
                      }

                      return (
                        <div
                          key={`top-${index}`}
                          className={borderClasses}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="z-0">
                <div className="absolute bottom-0 left-0 w-full flex justify-center z-0">
                  <div className="grid grid-cols-3 frame">
                    {Array.from({ length: 9 }).map((_, index) => {
                      let borderClasses = "w-7 h-7 border";

                      switch (index) {
                        case 0:
                          borderClasses +=
                            " border-lime-500 border-t-4 border-l-4 border-b-0 border-r-0";
                          break;
                        case 2:
                          borderClasses +=
                            " border-lime-500 border-t-4 border-r-4  border-b-0 border-l-0";
                          break;
                        case 6:
                          borderClasses +=
                            " border-lime-500 border-t-0 border-r-0  border-b-4 border-l-4";
                          break;
                        case 8:
                          borderClasses +=
                            " border-lime-500 border-b-4 border-r-4  border-t-0 border-l-0";
                          break;
                        case 1:
                        case 3:
                        case 5:
                        case 7:
                          borderClasses += " border-0";
                          break;
                        case 4:
                          borderClasses += "border-0";
                          break;
                        default:
                          break;
                      }

                      return (
                        <div
                          key={`bottom-${index}`}
                          className={borderClasses}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="pt-0.5">
                <img className="h-7" src="/pokeball.png" alt="" />
              </div>
              <div>{pokemon.id.toString().padStart(4, "0")}</div>
            </div>
            <span className="block ml-3 pr-5">
              {pokemon.species.name.toUpperCase()}
            </span>
          </div>
        </span>
      </div>
    </li>
  );
}

export default Card;
