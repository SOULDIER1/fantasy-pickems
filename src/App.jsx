import React, { useEffect, useState } from "react";

// ===== Demo Data =====
const GAMES = [
  { id: "NE@BUF", away: "NE Patriots", home: "BUF Bills", kickoff: Date.now() + 3600 * 1000 },
  { id: "DAL@PHI", away: "DAL Cowboys", home: "PHI Eagles", kickoff: Date.now() + 7200 * 1000 },
];

// Preloaded players
const POOLS = {
  QB: ["Patrick Mahomes","Josh Allen","Jalen Hurts","Joe Burrow","Justin Herbert","Lamar Jackson","Tua Tagovailoa","Dak Prescott","Trevor Lawrence","Kirk Cousins"],
  RB: ["Christian McCaffrey","Derrick Henry","Saquon Barkley","Nick Chubb","Josh Jacobs","Austin Ekeler","Tony Pollard","Jonathan Taylor","Alvin Kamara","Bijan Robinson"],
  WR: ["Justin Jefferson","Ja'Marr Chase","Tyreek Hill","Davante Adams","Stefon Diggs","CeeDee Lamb","A.J. Brown","Amon-Ra St. Brown","Jaylen Waddle","DeVonta Smith"],
  DEF: ["49ers","Cowboys","Eagles","Jets","Patriots","Steelers","Ravens","Bills","Chiefs","Dolphins"],
};

// Mock leaderboard
const makeLeaderboard = () =>
  Array.from({ length: 10 }).map((_, i) => ({
    name: `User${i + 1}`,
    points: Math.floor(Math.random() * 200),
  }));

