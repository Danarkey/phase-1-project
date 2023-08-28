const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

    const calculateBarWidth = (value) => (value / 255) * 100;
    const calculateBarColor = (value) => {
      if (value > 150) {
        return "#52ff00"; // Green
      } else if (value > 100) {
        return "#ccff00"; // Yellow
      } else {
        return "#fffe00"; // Red
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
    const autocompleteDropdown = document.getElementById("autocomplete-dropdown");
    const awesomplete = new Awesomplete(searchInput, {
      list: [],
      minChars: 2, // Adjust the minimum characters required for suggestions
    });

    searchInput.addEventListener("input", (event) => {
      const searchText = event.target.value;
      fetch(apiUrl + "?limit=10&offset=0")
        .then((response) => response.json())
        .then((data) => {
          const pokemonList = data.results.map((pokemon) => pokemon.name);
          const filteredList = pokemonList.filter((pokemon) =>
            pokemon.includes(searchText.toLowerCase())
          );
          awesomplete.list = filteredList;
        })
        .catch((error) => {
          console.error("Error fetching API data:", error);
        });
    });