import React, { useState, useEffect } from "react";

const POOLS = {
  QB: ["Patrick Mahomes","Josh Allen","Jalen Hurts","Joe Burrow","Justin Herbert","Lamar Jackson","Tua Tagovailoa","Dak Prescott","Trevor Lawrence","Kirk Cousins"],
  RB: ["Christian McCaffrey","Derrick Henry","Saquon Barkley","Nick Chubb","Josh Jacobs","Austin Ekeler","Tony Pollard","Jonathan Taylor","Alvin Kamara","Bijan Robinson"],
  WR: ["Justin Jefferson","Ja'Marr Chase","Tyreek Hill","Davante Adams","Stefon Diggs","CeeDee Lamb","A.J. Brown","Amon-Ra St. Brown","Jaylen Waddle","DeVonta Smith"],
  DEF: ["49ers","Cowboys","Eagles","Jets","Patriots","Steelers","Ravens","Bills","Chiefs","Dolphins"],
};

const DONATION_URL = `https://www.paypal.me/salutetosouldiers/20?locale.x=en_US`;
const API_KEY = "67f4c050a11d4bbc9846b5383ee43213";

// === Reusable Card ===
function Card({ title, children, className }) {
  return (
    <div className={`border border-souldiers-gold rounded-lg bg-souldiers-gray p-4 mb-4 shadow-lg ${className}`}>
      {title && <h3 className="font-bold text-lg mb-2 text-souldiers-gold drop-shadow-[0_0_6px_#FFD700]">{title}</h3>}
      {children}
    </div>
  );
}

function DonateCard() {
  return (
    <Card title="Participate — $20 Donation">
      <a href={DONATION_URL} target="_blank" rel="noopener noreferrer"
         className="inline-block px-4 py-2 bg-souldiers-gold text-souldiers-black font-semibold rounded hover:bg-souldiers-accent transition-colors duration-200">
        Donate $20 via PayPal
      </a>
    </Card>
  );
}

function GameCard({ g, pick, setPick }) {
  const locked = g.kickoff <= Date.now();
  return (
    <Card>
      <div className="flex justify-between mb-2">
        <div>{g.away} @ {g.home}</div>
        {locked ? <span className="text-red-500">LOCKED</span> : <span className="text-souldiers-accent">Open</span>}
      </div>
      <div className="flex justify-around mt-3">
        <button disabled={locked} onClick={() => setPick(g.id,g.away)}
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            pick===g.away 
              ? "bg-souldiers-gold text-souldiers-black" 
              : "bg-souldiers-black text-souldiers-gold border border-souldiers-gold"
          } hover:bg-souldiers-gold hover:text-souldiers-black`}>
          {g.away}
        </button>
        <span className="px-2">vs</span>
        <button disabled={locked} onClick={() => setPick(g.id,g.home)}
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            pick===g.home 
              ? "bg-souldiers-gold text-souldiers-black" 
              : "bg-souldiers-black text-souldiers-gold border border-souldiers-gold"
          } hover:bg-souldiers-gold hover:text-souldiers-black`}>
          {g.home}
        </button>
      </div>
    </Card>
  );
}

function FantasySelector({ fantasy, setFantasy }) {
  return (
    <Card title="Pick 3 Fantasy Stars">
      {["QB","RB","WR","DEF"].map((pos, idx)=>(
        <select key={idx} value={fantasy[idx]||""}
          onChange={(e)=>{ const copy=[...fantasy]; copy[idx]=e.target.value; setFantasy(copy); }}
          className="block mt-2 p-2 rounded bg-souldiers-black text-souldiers-gold border border-souldiers-gold focus:ring-2 focus:ring-souldiers-accent w-full">
          <option value="">Select {pos}</option>
          {POOLS[pos].map(p=><option key={p} value={p}>{p}</option>)}
        </select>
      ))}
    </Card>
  );
}

