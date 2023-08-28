const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

const calculateBarWidth = (value) => (value / 255) * 100;
const calculateBarColor = (value) => {
    console.log("Value:", value);
    if (value >= 120) {
      return "#4eff00"; // Bright Green
    } else if (value >= 100) {
      return "#52ff00"; // Green
    } else if (value === 100) {
      return "#ccff00"; // Yellow
    } else if (value >= 90) {
      return "#ffe400"; // Yellow
    } else if (value >= 80) {
      return "#ffac00"; // Orange
    } else if (value >= 70) {
      return "#ff6600"; // Orange
    } else if (value >= 60) {
      return "#ff4c00"; // Dark Orange
    } else {
      return "#ff0400"; // Red
    }
  };
  
  
const updateStats = (selectedPokemon) => {
  fetch(apiUrl + selectedPokemon)
    .then((response) => response.json())
    .then((data) => {
      const stats = data.stats;

      stats.forEach((stat) => {
        const statName = stat.stat.name;
        const baseStat = stat.base_stat;

        const statValueElement = document.getElementById(`${statName}-value`);
        const statBarElement = document.getElementById(`${statName}-bar`);

        statValueElement.textContent = baseStat;
        statBarElement.style.width = `${calculateBarWidth(baseStat)}%`;
        statBarElement.style.backgroundColor = calculateBarColor(baseStat);
      });
    })
    .catch((error) => {
      console.error("Error fetching API data:", error);
    });
};

const searchInput = document.getElementById("pokemon-search");
const datalist = document.getElementById("pokemon-options");

searchInput.addEventListener("input", (event) => {
  const searchText = event.target.value.toLowerCase();
  datalist.innerHTML = "";

  fetch(apiUrl + `?limit=10&offset=0`)
    .then((response) => response.json())
    .then((data) => {
      const pokemonList = data.results.map((pokemon) => pokemon.name);
      const filteredList = pokemonList.filter((pokemon) => pokemon.includes(searchText));

      filteredList.forEach((pokemon) => {
        const option = document.createElement("option");
        option.value = pokemon;
        datalist.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching API data:", error);
    });
});

searchInput.addEventListener("change", (event) => {
  const selectedPokemon = event.target.value.toLowerCase();
  updateStats(selectedPokemon);
});