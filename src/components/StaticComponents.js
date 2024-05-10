export const statsNames = [
  "HP",
  "Attack",
  "Defense",
  "Special Attack",
  "Special Defense",
  "Speed",
];

export const getTypeBgColor = (type) => {
  switch (type) {
    case "normal":
      return "bg-gray-200";
    case "fire":
      return "bg-orange-500";
    case "water":
      return "bg-blue-500";
    case "grass":
      return "bg-green-500";
    case "electric":
      return "bg-yellow-300";
    case "ice":
      return "bg-cyan-300";
    case "fighting":
      return "bg-red-600";
    case "poison":
      return "bg-fuchsia-500";
    case "ground":
      return "bg-amber-500";
    case "flying":
      return "bg-sky-200";
    case "psychic":
      return "bg-indigo-400";
    case "bug":
      return "bg-lime-300";
    case "rock":
      return "bg-stone-400";
    case "ghost":
      return "bg-purple-950";
    case "dark":
      return "bg-black";
    case "steel":
      return "bg-zinc-500";
    case "fairy":
      return "bg-fuchsia-200";
    case "dragon":
      return "bg-blue-900";
    default:
      return "";
  }
};
