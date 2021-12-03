import InitializeGame from './game/InitializeGame'

function App() {
  const playerId = prompt('enter id');

  return (<>
    { playerId && <InitializeGame playerId={playerId} /> }
    </>
  )
}

export default App;