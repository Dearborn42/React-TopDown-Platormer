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
                const arr2 =arr.filter((e,i)=>{
                    if(i<10){
                        return e
                    }
                })
                setLeaderboard(arr2)
                // .map((e) => ( { [e[0]]: e[1] } ));
            } catch (error) {
                console.error(error);
            }
        };
        fetcho();
    },[])
  return (
    <div id='lead'>
        <div>
            
            <h1 id='title'>Welcome to space ship game survivor simulator tycoon rpg defense roguelike</h1>
            <p>Mouse to move and aim. LMB to shoot.</p>
            <a href="/game">Start</a>
        <h1 id='title'>Leaderboard</h1>
        
        {leaderboard.map((e,i)=>{
                return(
                    <h3 key={i}>{i+1}. {e.playerName} - Score: {e.playerScore}</h3>
                )
            })}
        </div>
    </div>
  )
}

export default Leader