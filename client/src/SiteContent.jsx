import React, {useState} from 'react'

const SiteContext = React.createContext();

const SiteContent = ({children}) => {
    const [score, setScore] = useState(0);
  return (
    <SiteContext.Provider value={{score, setScore}}>
        {children}
    </SiteContext.Provider>
  )
}

export {SiteContent, SiteContext}