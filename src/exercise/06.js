// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback
} from '../pokemon'

const REQUEST_STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
};

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { error };
//   }

//   componentDidCatch(error, info) {
//     console.error({ error, info });
//   }

//   render() {
//     const { error } = this.state;
//     const { children, FallbackComponent } = this.props;

//     if (error) {
//       return <FallbackComponent error={error} />;
//     }

//     return children;
//   }
// }

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error: 
        <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const INITIAL_STATE = {
  error: null,
  pokemon: null,
  status: REQUEST_STATUS.IDLE,
}

function PokemonInfo({ pokemonName }) {
  const [state, setState] = React.useState(INITIAL_STATE);

  const { error, pokemon, status } = state;

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }

    setState({ 
      ...state,
      status: REQUEST_STATUS.PENDING,
    });
    
    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({ 
          ...state,
          pokemon,
          status: REQUEST_STATUS.RESOLVED,
        });
      })
      .catch(error => {
        setState({
          ...state,
          error,
          status: REQUEST_STATUS.REJECTED,
        });
      });
  }, [pokemonName]);

  if (status === REQUEST_STATUS.IDLE) {
    return 'Submit a pokemon';
  }
  else if (status === REQUEST_STATUS.PENDING) {
    return <PokemonInfoFallback name={pokemonName} />;
  }
  else if (status === REQUEST_STATUS.REJECTED) {
    throw error;
  }
  else if (status === REQUEST_STATUS.RESOLVED) {
    return <PokemonDataView pokemon={pokemon} />;
  }

  throw new Error('This should be impossible');
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={[pokemonName]}
          onReset={handleReset}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
        </div>
    </div>
  )
}

export default App
