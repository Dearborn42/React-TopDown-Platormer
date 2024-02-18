import React, {useState} from 'react';

const P5Conext = React.createContext();

export default function P5ConentWrapper({children}){
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  return (
    <P5Conext.Provider value={{xPos, yPos, setXPos, setYPos}}>
      {children}
    </P5Conext.Provider>
  )
}
