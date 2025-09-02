import React, { useState, useEffect } from "react";

// ===== Demo Data =====
const GAMES = [
  { id: "NE@BUF", away: "NE Patriots", home: "BUF Bills", kickoff: Date.now() + 3600 * 1000 },
  { id: "DAL@PHI", away: "DAL Cowboys", home: "PHI Eagles", kickoff: Date.now() + 7200 * 1000 },
];

const POOLS = {
  QB: ["Patrick Mahomes","Josh Allen","Jalen Hurts","Joe Burrow","Justin Herbert","Lamar Jackson","Tua Tagovailoa","Dak Prescott","Trevor Lawrence","Kirk Cousins"],
  RB: ["Christian McCaffrey","Derrick Henry","Saquon Barkley","Nick Chubb","Josh Jacobs","Austin Ekeler","Tony Pollard","Jonathan Taylor","Alvin Kamara","Bijan Robinson"],
  WR: ["Justin Jefferson","Ja'Marr Chase","Tyreek Hill","Davante Adams","Stefon Diggs","CeeDee Lamb","A.J. Brown","Amon-Ra St. Brown","Jaylen Waddle","DeVonta Smith"],
  DEF: ["49ers","Cowboys","Eagles","Jets","Patriots","Steelers","Ravens","Bills","Chiefs","Dolphins"],
};

// ===== Donation =====
const DONATION_URL = `https://www.paypal.me/salutetosouldiers/20?locale.x=en_US`;
function DonateCard() {
  return (
    <div style={{border:"1px solid gray", padding:"1rem", borderRadius:"8px", marginBottom:"1rem"}}>
      <h3>Participate — $20 Donation</h3>
      <a href={DONATION_URL} target="_blank" rel="noopener noreferrer">
        Donate $20 via PayPal
      </a>
      <p style={{fontSize:"0.8rem", marginTop:"0.5rem"}}>
        Your donation is required to join this week's competition.
      </p>
    </div>
  );
}

// ===== Game Selections =====
function GameCard({ g, pick, setPick }) {
  const locked = g.kickoff <= Date.now();
  return (
    <div style={{border:"1px solid gray", borderRadius:"8px", padding:"1rem", marginBottom:"1rem"}}>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <div>{g.away} @ {g.home}</div>
        {locked ? <span style={{color:"red"}}>LOCKED</span> :
         <span style={{color:"orange"}}>Open</span>}
      </div>
      <div style={{display:"flex", justifyContent:"space-around", marginTop:"0.5rem"}}>
        <button disabled={locked} onClick={() => setPick(g.id,g.away)}
          style={{background: pick===g.away?"green":"black", color:"white", padding:"0.5rem 1rem"}}>
          {g.away}
        </button>
        <span>vs</span>
        <button disabled={locked} onClick={() => setPick(g.id,g.home)}
          style={{background: pick===g.home?"green":"black", color:"white", padding:"0.5rem 1rem"}}>
          {g.home}
        </button>
      </div>
    </div>
  );
}

