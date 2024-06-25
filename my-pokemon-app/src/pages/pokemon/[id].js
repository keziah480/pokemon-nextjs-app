import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Secondary page that provides a detailed view on a specific Pokemon

export default function PokemonDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPokemonDetail(id);
    }
  }, [id]);

  const fetchPokemonDetail = async (pokemonId) => {
    setLoading(true);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    setPokemon(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      {pokemon && (
        <>
          <h1 className="text-4xl font-bold text-center mb-4 capitalize">{pokemon.name}</h1>
          <div className="flex justify-center">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-40 h-40" />
          </div>
          <div className="text-center mt-4">
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
            <p>Base Experience: {pokemon.base_experience}</p>
          </div>
          <div className="flex justify-center mt-4">
            <Link href="/" legacyBehavior>
              <a className="bg-blue-500 text-white px-4 py-2 rounded">Home</a>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