// ===== Donation =====
const DONATION_URL = `https://www.paypal.me/salutetosouldiers/20?locale.x=en_US`;
function DonateCard() {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(DONATION_URL)}`;
  return (
    <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-100">
      <h3 className="font-bold text-lg mb-2">Participate — $20 Donation</h3>
      <a href={DONATION_URL} target="_blank" rel="noopener noreferrer"
         className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold">
        Donate $20 via PayPal
      </a>
      <div className="mt-3 flex gap-3 items-center">
        <img src={qr} alt="Donate QR" className="w-20 h-20 bg-white rounded"/>
        <p className="text-xs opacity-80">Scan QR or tap button. Your donation is required to join this week's competition.</p>
      </div>
    </div>
  );
}

// ===== Game Selections =====
function GameCard({ g, pick, setPick }) {
  const locked = g.kickoff <= Date.now();
  return (
    <div className="border rounded p-3 mb-2">
      <div className="flex justify-between">
        <div>{g.away} @ {g.home}</div>
        {locked ? <span className="text-red-500">LOCKED</span> :
         <span className="text-orange-400">Open</span>}
      </div>
      <div className="flex justify-around mt-2">
        <button disabled={locked} onClick={() => setPick(g.id,g.away)}
          className={`px-3 py-1 rounded ${pick===g.away?"bg-green-600":"bg-gray-700"}`}>{g.away}</button>
        <span>vs</span>
        <button disabled={locked} onClick={() => setPick(g.id,g.home)}
          className={`px-3 py-1 rounded ${pick===g.home?"bg-green-600":"bg-gray-700"}`}>{g.home}</button>
      </div>
    </div>
  );
}

// ===== Fantasy Selection =====
function FantasySelector({ fantasy, setFantasy }) {
  return (
    <div className="mt-4">
      <h3 className="font-bold">Pick 3 Fantasy Stars</h3>
      {["QB","RB","WR","DEF"].map((pos, idx)=>(
        <select key={idx} value={fantasy[idx]||""}
          onChange={(e)=>{ const copy=[...fantasy]; copy[idx]=e.target.value; setFantasy(copy); }}
          className="block mt-2 p-1 bg-gray-700 text-white rounded">
          <option value="">Select {pos}</option>
          {POOLS[pos].map(p=><option key={p} value={p}>{p}</option>)}
        </select>
      ))}
    </div>
  );
}

// ===== Tie-Breaker =====
function TieBreaker({ tiebreaker,setTiebreaker }) {
  return (
    <div className="mt-4 border p-3 rounded">
      <h3 className="font-bold">Monday Night Tie-Breaker</h3>
      <div className="mt-2 flex gap-2">
        <select value={tiebreaker.team} onChange={(e)=>setTiebreaker({...tiebreaker,team:e.target.value})}
          className="p-1 bg-gray-700 text-white rounded">
          <option value="">Select Team</option>
          <option value="TeamA">Team A</option>
          <option value="TeamB">Team B</option>
        </select>
        <input type="number" placeholder="Total Points" value={tiebreaker.points}
          onChange={(e)=>setTiebreaker({...tiebreaker,points:e.target.value})}
          className="p-1 bg-gray-700 text-white rounded"/>
      </div>
    </div>
  );
}

// ===== Highlights Feed =====
const DEMO_EVENTS = [
  {emoji:"🚨", text:"QB1 threw a 20-yd TD (+6)", time:"12:01"},
  {emoji:"🔥", text:"RB1 rushed 15 yds (+1.5)", time:"12:05"},
  {emoji:"⚡", text:"WR1 caught 25-yd pass (+2.5)", time:"12:10"},
];
function HighlightsFeed({ events,onExpand }) {
  const recent = [...events].slice(-5).reverse();
  return (
    <div className="mt-4 border rounded p-3 bg-black/40">
      <h3 className="font-bold">Live Highlights</h3>
      {recent.length===0?<div>No highlights yet...</div>:
        <ul>{recent.map(e=><li key={e.time}>{e.emoji} {e.text} <span className="text-xs text-gray-500">({e.time})</span></li>)}</ul>}
      <button onClick={onExpand} className="mt-2 px-2 py-1 bg-pink-600 rounded">View All Highlights</button>
    </div>
  );
}
function FullHighlights({ events,onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-4 rounded w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between">
          <h3 className="font-bold">All Highlights</h3>
          <button onClick={onClose} className="bg-gray-700 px-2 py-1 rounded">Close</button>
        </div>
        <ul className="mt-2 space-y-1">
          {events.map((e,i)=><li key={i}>{e.emoji} {e.text} ({e.time})</li>)}
        </ul>
      </div>
    </div>
  );
}

// ===== Cash Prizes Panel =====
function CashPrizes({ prizes }) {
  return (
    <div className="mt-4 border border-yellow-500 rounded p-3">
      <h3 className="font-bold text-lg">Cash Prizes This Week</h3>
      <div>🏆 1st Place: ${prizes.first}</div>
      <div>🥈 2nd Place: ${prizes.second}</div>
      <div className="text-xs text-gray-400">Set by Admin: {new Date(prizes.updated).toLocaleString()}</div>
    </div>
  );
}

// ===== Leaderboard =====
function Leaderboard({ players }) {
  return (
    <div className="mt-2 border rounded p-3">
      <h3 className="font-bold text-lg">Top 10 Leaderboard</h3>
      <ol className="ml-4">
        {players.map((p,i)=><li key={i}>{p.name} – {p.points} pts {i<2 && <span className="text-yellow-400">💰</span>}</li>)}
      </ol>
    </div>
  );
}

// ===== Raffle =====
function Raffle() {
  return (
    <div className="mt-4 border rounded p-3">
      <h3 className="font-bold">Sunday Digital Ticket Raffle</h3>
      <p className="text-sm text-gray-300">📍 Prize Pickup Locations:</p>
      <ul className="text-sm text-pink-300">
        <li><a href="https://maps.google.com/?q=Taste+and+Thirst+San+Diego" target="_blank" rel="noopener noreferrer">Taste and Thirst San Diego</a></li>
        <li><a href="https://maps.google.com/?q=Toro+Nightclub+San+Diego" target="_blank" rel="noopener noreferrer">Toro Nightclub San Diego</a> (Sundays)</li>
      </ul>
    </div>
  );
}

// ===== Main App =====
export default function App() {
  const [picks,setPicks] = useState(Object.fromEntries(GAMES.map(g=>[g.id,null])));
  const [fantasy,setFantasy] = useState(["","",""]);
  const [tiebreaker,setTiebreaker] = useState({team:"",points:""});
  const [events,setEvents] = useState([]);
  const [showFull,setShowFull] = useState(false);
  const [prizes] = useState({first:150, second:75, updated:Date.now()});
  const [players] = useState(makeLeaderboard());

  useEffect(()=>{
    const id=setInterval(()=>{
      const e=DEMO_EVENTS[Math.floor(Math.random()*DEMO_EVENTS.length)];
      setEvents(prev=>[...prev,{...e,time:new Date().toLocaleTimeString()}]);
    },8000);
    return ()=>clearInterval(id);
  },[]);

  return (
    <div className="p-4 text-white bg-gray-800 min-h-screen space-y-4">
      <h1 className="text-2xl font-bold">Souldiers Fantasy Pick'ems Preview</h1>
      <DonateCard/>
      {GAMES.map(g=><GameCard key={g.id} g={g} pick={picks[g.id]} setPick={(id,team)=>setPicks({...picks,[id]:team})}/>)}
      <FantasySelector fantasy={fantasy} setFantasy={setFantasy}/>
      <TieBreaker tiebreaker={tiebreaker} setTiebreaker={setTiebreaker}/>
      <HighlightsFeed events={events} onExpand={()=>setShowFull(true)}/>
      {showFull && <FullHighlights events={events} onClose={()=>setShowFull(false)}/>}
      <CashPrizes prizes={prizes}/>
      <Leaderboard players={players}/>
      <Raffle/>
    </div>
  );
}
