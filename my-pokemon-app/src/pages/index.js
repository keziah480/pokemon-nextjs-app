import { useEffect, useState } from 'react';
import Link from 'next/link';

// Main page that displays an ordered list of pokemon in groups of 12

export default function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const initialUrl = 'https://pokeapi.co/api/v2/pokemon?limit=12';

  useEffect(() => {
    fetchData(initialUrl);
  }, []);

  const fetchData = async (url) => {
    setLoading(true);
    const response = await fetch(url);
    const data = await response.json();
    const detailedPokemonPromises = data.results.map(async (poke) => {
      const pokeResponse = await fetch(poke.url);
      const pokeData = await pokeResponse.json();
      return {
        name: pokeData.name,
        id: pokeData.id,
        image: pokeData.sprites.front_default,
      };
    });

    const detailedPokemon = await Promise.all(detailedPokemonPromises);
    setPokemon(detailedPokemon);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Pokémon List</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols- sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pokemon.map((poke, index) => (
              <Link href={`/pokemon/${poke.id}`} key={index} legacyBehavior>
                <a className="bg-white p-4 rounded shadow flex flex-col items-center hover:bg-gray-100 transition duration-200 ease-in-out">
                  <img src={poke.image} alt={poke.name} className="w-20 h-20 object-contain" />
                  <h2 className="text-xl font-bold capitalize mt-2">{poke.name}</h2>
                </a>
              </Link>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {prevUrl && (
              <button
                onClick={() => fetchData(prevUrl)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Previous
              </button>
            )}
            {nextUrl && (
              <button
                onClick={() => fetchData(nextUrl)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
