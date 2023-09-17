const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

let pokemonList = [];
const pokemonListElement = document.querySelector('#pokemon-options'); 
const pokemonInputElement = document.querySelector('#pokemon-search');
const inputField = document.getElementById("pokemon-search");
const imageUrlContainer = document.getElementById("pokemon-image-container");
const listItems = document.querySelectorAll(".pokemon-preview li");

function fetchPokemon() {
    fetch(apiUrl + `?limit=1010&offset=0`)
        .then((response) => response.json())
        .then(async (data) => {
            const pokemonData = await Promise.all(
                data.results.map(async (pokemon) => {
                    const response = await fetch(pokemon.url);
                    const pokemonDetails = await response.json();
                    return {
                        id: pokemonDetails.id,
                        name: pokemon.name,
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
          listItem.innerHTML = `${item.id} - ${capitalisedPokemonName}`;
          element.appendChild(listItem);
      });
  }
}

function filterData(data, searchText) {
    return data.filter((x) => x.name.toLowerCase().includes(searchText.toLowerCase()));
}

// Fetch the Pokémon list when the page loads
fetchPokemon();

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
      updatePokedata(selectedPokemon);

      // Capitalise the first letter and update the input field value
      const capitalisedPokemonName = selectedPokemon.charAt(0).toUpperCase() + selectedPokemon.slice(1);
      pokemonInputElement.value = capitalisedPokemonName;

      // Hide or clear the preview list
      const datalist = document.getElementById("pokemon-options");
      datalist.innerHTML = "";
  }
});

// Click event listener to the entire list
pokemonListElement.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    const clickedPokemon = event.target.textContent.trim().toLowerCase();
    if (clickedPokemon) {
      // Autocomplete and update the input field with the clicked Pokemon name
      pokemonInputElement.value = clickedPokemon;

      // Trigger the "input" event on the input field to manually invoke the input event listener
      const inputEvent = new Event("input", {
        bubbles: true,
        cancelable: true,
      });
      pokemonInputElement.dispatchEvent(inputEvent);

      // Clear the preview list
      const datalist = document.getElementById("pokemon-options");
      datalist.innerHTML = "";
    }
  }
});

function onPokemonInputChange(selectedPokemon) {
  if (selectedPokemon) {
    // Autocomplete and update the input field with the selected Pokemon name
    pokemonInputElement.value = selectedPokemon.toLowerCase();

    // Trigger the "input" event on the input field to manually invoke the input event listener
    const inputEvent = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    pokemonInputElement.dispatchEvent(inputEvent);
  }
}

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

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
  
const updatePokedata = (selectedPokemon) => {
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

          // Fetch the Pokémon image from the API
          const pokemonImageUrl = data.sprites.front_default;
          
          // Set the Pokémon image URL
          imageUrlContainer.style.backgroundImage = `url(${pokemonImageUrl})`;

          // Fetch the species URL from the API
          const speciesUrl = data.species.url;

          // Fetch the species data from the species URL
          fetch(speciesUrl)
              .then((response) => response.json())
              .then((speciesData) => {
                  const speciesName = speciesData.names.find(name => name.language.name === 'en').name;
                  
                  // Set the species name in the #species element
                  document.getElementById('species').textContent = speciesName;
              })
              .catch((error) => {
                  console.error("Error fetching species data:", error);
              });

          // Fetch the Pokémon type from the API
          const types = data.types.map(type => capitaliseFirstLetter(type.type.name));

          // Set the Pokémon types in the #type element
          document.getElementById('type').textContent = types.join(', ');
      })

      .catch((error) => {
          console.error("Error fetching API data:", error);
      });
};

