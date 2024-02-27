import React, { useState } from 'react';
import PhaserTest from './PhasterTest';

function App() {
  const [round, setRound] = useState(1);
  const [enemies, setEnemies] = useState(1);
  return (
    // // <div style={{ width: '99vw', height: '99vh' }}>
    //   {/* <P5Sketch /> */}

    // // {/* </div> */}
    <>
      <button onClick={() => setEnemies((prev) => prev++)}>
        Increase Enemies
      </button>
      <PhaserTest round={round} enemies={enemies} />
    </>
  );
}

export default App;
