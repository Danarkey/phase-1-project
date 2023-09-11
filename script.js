const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

let pokemonList = [];
const pokemonListElement = document.querySelector('#pokemon-options'); 
const pokemonInputElement = document.querySelector('#pokemon-search');
const listItems = document.querySelectorAll(".pokemon-preview li");

function fetchPokemon() {
    fetch(apiUrl + `?limit=1020&offset=0`)
        .then((response) => response.json())
        .then(async (data) => {
            const pokemonData = await Promise.all(
                data.results.map(async (pokemon) => {
                    const response = await fetch(pokemon.url);
                    const pokemonDetails = await response.json();
                    return {
                        id: pokemonDetails.id,
                        name: pokemon.name,
                        sprite: pokemonDetails.sprites.front_default,
                    };
                })
            );

            // Sort the Pokémon list by ID
            pokemonData.sort((a, b) => a.id - b.id);

            // Store the data in pokemonList
            pokemonList = pokemonData;
        });
}

// Function to fetch Pokemon ID Name
function loadData(data, element) {
  if (data) {
      element.innerHTML = "";
      data.forEach((item) => {
          const capitalisedPokemonName = item.name.charAt(0).toUpperCase() + item.name.slice(1); // Capitalise the first letter
          const listItem = document.createElement("li");
          listItem.innerHTML = `
              <span>${item.id} - </span>
              <span>${capitalisedPokemonName}</span>
          `;
          element.appendChild(listItem);
      });
  }
}

function filterData(data, searchText) {
    return data.filter((x) => x.name.toLowerCase().includes(searchText.toLowerCase()));
}

fetchPokemon(); // Fetch the Pokémon list when the page loads.

// Event listener to filter and display Pokémon options
pokemonInputElement.addEventListener("input", function () {
    const searchText = pokemonInputElement.value.toLowerCase();
    const filteredList = filterData(pokemonList, searchText);
    loadData(filteredList, pokemonListElement);
});

// Event listener for when a Pokémon is selected
pokemonInputElement.addEventListener("change", function () {
  const selectedPokemon = pokemonInputElement.value.toLowerCase();
  if (selectedPokemon) {
      // Update the Pokémon stats based on the selected Pokémon
      updateStats(selectedPokemon);

      // Capitalise the first letter and update the input field value
      const capitalisedPokemonName = selectedPokemon.charAt(0).toUpperCase() + selectedPokemon.slice(1);
      pokemonInputElement.value = capitalisedPokemonName;

      // Hide or clear the preview list (datalist)
      const datalist = document.getElementById("pokemon-options");
      datalist.innerHTML = "";
  }
});

// Add a single event listener to the entire list
pokemonListElement.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    const clickedPokemon = event.target.textContent.trim().toLowerCase();
    if (clickedPokemon) {
      // Update the Pokémon stats based on the clicked Pokémon
      updateStats(clickedPokemon);

      // Capitalize the first letter and update the input field value
      const capitalizedPokemonName = clickedPokemon.charAt(0).toUpperCase() + clickedPokemon.slice(1);
      pokemonInputElement.value = capitalizedPokemonName;

      // Clear the preview list (datalist)
      const datalist = document.getElementById("pokemon-options");
      datalist.innerHTML = "";
    }
  }
});


// Updating Pokémon stats
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