function TieBreaker({ tiebreaker,setTiebreaker }) {
  return (
    <Card title="Monday Night Tie-Breaker">
      <div className="flex gap-2">
        <select value={tiebreaker.team} onChange={(e)=>setTiebreaker({...tiebreaker,team:e.target.value})}
          className="flex-1 p-2 bg-souldiers-black text-souldiers-gold border border-souldiers-gold rounded focus:ring-2 focus:ring-souldiers-accent">
          <option value="">Select Team</option>
          <option value="TeamA">Team A</option>
          <option value="TeamB">Team B</option>
        </select>
        <input type="number" placeholder="Total Points" value={tiebreaker.points}
          onChange={(e)=>setTiebreaker({...tiebreaker,points:e.target.value})}
          className="flex-1 p-2 bg-souldiers-black text-souldiers-gold border border-souldiers-gold rounded focus:ring-2 focus:ring-souldiers-accent"/>
      </div>
    </Card>
  );
}

function Leaderboard({ players }) {
  return (
    <Card title="Top 10 Leaderboard">
      <ol className="space-y-1">
        {players.slice(0,10).map((p,i)=>
          <li key={i} className="flex justify-between">
            <span>{p.name}</span>
            <span>{p.points} pts {i===0 && "🏆"} {i===1 && "🥈"}</span>
          </li>)}
      </ol>
    </Card>
  );
}

export default function App() {
  const [games,setGames] = useState([]);
  const [picks,setPicks] = useState({});
  const [fantasy,setFantasy] = useState(["","",""]);
  const [tiebreaker,setTiebreaker] = useState({team:"",points:""});
  const [week,setWeek] = useState(null);

  // Fetch current NFL week
  useEffect(() => {
    fetch("https://api.sportsdata.io/v3/nfl/scores/json/CurrentWeek/2025REG", {
      headers: { "Ocp-Apim-Subscription-Key": API_KEY }
    })
      .then(res => res.json())
      .then(currentWeek => setWeek(currentWeek))
      .catch(err => console.error("Error fetching current week:", err));
  }, []);

  // Fetch schedule once week is known
  useEffect(() => {
    if (!week) return;
    fetch("https://api.sportsdata.io/v3/nfl/scores/json/Schedules/2025REG", {
      headers: { "Ocp-Apim-Subscription-Key": API_KEY }
    })
      .then(res => res.json())
      .then(data => {
        const filteredGames = data.filter(g => g.Week === week);
        const formatted = filteredGames.map(g => ({
          id: `${g.AwayTeam}@${g.HomeTeam}`,
          away: g.AwayTeam,
          home: g.HomeTeam,
          kickoff: new Date(g.Date).getTime()
        }));
        setGames(formatted);
        setPicks(Object.fromEntries(formatted.map(g=>[g.id,null])));
      })
      .catch(err => console.error("Error fetching games:", err));
  }, [week]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-souldiers-black via-souldiers-gray to-black text-souldiers-gold font-sans">
      {/* Logo Banner */}
      <img src="/logo.png" alt="Souldiers Logo" className="mx-auto mb-4 w-40" />

      <h1 className="text-3xl font-bold mb-6 text-center text-souldiers-gold drop-shadow-[0_0_8px_#FFD700]">
        Souldiers Fantasy Pick'ems
      </h1>

      <DonateCard/>

      {/* Week Display */}
      <Card title="Current Week">
        {week ? <p>Showing games for <b>Week {week}</b></p> : <p>Loading current week...</p>}
      </Card>

      {/* Live Games */}
      {games.length === 0 ? (
        <p className="text-center">Loading games...</p>
      ) : (
        games.map(g=>
          <GameCard key={g.id} g={g} pick={picks[g.id]} setPick={(id,team)=>setPicks({...picks,[id]:team})}/>
        )
      )}

      <FantasySelector fantasy={fantasy} setFantasy={setFantasy}/>
      <TieBreaker tiebreaker={tiebreaker} setTiebreaker={setTiebreaker}/>
      <Leaderboard players={[
        {name:"User1",points:150},
        {name:"User2",points:130},
        {name:"User3",points:120},
      ]}/>
    </div>
  );
}
