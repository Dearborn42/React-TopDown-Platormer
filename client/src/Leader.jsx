import React, { useEffect, useState } from 'react'
import "./Styles/leader.css"
const Leader = () => {
    const [leaderboard,setLeaderboard]=useState([])
    useEffect(()=>{
        const fetcho = async () => {
            try {
                const response = await fetch('http://localhost:5000/leaderboard/get', {
                    method: 'GET',
                });
                const data = await response.json();
                const arr = Object.values(data.data)
                arr.pop()
                arr.pop()
                console.log(arr)
                setLeaderboard(arr)
                // .map((e) => ( { [e[0]]: e[1] } ));
            } catch (error) {
                console.error(error);
            }
        };
        fetcho();
    },[])
  return (
    <>
        <h1>Leaderboard</h1>
        <div>
            {leaderboard.map((e,i)=>{
                return(
                    <h3 key={i}>{e.playerName} - Score: {e.playerScore}</h3>
                )
            })}
        </div>
        <a href="/game">Start</a>
    </>
  )
}

export default Leader