// ===== Fantasy Selection =====
function FantasySelector({ fantasy, setFantasy }) {
  return (
    <div style={{marginTop:"1rem"}}>
      <h3>Pick 3 Fantasy Stars</h3>
      {["QB","RB","WR","DEF"].map((pos, idx)=>( 
        <select key={idx} value={fantasy[idx]||""}
          onChange={(e)=>{ const copy=[...fantasy]; copy[idx]=e.target.value; setFantasy(copy); }}
          style={{display:"block", margin:"0.5rem 0"}}>
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
    <div style={{marginTop:"1rem", border:"1px solid gray", padding:"1rem", borderRadius:"8px"}}>
      <h3>Monday Night Tie-Breaker</h3>
      <div style={{marginTop:"0.5rem", display:"flex", gap:"0.5rem"}}>
        <select value={tiebreaker.team} onChange={(e)=>setTiebreaker({...tiebreaker,team:e.target.value})}>
          <option value="">Select Team</option>
          <option value="TeamA">Team A</option>
          <option value="TeamB">Team B</option>
        </select>
        <input type="number" placeholder="Total Points" value={tiebreaker.points}
          onChange={(e)=>setTiebreaker({...tiebreaker,points:e.target.value})}/>
      </div>
    </div>
  );
}

// ===== Leaderboard =====
function Leaderboard({ players }) {
  return (
    <div style={{marginTop:"1rem", border:"1px solid gray", padding:"1rem", borderRadius:"8px"}}>
      <h3>Top 10 Leaderboard</h3>
      <ol>
        {players.slice(0,10).map((p,i)=>
          <li key={i}>
            {p.name} – {p.points} pts {i===0 && "🏆"} {i===1 && "🥈"}
          </li>)}
      </ol>
    </div>
  );
}

// ===== Participant Entry =====
function ParticipantForm({ addParticipant }) {
  const [name,setName] = useState("");
  const submit = ()=>{
    if(name.trim()){
      addParticipant(name.trim());
      setName("");
    }
  };
  return (
    <div style={{marginTop:"1rem", border:"1px solid gray", padding:"1rem", borderRadius:"8px"}}>
      <h3>Enter Competition</h3>
      <input placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} />
      <button onClick={submit} style={{marginLeft:"0.5rem"}}>Join</button>
    </div>
  );
}

// ===== Participant Dashboard =====
function ParticipantDashboard({ participants }) {
  if (participants.length === 0) return null;
  return (
    <div style={{marginTop:"1rem", border:"2px solid blue", padding:"1rem", borderRadius:"8px"}}>
      <h3>Your Entry This Week</h3>
      {participants.map((p,i)=>(
        <div key={i} style={{marginBottom:"1rem", padding:"0.5rem", border:"1px solid gray", borderRadius:"6px"}}>
          <div><b>{p.name}</b> — {p.points} pts</div>
          <div><b>Picks:</b> {Object.entries(p.picks).map(([gid,team])=>team?`${gid}: ${team}`:"").join(", ")}</div>
          <div><b>Fantasy:</b> {p.fantasy.filter(Boolean).join(", ")}</div>
          <div><b>Tie-Breaker:</b> {p.tiebreaker.team} — {p.tiebreaker.points} pts</div>
          <div style={{color:"green"}}>✅ Locked In</div>
        </div>
      ))}
    </div>
  );
}

// ===== Admin Prize Upload (Manual) =====
function AdminPrizes({prizes,setPrizes}) {
  const [title,setTitle] = useState("");
  const [desc,setDesc] = useState("");
  const addPrize = ()=>{
    if(title && desc){
      setPrizes([...prizes,{title,desc}]);
      setTitle(""); setDesc("");
    }
  };
  return (
    <div style={{marginTop:"1rem", border:"1px solid gray", padding:"1rem", borderRadius:"8px"}}>
      <h3>Admin — Upload Weekly Prize</h3>
      <input placeholder="Prize Title" value={title} onChange={e=>setTitle(e.target.value)} style={{display:"block",marginBottom:"0.5rem"}}/>
      <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} style={{display:"block",marginBottom:"0.5rem"}}/>
      <button onClick={addPrize}>Add Prize</button>
      <ul>
        {prizes.map((p,i)=><li key={i}><b>{p.title}</b> — {p.desc}</li>)}
      </ul>
    </div>
  );
}

// ===== Cash Prizes =====
function CashPrizes({prizes}) {
  return (
    <div style={{marginTop:"1rem", border:"1px solid gold", padding:"1rem", borderRadius:"8px"}}>
      <h3>Cash Prizes This Week</h3>
      <div>1st Place: ${prizes.firstMin}–${prizes.firstMax}</div>
      <div>2nd Place: ${prizes.secondMin}–${prizes.secondMax}</div>
    </div>
  );
}

// ===== Main App =====
export default function App() {
  const [picks,setPicks] = useState(Object.fromEntries(GAMES.map(g=>[g.id,null])));
  const [fantasy,setFantasy] = useState(["","",""]);
  const [tiebreaker,setTiebreaker] = useState({team:"",points:""});
  const [participants,setParticipants] = useState([]);
  const [prizes,setPrizes] = useState([]);
  const [adminCode,setAdminCode] = useState("");
  const cash = {firstMin:100,firstMax:200,secondMin:50,secondMax:100};

  // simulate scoring (demo mode)
  useEffect(()=>{
    if(participants.length>0){
      setParticipants(prev=>prev.map(p=>({...p,points:Math.floor(Math.random()*200)})));
    }
  },[participants.length]);

  const addParticipant = (name)=>{
    setParticipants([...participants,{name,points:0,picks,fantasy,tiebreaker}]);
  };

  // ===== Weekly Reset =====
  const resetWeek = ()=>{
    setParticipants([]);
    setPrizes([]);
    setPicks(Object.fromEntries(GAMES.map(g=>[g.id,null])));
    setFantasy(["","",""]);
    setTiebreaker({team:"",points:""});
    alert("✅ Weekly competition has been reset!");
  };

  return (
    <div style={{padding:"1rem", fontFamily:"sans-serif"}}>
      <h1>Souldiers Fantasy Pick'ems Preview</h1>
      <DonateCard/>
      {GAMES.map(g=><GameCard key={g.id} g={g} pick={picks[g.id]} setPick={(id,team)=>setPicks({...picks,[id]:team})}/>)}
      <FantasySelector fantasy={fantasy} setFantasy={setFantasy}/>
      <TieBreaker tiebreaker={tiebreaker} setTiebreaker={setTiebreaker}/>
      <ParticipantForm addParticipant={addParticipant}/>
      <ParticipantDashboard participants={participants}/>
      <CashPrizes prizes={cash}/>
      <Leaderboard players={[...participants].sort((a,b)=>b.points-a.points)}/>
      <AdminPrizes prizes={prizes} setPrizes={setPrizes}/>
      
      {/* Admin Reset Section */}
      <div style={{marginTop:"1rem", border:"1px solid red", padding:"1rem", borderRadius:"8px"}}>
        <h3>Admin Reset Control</h3>
        <input
          type="password"
          placeholder="Enter Admin Code"
          value={adminCode}
          onChange={(e)=>setAdminCode(e.target.value)}
          style={{marginRight:"0.5rem"}}
        />
        {adminCode==="SOULDIERS2025" && (
          <button onClick={resetWeek} style={{padding:"0.5rem 1rem", background:"red", color:"white", border:"none", borderRadius:"6px"}}>
            🔄 Reset Weekly Competition
          </button>
        )}
      </div>
    </div>
  );
}
