import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
        const pokemonList = response.data.results;

        const detailedData = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return details.data;
          })
        );

        setPokemonData(detailedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon data.');
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = pokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(term)
    );
    setFilteredPokemon(filtered);
  };

  const handleCardClick = (pokemon) => {
    setSelectedPokemon(pokemon); // Set the selected Pokémon for the modal
  };

  const closeModal = () => {
    setSelectedPokemon(null); // Close the modal
  };

  return (
    <div className="app-container">
      <header className="home-header">
        <h1 className="main-title">Pokédex</h1>
        <p className="subtitle">Explore and learn about your favorite Pokémon!</p>
        <input
          type="text"
          placeholder="Search Pokémon by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
          id="search-section"
        />
      </header>

      {!searchTerm && (
        <div className="welcome-section">
          <div className="welcome-section-icon">⚡</div>
          <h2>Welcome to the Pokédex!</h2>
          <p>
            Discover the amazing world of <span>Pokémon</span>. Use the search bar above to
            explore details about your favorite Pokémon, including their <span>abilities</span>,
            <span>stats</span>, and much more.
          </p>
        </div>
      )}

      {searchTerm && filteredPokemon.length === 0 && (
        <p className="no-results">No Pokémon match your search. Please try again!</p>
      )}

      {searchTerm && filteredPokemon.length > 0 && (
        <div className="pokemon-grid">
          {filteredPokemon.map((pokemon) => (
            <div
              key={pokemon.id}
              className="pokemon-card"
              onClick={() => handleCardClick(pokemon)}
            >
              <div className="pokemon-card-header">
                <h3>{pokemon.name}</h3>
                <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
              </div>
              <img
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                className="pokemon-image"
              />
              <div className="pokemon-types">
                {pokemon.types.map((type, index) => (
                  <span key={index} className="pokemon-type">
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedPokemon && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
            <div className="modal-header">
              <h2>{selectedPokemon.name}</h2>
              <img
                src={selectedPokemon.sprites.other['official-artwork'].front_default}
                alt={selectedPokemon.name}
                className="modal-image"
              />
            </div>
            <div className="modal-body">
              <p>
                <strong>Height:</strong> {selectedPokemon.height}
              </p>
              <p>
                <strong>Weight:</strong> {selectedPokemon.weight}
              </p>
              <p>
                <strong>Abilities:</strong>
              </p>
              <ul>
                {selectedPokemon.abilities.map((ability, index) => (
                  <li key={index}>{ability.ability.name}</li>
                ))}
              </ul>
              <p className="pokemon-description">
                {`The Pokémon ${selectedPokemon.name} is known for its ${
                  selectedPokemon.abilities[0]?.ability.name
                } ability. With a height of ${
                  selectedPokemon.height
                } and weight of ${selectedPokemon.weight}, it's a fascinating species in the Pokémon universe!`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
