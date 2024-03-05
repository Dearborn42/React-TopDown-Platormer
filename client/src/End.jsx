import React, { useContext, useState } from 'react'
import { SiteContent, SiteContext } from './SiteContent'
import { useNavigate } from "react-router";

const End = () => {
    const {score, game} = useContext(SiteContext);
    const [form, setForm] = useState({
        name: "",
        score: "",
    });
    const navigate = useNavigate();
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        }); 
    }
    async function submitScore(e) {
        e.preventDefault();
        console.log(game);
        // updateForm({score: Math.ceil(game.scene.scenes[0].block.customData.score * difficulty)});
        const leaderboardFetch = await fetch("http://localhost:5000/leaderboard/edit", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(form),
        });
        const leaderboard_response = await leaderboardFetch.json();
        if(leaderboard_response.success){
            console.log(form);
            navigate("/");
        }else{
            console.log(form);
            console.log(leaderboard_response.error);
        }
    }
  return (
    <SiteContent>
        <div>
            <form onSubmit={submitScore}>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder='Enter your name' 
                    required
                    onChange={(e) => updateForm({ name: e.target.value })}
                />
                <button type="submit">Submit your score and name</button>
            </form>
        </div>
    </SiteContent>
  )
}

export default End