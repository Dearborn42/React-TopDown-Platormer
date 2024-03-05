import React, {useState} from 'react'

const SiteContext = React.createContext();

const SiteContent = ({children}) => {
    const [score, setScore] = useState(null);
    const [game, setGame] = useState(null);
    const handleScore = (value) => {setScore(value); console.log(value, score);}
    return (
        <SiteContext.Provider value={{score, handleScore, game, setGame}}>
            {children}
        </SiteContext.Provider>
    )
}

export {SiteContent, SiteContext}