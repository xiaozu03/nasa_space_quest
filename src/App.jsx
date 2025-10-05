import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Replace these with your real assets placed in /public or served URLs
const ASSETS = {
  cupolaPanorama: "/panorama-placeholder.jpg", // 1:3 panoramic image (e.g., 3000x1000)
  diverSprite: null, // optional, or use simple shape
  toolSprite: null,
};

// ---------- Utility helpers ----------
const saveProgress = (state) => {
  localStorage.setItem("astronaut_journey_progress", JSON.stringify(state));
};
const loadProgress = () => {
  try {
    const s = localStorage.getItem("astronaut_journey_progress");
    return s ? JSON.parse(s) : { missions: { 1: false, 2: false, 3: false } };
  } catch (e) {
    return { missions: { 1: false, 2: false, 3: false } };
  }
};

// Vocabulary glossary data structure


// ---------- Styles ----------
const styles = {
  app: {
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    background: "linear-gradient(180deg,#071428 0%, #071b2a 100%)",
    color: "#e6f0ff",
    minHeight: "100vh",
    padding: "24px",
    boxSizing: "border-box",
  },
  container: { maxWidth: 1100, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginTop: 18 },
  card: { background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 12, boxShadow: "0 4px 18px rgba(0,0,0,0.5)" },
  button: { background: "#2b6ef6", color: "white", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer" },
  ghost: { background: "transparent", border: "1px solid rgba(255,255,255,0.08)", padding: "8px 12px", borderRadius: 8, color: "#cfe6ff" },
  small: { fontSize: 13, color: "#bcd6ff" },
};



// ---------- Core App ----------
export default function App() {
  const [progress, setProgress] = useState(loadProgress());
  const [view, setView] = useState("grand-intro");
  const [activeMission, setActiveMission] = useState(null);

  useEffect(() => saveProgress(progress), [progress]);

  // Gate: require watching intro videos before continuing
  const [mission1CanContinue, setMission1CanContinue] = useState(false);
  const [mission2CanContinue, setMission2CanContinue] = useState(false);

  // Global gate: show grand intro video first; press Enter to proceed to dashboard
  useEffect(() => {
    if (view !== 'grand-intro') return;
    const handleEnter = (e) => {
      if (e.key === 'Enter') {
        setView('dashboard');
      }
    };
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, [view]);

  const startMission = (id) => {
    setActiveMission(id);
    if (id === 1) {
      setMission1CanContinue(false);
      setView('mission-1-intro');
    } else if (id === 2) {
      setMission2CanContinue(false);
      setView('mission-2-intro');
    } else {
      setView('mission-3');
    }
  };

  const completeMission = (id) => {
    setProgress((p) => {
      const updated = { ...p, missions: { ...p.missions, [id]: true } };
      saveProgress(updated);
      return updated;
    });
    setView("dashboard");
    setActiveMission(null);
  };

  const resetProgress = () => {
    const initial = { missions: { 1: false, 2: false, 3: false } };
    setProgress(initial);
    saveProgress(initial);
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28 }}>🚀 NASA Space Quest — Trainee to Astronaut</h1>
            <div style={{ marginTop: 6 }}>
              <span style={styles.small}>Progress: </span>
              <strong>{Object.values(progress.missions).filter(Boolean).length} / 3 missions completed</strong>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button style={styles.ghost} onClick={() => setView("dashboard")}>Home</button>
            <button style={styles.ghost} onClick={() => setView("gallery")}>Gallery</button>
            <button style={styles.ghost} onClick={resetProgress}>Reset</button>
          </div>
        </div>

        {view === "grand-intro" && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(120% 120% at 50% 0%, #12274e 0%, #071428 55%, #060f1f 100%)', animation: 'overlayFadeIn 0.6s ease forwards' }}>
             <style>{`@keyframes overlayFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } } @keyframes textFadeIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
             <div style={{ textAlign: 'center', padding: '0 24px', animation: 'textFadeIn 0.8s ease forwards', animationDelay: '0.3s' }}>
               <div style={{ fontSize: 24, color: '#bcd6ff', letterSpacing: 2, marginBottom: 8 }}>Welcome to</div>
               <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 6 }}>NASA SPACE QUEST</div>
               <div style={{ fontSize: 18, color: '#cfe6ff', marginBottom: 16 }}>LEARN ABOUT EARTH AND SPACE</div>
               <div style={{ fontSize: 14, color: '#8fb7ff', letterSpacing: 1 }}>PRESS ENTER TO START</div>
             </div>
           </div>
        )}

        {view === "dashboard" && (
          <div>
            <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
                  <video 
                    src="/welcoming.mov" 
                    autoPlay 
                    loop 
                    style={{ 
                      width: "100%", 
                      height: "200px", 
                      objectFit: "cover",
                      borderRadius: "12px"
                    }}
                  />
                  <div style={{ padding: "16px" }}>
                    <div style={{ fontWeight: 700 }}>Welcome to NASA Space Quest</div>
                    <div style={styles.small}>Your astronaut training journey begins here</div>
                    <div style={{ marginTop: 8 }}>
                      <progress value={Object.values(progress.missions).filter(Boolean).length} max={3} style={{ width: "100%" }} />
                      <div style={{ ...styles.small, marginTop: 4 }}>
                        Progress: {Object.values(progress.missions).filter(Boolean).length}/3 missions completed
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ width: 360 }}>
                <div style={styles.card}>
                  <div style={{ fontWeight: 700 }}>Mission</div>
                  <div style={{ marginTop: 8 }}>
                    <MissionList progress={progress} onStart={startMission} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...styles.cardGrid, marginTop: 32 }}>
              <div style={styles.card}>
                <h3>About the Experience</h3>
                <p style={styles.small}>A short interactive journey that demonstrates two key sensory experiences in low Earth orbit: sight (through the Cupola) and weightlessness. Complete missions to graduate as an Astronaut Trainee.</p>
                <ul style={{ marginTop: 8 }}>
                  <li style={styles.small}>Mission 1: NBL — neutral buoyancy training</li>
                  <li style={styles.small}>Mission 2: Microgravity — floating/object handling</li>
                  <li style={styles.small}>Mission 3: Cupola — observe and collect climate-change observation points</li>
                </ul>
              </div>


            </div>

            {/* Rewards section moved down */}
            <div style={{ ...styles.cardGrid, marginTop: 32 }}>
              <div style={styles.card}>
                <h3>Rewards</h3>
                <p style={styles.small}>Collect mission patches and download your trainee certificate after finishing all missions.</p>
                <div style={{ marginTop: 10 }}>
                  <button style={styles.button} onClick={() => { if (Object.values(progress.missions).every(Boolean)) { generateCertificate(); } else alert('Finish all missions first.'); }}>Download Certificate</button>
                </div>
              </div>
            </div>

            {/* Dev/Teacher Notes section removed */}
          </div>
        )}

        {/* Mission 1 Intro Video Gate */}
        {view === "mission-1-intro" && (
          <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
            <video 
              src="/mission1.mp4" 
              controls 
              style={{ width: '100%', aspectRatio: '16 / 9', height: 'auto', objectFit: 'contain', display: 'block' }}
              onEnded={() => setMission1CanContinue(true)}
            />
            <div style={{ padding: 16, display: 'flex', gap: 8 }}>
              <button style={{ ...styles.button, opacity: mission1CanContinue ? 1 : 0.6, cursor: mission1CanContinue ? 'pointer' : 'not-allowed' }} disabled={!mission1CanContinue} onClick={() => setView('mission-1')}>Continue to Mission 1</button>
              <button style={styles.ghost} onClick={() => setView('mission-1')}>Skip video</button>
              <button style={styles.ghost} onClick={() => { setActiveMission(null); setView('dashboard'); }}>Back to Dashboard</button>
            </div>
          </div>
        )}

        {/* Mission 2 Intro Video Gate */}
        {view === "mission-2-intro" && (
          <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
            <video 
              src="/mission2.mp4" 
              controls 
              style={{ width: '100%', aspectRatio: '16 / 9', height: 'auto', objectFit: 'contain', display: 'block' }}
              onEnded={() => setMission2CanContinue(true)}
            />
            <div style={{ padding: 16, display: 'flex', gap: 8 }}>
              <button style={{ ...styles.button, opacity: mission2CanContinue ? 1 : 0.6, cursor: mission2CanContinue ? 'pointer' : 'not-allowed' }} disabled={!mission2CanContinue} onClick={() => setView('mission-2')}>Continue to Mission 2</button>
              <button style={styles.ghost} onClick={() => setView('mission-2')}>Skip video</button>
              <button style={styles.ghost} onClick={() => { setActiveMission(null); setView('dashboard'); }}>Back to Dashboard</button>
            </div>
          </div>
        )}

        {view === "mission-1" && (
          <Mission1 onComplete={() => completeMission(1)} onBack={() => setView('dashboard')} />
        )}
        {view === "mission-2" && (
          <Mission2 onComplete={() => completeMission(2)} onBack={() => setView('dashboard')} />
        )}
        {view === "mission-3" && (
          <Mission3 onComplete={() => completeMission(3)} onBack={() => setView('dashboard')} />
        )}

        {view === "gallery" && (
          <Gallery onBack={() => setView('dashboard')} />
        )}

      </div>
    </div>
  );
}

function MissionList({ progress, onStart }) {
  const missions = [
    { id: 1, name: "Neutral Buoyancy Lab (NBL)", desc: "Practice hatch operations and equipment repairs in simulated microgravity." },
    { id: 2, name: "Microgravity Repair", desc: "Move along station handles and complete critical repairs in weightless environment." },
    { id: 3, name: "Cupola Observation", desc: "Use the Cupola to collect manual climate observations and watch EVA operations." },
  ];
  return (
    <div>
      {missions.map(m => (
        <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div>
            <div style={{ fontWeight: 600 }}>{m.name}</div>
            <div style={styles.small}>{m.desc}</div>
          </div>
          <div>
            <button style={{ ...styles.button, opacity: progress.missions[m.id] ? 0.6 : 1 }} onClick={() => onStart(m.id)}>{progress.missions[m.id] ? 'Replay' : 'Start'}</button>
          </div>
        </div>
      ))}
    </div>
  );
}



function Mission1({ onComplete, onBack }) {
  const canvasRef = useRef(null);
  const [message, setMessage] = useState('Enter the hatch, complete repair tasks, and exit through the airlock. Use arrow keys or WASD to move.');
  const diver = useRef({ x: 200, y: 180, vx: 0, vy: 0 });
  const zones = useRef([
    { x: 420, y: 160, r: 40, completed: false, holdTime: 0, type: 'hatch', label: 'Hatch Entry' },
    { x: 200, y: 280, r: 40, completed: false, holdTime: 0, type: 'repair', label: 'Panel Repair' },
    { x: 600, y: 280, r: 40, completed: false, holdTime: 0, type: 'repair', label: 'Bolt Tighten' },
    { x: 300, y: 120, r: 40, completed: false, holdTime: 0, type: 'repair', label: 'Cable Check' },
    { x: 540, y: 120, r: 40, completed: false, holdTime: 0, type: 'repair', label: 'Sensor Cal' },
    { x: 400, y: 320, r: 40, completed: false, holdTime: 0, type: 'hatch', label: 'Airlock Exit' }
  ]);
  const keys = useRef({});
  const raf = useRef(null);
  // astronaut image ref for Mission 1 sprite rendering
  const astroImgRef = useRef(null);
  const [currentTask, setCurrentTask] = useState('Approach the hatch to begin');
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  // Sound effects
  const hissSoundRef = useRef(null);
  const clankSoundRef = useRef(null);
  const lastHissTimeRef = useRef(0);
  // Bubble particles for underwater effect
  const bubblesRef = useRef([]);
  const lastBubbleTimeRef = useRef(0);
  const missionInsights = {
  'Hatch Entry': 'Did you know? ISS hatches are designed to be operated with one hand for efficiency during spacewalks!',
  'Panel Repair': 'Insight: The ISS has eight solar array wings that generate power equivalent to that used by 40 homes on Earth!',
  'Bolt Tighten': 'Interesting: In zero gravity, astronauts use specialized tools to prevent bolts from floating away during repairs!',
  'Cable Check': 'Did you know? The ISS has over 8 miles of wire connecting its electrical systems!',
  'Sensor Cal': 'Insight: Sensors on the ISS continuously monitor radiation levels to keep astronauts safe!',
  'Airlock Exit': 'Cool: The Quest airlock on the ISS is used for U.S. spacewalks and can support two astronauts at once!'
};

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    canvas.width = 800 * DPR;
    canvas.height = 420 * DPR;
    canvas.style.width = '800px';
    canvas.style.height = '420px';
    ctx.scale(DPR, DPR);

    // preload astronaut image once
    if (!astroImgRef.current) {
      const img = new Image();
      img.src = '/astronaut.svg';
      img.onload = () => { astroImgRef.current = img; };
      img.onerror = () => { console.warn('Failed to load /astronaut.svg, falling back to shape.'); };
    }

    // preload sound effects
    if (!hissSoundRef.current) {
      hissSoundRef.current = new Audio('/hiss.mp3');
      hissSoundRef.current.volume = 0.3;
    }
    if (!clankSoundRef.current) {
      clankSoundRef.current = new Audio('/clank.mp3');
      clankSoundRef.current.volume = 0.4;
    }

    function physTick(dt) {
      const d = diver.current;
      // enhanced neutral buoyancy physics with stronger upward drift
      const buoyancy = 30; // stronger upward buoyant force
      const mass = 1.0;
      const drag = 0.92; // slightly less drag for smoother movement
      const thrustPower = 130; // stronger acceleration when pressing
      const passiveDrift = 12; // passive upward drift when not controlling

      // Check if any thrusters are active
      const isControlling = (keys.current.ArrowLeft || keys.current.a) || (keys.current.ArrowRight || keys.current.d) || 
                          (keys.current.ArrowUp || keys.current.w) || (keys.current.ArrowDown || keys.current.s);

      // Play hiss sound when thrusters are active (with cooldown)
      if (isControlling && hissSoundRef.current && performance.now() - lastHissTimeRef.current > 300) {
        hissSoundRef.current.currentTime = 0;
        hissSoundRef.current.play().catch(() => {});
        lastHissTimeRef.current = performance.now();
      }

      // Generate bubbles when moving (based on speed and direction)
      const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
      const now = performance.now();
      if (speed > 20 && now - lastBubbleTimeRef.current > 100) {
        const bubbleCount = Math.floor(speed / 15);
        for (let i = 0; i < bubbleCount; i++) {
          const angle = Math.atan2(d.vy, d.vx) + (Math.random() - 0.5) * 0.5;
          const offsetX = (Math.random() - 0.5) * 15;
          const offsetY = (Math.random() - 0.5) * 15;
          bubblesRef.current.push({
            x: d.x + offsetX,
            y: d.y + offsetY,
            vx: Math.cos(angle) * (20 + Math.random() * 30),
            vy: Math.sin(angle) * (20 + Math.random() * 30) - 40, // upward bias
            size: 2 + Math.random() * 4,
            opacity: 0.6 + Math.random() * 0.4,
            life: 1.0
          });
        }
        lastBubbleTimeRef.current = now;
      }

      // Update existing bubbles
      bubblesRef.current = bubblesRef.current.filter(bubble => {
        bubble.x += bubble.vx * dt;
        bubble.y += bubble.vy * dt;
        bubble.life -= dt * 0.5;
        return bubble.life > 0 && bubble.y > 0;
      });

      if (keys.current.ArrowLeft || keys.current.a) d.vx -= thrustPower * dt;
      if (keys.current.ArrowRight || keys.current.d) d.vx += thrustPower * dt;
      if (keys.current.ArrowUp || keys.current.w) d.vy -= thrustPower * dt;
      if (keys.current.ArrowDown || keys.current.s) d.vy += thrustPower * dt;

      // buoyancy acts upwards constantly
      d.vy += (buoyancy / mass) * dt;

      // passive upward drift when not actively controlling
      if (!isControlling && Math.abs(d.vy) < 20) {
        d.vy -= passiveDrift * dt;
      }

      // apply drag
      d.vx *= Math.pow(drag, dt * 60);
      d.vy *= Math.pow(drag, dt * 60);

      d.x += d.vx * dt;
      d.y += d.vy * dt;

      // clamp
      d.x = Math.max(20, Math.min(780, d.x));
      d.y = Math.max(20, Math.min(380, d.y));
    }

    let last = performance.now();
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      physTick(dt);
      draw();
      raf.current = requestAnimationFrame(loop);
    }

    function draw() {
      ctx.clearRect(0, 0, 800, 420);
      // background water gradient
      const g = ctx.createLinearGradient(0, 0, 0, 420);
      g.addColorStop(0, '#64b5ff');
      g.addColorStop(1, '#0b3d5b');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 800, 420);

      // pool edges / depth markers
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(0, 360, 800, 60);

      // Draw bubbles
      bubblesRef.current.forEach(bubble => {
        ctx.save();
        ctx.globalAlpha = bubble.opacity * bubble.life;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fill();
        // Add a highlight to make bubbles more realistic
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // draw all zones with different visuals for hatch vs repair
      zones.current.forEach((zone, index) => {
        // Different colors for hatch vs repair zones
        const isHatch = zone.type === 'hatch';
        const fillColor = zone.completed ? 
          (isHatch ? 'rgba(20,180,220,0.4)' : 'rgba(20,220,120,0.4)') : 
          (isHatch ? 'rgba(20,180,220,0.15)' : 'rgba(20,220,120,0.15)');
        const strokeColor = zone.completed ? 
          (isHatch ? 'rgba(20,180,220,1)' : 'rgba(20,220,120,1)') : 
          (isHatch ? 'rgba(20,180,220,0.8)' : 'rgba(20,220,120,0.8)');
        
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.arc(zone.x, zone.y, zone.r + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.arc(zone.x, zone.y, zone.r, 0, Math.PI * 2);
        ctx.stroke();
        
        // zone label and icon
        ctx.fillStyle = '#fff';
        ctx.font = '12px Inter, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(zone.label, zone.x, zone.y - 15);
        
        // zone icon
        ctx.font = '16px Arial';
        ctx.fillText(isHatch ? '🚪' : '🔧', zone.x, zone.y + 5);
      });

      // diver (render astronaut.svg sprite if available)
      const d = diver.current;
      const img = astroImgRef.current;
      
      if (img) {
        const angle = Math.atan2(d.vy, d.vx); // rotate slightly in motion direction
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(angle * 0.2); // subtle rotation
        const w = 42, h = 54; // sprite render size
        ctx.globalAlpha = 0.98;
        ctx.drawImage(img, -w/2, -h/2, w, h);
        ctx.restore();
      } else {
        // fallback simple ellipse diver
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.95;
        ctx.ellipse(0, 0, 20, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        // visor
        ctx.beginPath();
        ctx.fillStyle = '#0b4b7a';
        ctx.ellipse(0, -3, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Single unified instruction box with better layout
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(8, 8, 400, 90);
      ctx.fillStyle = '#dbeeff';
      ctx.font = '12px Inter, Arial';
      
      // Current task (top line)
      ctx.fillText('Current Task: ' + currentTask, 16, 26);
      
      // Mission objective (middle line)
      ctx.fillText('NBL Training: Complete hatch operations and equipment repairs', 16, 44);
      
      // Controls (third line)
      ctx.fillText('Controls: Arrow keys or WASD for thrusters (gentle taps recommended)', 16, 62);
      
      // Progress (bottom line)
      const completedCount = zones.current.filter(z => z.completed).length;
      ctx.fillStyle = '#a8d5ff';
      ctx.fillText(`Progress: ${completedCount} / 6 zones completed`, 16, 80);

      // zone tracking logic with task-specific feedback
      zones.current.forEach(zone => {
        const dist = Math.hypot(d.x - zone.x, d.y - zone.y);
        if (dist < zone.r) {
          zone.holdTime += 1 / 60; // assuming 60fps
          if (zone.holdTime >= 5 && !zone.completed) {
            zone.completed = true;
            // Play clank sound for task completion
            if (clankSoundRef.current) {
              clankSoundRef.current.currentTime = 0;
              clankSoundRef.current.play().catch(() => {});
            }
            // Task-specific completion messages
            if (zone.type === 'hatch') {
              setCurrentTask(zone.label === 'Hatch Entry' ? 'Hatch secured! Proceed to repair tasks.' : 'Airlock sealed! Mission complete.');
            } else {
              setCurrentTask(`${zone.label} completed! Move to next task.`);
            }
            setPopupContent(missionInsights[zone.label]);
            setShowPopup(true);
          }
        } else {
          zone.holdTime = Math.max(0, zone.holdTime - 1 / 30);
        }
      });

      // success message
      if (completedCount === 6) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = '28px Inter, Arial';
        ctx.fillText('Mission Complete!', 300, 200);
      }
    }

    raf.current = requestAnimationFrame(loop);

    function onKey(e){
      if (e.type === 'keydown') keys.current[e.key] = true;
      if (e.type === 'keyup') keys.current[e.key] = false;
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.type === 'keydown') keys.current[e.key] = true;
      if (e.type === 'keyup') keys.current[e.key] = false;
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, []);

  // poll for completion
  useEffect(() => {
    const id = setInterval(() => {
      const completedCount = zones.current.filter(z => z.completed).length;
      if (completedCount === 6) {
        setMessage('Excellent! You completed all 6 target zones. Click Complete to record mission success.');
      } else if (completedCount > 0) {
        setMessage(`Good progress! ${completedCount} of 6 zones completed. Keep going!`);
      }
    }, 300);
    return () => clearInterval(id);
  }, []);

// auto-close popup after 5 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, ...styles.card }}>
          <h2>Mission 1 — NBL Training</h2>
          <p style={styles.small}>{message}</p>
          <div style={{ position: 'relative', marginTop: 12, borderRadius: 8, overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
            {showPopup && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,40,70,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                <div style={{ background: 'linear-gradient(180deg, rgba(8,53,91,0.95), rgba(20,130,180,0.85))', padding: 20, borderRadius: 12, maxWidth: 340, textAlign: 'center', border: '1px solid rgba(180,230,255,0.35)', boxShadow: '0 8px 24px rgba(8,40,70,0.5)', color: '#dbeeff' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a8e7ff' }}>Mission Insight</h3>
                  <p style={{ margin: '0 0 12px 0', lineHeight: 1.5 }}>{popupContent}</p>
                  <button aria-label="Close mission insight" style={{ ...styles.button, backgroundColor: '#1e88e5', border: '1px solid rgba(180,230,255,0.4)' }} onClick={() => setShowPopup(false)}>Got it!</button>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button style={styles.button} onClick={() => { 
              const completedCount = zones.current.filter(z => z.completed).length;
              if (completedCount === 6) onComplete(); 
              else alert(`Complete all zones first. You have ${completedCount} of 6 zones completed.`); 
            }}>Complete Mission</button>
            <button style={styles.ghost} onClick={onBack}>Back</button>
          </div>
        </div>
        <div style={{ width: 340, minWidth: 340 }}>
          <div style={{ ...styles.card, marginBottom: 16 }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Current Task</h3>
            <div style={{ ...styles.small, background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', lineHeight: '1.4' }}>
              {currentTask}
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={{ margin: '0 0 12px 0' }}>Teaching points</h3>
            <ul style={{ ...styles.small, paddingLeft: '18px', margin: 0, lineHeight: '1.5' }}>
              <li style={{ marginBottom: '8px' }}>Hatch operations require precise control - astronauts practice opening, entering, and sealing hatches.</li>
              <li style={{ marginBottom: '8px' }}>Equipment repairs in microgravity teach careful tool handling and problem-solving under pressure.</li>
              <li style={{ marginBottom: '8px' }}>Neutral buoyancy simulates weightlessness for EVA (spacewalk) training and emergency procedure practice.</li>
              <li>Earth benefit: underwater training techniques improve deep-sea rescue operations and submarine maintenance.</li>
            </ul>
          </div>

          <div style={{ ...styles.card, marginTop: 16 }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Controls</h3>
            <div style={{ ...styles.small, lineHeight: '1.5' }}>Arrow keys or WASD — thrust small impulses. Be gentle: too much force makes stabilization harder, just like real life.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Mission 2: Microgravity handling ----------
function Mission2({ onComplete, onBack }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('Move along handles to reach tools. Complete repairs by stabilizing tools in docking zones.');
  const objs = useRef([ 
    {x:200,y:140,vx:20,vy:-10, id:1, type: 'tool', label: 'Wrench'},
    {x:320,y:240,vx:5,vy:5, id:2, type: 'tool', label: 'Multimeter'},
    {x:460,y:120,vx:-8,vy:8, id:3, type: 'tool', label: 'Torque Driver'}
  ]);
  const zones = useRef([ 
    {x:120,y:330,r:40,hold:0, type: 'repair', label: 'Panel A'},
    {x:400,y:330,r:40,hold:0, type: 'repair', label: 'Circuit B'},
    {x:680,y:330,r:40,hold:0, type: 'repair', label: 'Bolt C'}
  ]);
  const handles = useRef([
    {x: 100, y: 100, length: 200, angle: 0},
    {x: 300, y: 80, length: 150, angle: 45},
    {x: 500, y: 120, length: 180, angle: -30},
    {x: 200, y: 250, length: 120, angle: 90},
    {x: 400, y: 280, length: 160, angle: -45}
  ]);
  const dragState = useRef({ dragging: false, id: null, ox:0, oy:0 });
  const raf = useRef(null);
  const [showEduPopup, setShowEduPopup] = useState(false);
  const eduShownRef = useRef(false);
  // Sound effects
  const whooshSoundRef = useRef(null);
  const chimeSoundRef = useRef(null);
  const lastWhooshTimeRef = useRef(0);
  const eduFacts = [
    'Space communications power telemedicine, precision navigation, and disaster coordination—saving lives and connecting communities.',
    'Robotics and remote operations developed for the ISS improve surgical tools, industrial automation, and safer work in hazardous environments.',
    'Earth‑observation satellites enhance weather forecasts, wildfire tracking, crop planning, and emergency response across continents.',
    'Microgravity research advances fluid and material science, informing cleaner fuels, efficient 3D printing, and targeted drug delivery systems.',
    'EVA training and safety protocols shape standards for underwater rescue, offshore maintenance, and other high‑risk professions.'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    canvas.width = 780 * DPR;
    canvas.height = 420 * DPR;
    canvas.style.width = '780px';
    canvas.style.height = '420px';
    ctx.scale(DPR, DPR);

    // preload sound effects
    if (!whooshSoundRef.current) {
      whooshSoundRef.current = new Audio('/whoosh.mp3');
      whooshSoundRef.current.volume = 0.3;
    }
    if (!chimeSoundRef.current) {
      chimeSoundRef.current = new Audio('/chime.mp3');
      chimeSoundRef.current.volume = 0.4;
    }

    function update(dt) {
      // microgravity: objects drift with low damping
      for (let o of objs.current) {
        o.x += o.vx * dt;
        o.y += o.vy * dt;
        // tiny collisions with walls
        if (o.x < 20 || o.x > 760) o.vx *= -1;
        if (o.y < 20 || o.y > 380) o.vy *= -1;
        // slight damping
        o.vx *= Math.pow(0.999, dt * 60);
        o.vy *= Math.pow(0.999, dt * 60);
      }

      // zone holding logic
      for (let i=0;i<zones.current.length;i++){
        const z = zones.current[i];
        const o = objs.current[i];
        const dist = Math.hypot(o.x - z.x, o.y - z.y);
        const prevHold = z.hold;
        if (dist < z.r) z.hold = Math.min(6, z.hold + dt); else z.hold = Math.max(0, z.hold - dt/2);
        
        // Play chime sound when a zone reaches 6 seconds (successful lock)
        if (prevHold < 6 && z.hold >= 6 && chimeSoundRef.current) {
          chimeSoundRef.current.currentTime = 0;
          chimeSoundRef.current.play().catch(() => {});
        }
      }
    }

    function draw() {
      ctx.clearRect(0,0,780,420);
      // background - space station interior
      const g = ctx.createLinearGradient(0,0,0,420);
      g.addColorStop(0, '#1a2b47');
      g.addColorStop(1, '#0d1a2a');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,780,420);

      // draw handles (station handrails)
      for (let h of handles.current){
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(200,200,220,0.8)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        const endX = h.x + Math.cos(h.angle * Math.PI/180) * h.length;
        const endY = h.y + Math.sin(h.angle * Math.PI/180) * h.length;
        ctx.moveTo(h.x, h.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // handle mounts
        ctx.beginPath();
        ctx.fillStyle = 'rgba(150,150,170,0.9)';
        ctx.arc(h.x, h.y, 6, 0, Math.PI*2);
        ctx.arc(endX, endY, 6, 0, Math.PI*2);
        ctx.fill();
      }

      // draw repair zones with labels
      for (let z of zones.current){
        ctx.beginPath(); 
        ctx.fillStyle = 'rgba(20,220,120,0.12)'; 
        ctx.arc(z.x,z.y,z.r+6,0,Math.PI*2); 
        ctx.fill();
        ctx.beginPath(); 
        ctx.strokeStyle = 'rgba(20,220,120,0.9)'; 
        ctx.lineWidth=3; 
        ctx.arc(z.x,z.y,z.r,0,Math.PI*2); 
        ctx.stroke();
        
        ctx.fillStyle='#ffffff'; 
        ctx.font='12px Inter, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(z.label, z.x, z.y - 20);
        ctx.fillText(`${z.hold.toFixed(1)} / 6s`, z.x, z.y + 4);
      }

      // draw tools with labels and icons
      for (let o of objs.current){
        // choose icon and color by tool type
        let icon = '🧰';
        let bodyColor = 'rgba(200,200,220,0.9)';
        switch (o.label) {
          case 'Wrench':
            icon = '🔧';
            bodyColor = 'rgba(180,190,200,0.95)';
            break;
          case 'Multimeter':
            icon = '📟';
            bodyColor = 'rgba(255,190,80,0.95)';
            break;
          case 'Torque Driver':
            icon = '🪛';
            bodyColor = 'rgba(150,200,255,0.95)';
            break;
        }

        // circular badge behind icon
        ctx.beginPath();
        ctx.fillStyle = bodyColor;
        ctx.arc(o.x, o.y, 16, 0, Math.PI*2);
        ctx.fill();

        // icon glyph
        ctx.fillStyle = '#0b1e33';
        ctx.font = '18px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, o.x, o.y);
        
        // Tool label
        ctx.fillStyle='#ffffff'; 
        ctx.font='11px Inter, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(o.label, o.x, o.y - 20);
      }

      // instructions
      ctx.fillStyle='rgba(0,0,0,0.4)'; 
      ctx.fillRect(8,8,400,70);
      ctx.fillStyle='#dbeeff'; 
      ctx.font='12px Inter, Arial'; 
      ctx.fillText('Microgravity Repair: Use handles to move, drag tools to repair stations',16,28);
      ctx.fillText('Complete all 3 repairs: Panel A, Circuit B, Bolt C',16,46);
      ctx.fillText('Click and drag tools gently - too much force makes them drift!',16,64);

      // success check
      const success = zones.current.every(z => z.hold >= 6);
      if (success){
        ctx.fillStyle='rgba(255,255,255,0.95)'; 
        ctx.font='26px Inter, Arial'; 
        ctx.fillText('Repairs Complete!', 300, 200);
        if (!eduShownRef.current) {
          eduShownRef.current = true;
          setTimeout(() => setShowEduPopup(true), 300);
        }
      }
    }

    let last = performance.now();
    function loop(now){
      const dt = Math.min(0.05,(now-last)/1000);
      last = now;
      update(dt);
      draw();
      raf.current = requestAnimationFrame(loop);
    }
    raf.current = requestAnimationFrame(loop);

    return ()=> cancelAnimationFrame(raf.current);
  }, []);

  // mouse interactions
  useEffect(()=>{
    const c = canvasRef.current;
    function getPos(e){
      const rect = c.getBoundingClientRect();
      return { x: (e.clientX - rect.left), y: (e.clientY - rect.top) };
    }
    function mdown(e){
      const p = getPos(e);
      for (let o of objs.current){
        if (Math.abs(p.x - o.x) < 20 && Math.abs(p.y - o.y) < 20){
          dragState.current.dragging = true; dragState.current.id = o.id; dragState.current.ox = p.x - o.x; dragState.current.oy = p.y - o.y; break;
        }
      }
    }
    function mmove(e){
      if (!dragState.current.dragging) return;
      const p = getPos(e);
      const id = dragState.current.id;
      const o = objs.current.find(x=>x.id===id);
      if (!o) return;
      const nx = p.x - dragState.current.ox;
      const ny = p.y - dragState.current.oy;
      
      // Play whoosh sound when dragging tools (with cooldown)
      if (whooshSoundRef.current && performance.now() - lastWhooshTimeRef.current > 500) {
        whooshSoundRef.current.currentTime = 0;
        whooshSoundRef.current.play().catch(() => {});
        lastWhooshTimeRef.current = performance.now();
      }
      
      // set small velocity toward pointer to emulate gentle push
      o.vx += (nx - o.x) * 3e-3;
      o.vy += (ny - o.y) * 3e-3;
      o.x = nx; o.y = ny;
    }
    function mup(){
      dragState.current.dragging = false; dragState.current.id = null;
    }
    c.addEventListener('mousedown', mdown);
    window.addEventListener('mousemove', mmove);
    window.addEventListener('mouseup', mup);
    return ()=>{
      c.removeEventListener('mousedown', mdown);
      window.removeEventListener('mousemove', mmove);
      window.removeEventListener('mouseup', mup);
    };
  }, []);

  // polling check for completion
  useEffect(()=>{
    const id = setInterval(()=>{
      if (zones.current.every(z=>z.hold>=6)){
        setStatus('Stabilized! Click Complete to record mission success.');
      }
    },300);
    return ()=>clearInterval(id);
  },[]);

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, ...styles.card }}>
          <h2>Mission 2 — Microgravity Handling</h2>
          <p style={styles.small}>{status}</p>
          <div style={{ position: 'relative', marginTop: 12, borderRadius: 8, overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
            {showEduPopup && (
              <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, background:'rgba(15,25,40,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}>
                <div style={{ background:'linear-gradient(180deg, rgba(22,40,70,0.98), rgba(40,120,160,0.88))', color:'#dbeeff', padding:24, borderRadius:14, maxWidth:560, boxShadow:'0 10px 28px rgba(0,0,0,0.6)', border:'1px solid rgba(180,230,255,0.3)' }}>
                  <h3 id="mission2-debrief-title" style={{ margin:'0 0 10px 0', color:'#a8e7ff' }}>Mission Debrief: Space Benefits for Humanity</h3>
                  <ul style={{ margin:0, paddingLeft:20, lineHeight:1.5 }}>
                    {eduFacts.map((f, i) => (<li key={i} style={{ marginBottom:8 }}>{f}</li>))}
                  </ul>
                  <div style={{ marginTop:14, display:'flex', gap:8, justifyContent:'flex-end' }}>
                    <button aria-label="Close debrief" style={{ ...styles.ghost }} onClick={()=> setShowEduPopup(false)}>Close</button>
                    <button aria-label="Record Mission 2 completion" style={{ ...styles.button }} onClick={()=>{ setShowEduPopup(false); onComplete(); }}>Record Completion</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button style={styles.button} onClick={()=>{ if (zones.current.every(z=>z.hold>=6)) onComplete(); else alert('Stabilize all objects first.') }}>Complete Mission</button>
            <button style={styles.ghost} onClick={onBack}>Back</button>
          </div>
        </div>
        <div style={{ width: 320 }}>
          <div style={styles.card}>
            <h3>Teaching points</h3>
            <ul style={styles.small}>
              <li>Handles and handrails are essential for astronaut movement in microgravity - no walking in space!</li>
              <li>Tool management is critical - loose tools become dangerous projectiles in the station.</li>
              <li>Repair procedures require planning - astronauts use checklists and work in teams for complex tasks.</li>
              <li>Microgravity research benefits Earth medicine, materials science, and fluid dynamics.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Mission 3: ISS Observation Experience ----------
function Mission3({ onComplete, onBack }) {
  const [viewState, setViewState] = useState('iss-model'); // 'iss-model', 'cupola', 'world-map', 'region-photo'
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [message, setMessage] = useState('Click the ISS model to explore different observation points from space.');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResponses, setQuizResponses] = useState({ areaOfStudy: '', dataPurpose: '', earthBenefit: '' });
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  // Background music
  const galaxySoundRef = useRef(null);

  // Initialize and play galaxy background music with better autoplay handling
  const playOnInteraction = useCallback(() => {
    if (galaxySoundRef.current) {
      galaxySoundRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!galaxySoundRef.current) {
      galaxySoundRef.current = new Audio('/galaxy.mp3');
      galaxySoundRef.current.volume = 0.4;
      galaxySoundRef.current.loop = true;
      
      // Try to play immediately, but handle autoplay restrictions
      const tryPlay = () => {
        galaxySoundRef.current.play().catch(error => {
          console.log('Audio autoplay blocked, will play on user interaction:', error);
          // Add event listener to play on first user interaction
          document.addEventListener('click', playOnInteraction, { once: true });
        });
      };
      
      tryPlay();
    }
    
    // Cleanup function to stop music when component unmounts
    return () => {
      if (galaxySoundRef.current) {
        galaxySoundRef.current.pause();
        galaxySoundRef.current.currentTime = 0;
        document.removeEventListener('click', playOnInteraction);
      }
    };
  }, [playOnInteraction]);

  // ISS 3D Model Component
  function ISSModel() {
    const { scene } = useGLTF('/ISS_stationary.glb');
    return <primitive object={scene} scale={0.2} position={[0, 0, 0]} />;
  }

  // Cupola 3D Model Component
  function CupolaModel() {
    const { scene } = useGLTF('/cupola.glb');
    return <primitive object={scene} scale={0.2} position={[0, 0, 0]} />;
  }

  // Earth 3D Model Component with region markers (using earth.glb)
  function EarthModel({ onRegionSelect, regions }) {
    const { scene } = useGLTF('/earth.glb');
    
    return (
      <>
        {/* Earth 3D model */}
        <primitive object={scene} scale={1.75} position={[0, 0, 0]} />
        
        {/* Region markers */}
        {regions.map((region) => (
          <mesh
            key={region.id}
            position={[region.coordinates.x, region.coordinates.y, region.coordinates.z]}
            onClick={() => onRegionSelect(region)}
            onPointerEnter={() => setMessage(`Click to view ${region.name} photos`)}
            onPointerLeave={() => setMessage('Select a region to view real NASA photos taken from the ISS.')}
          >
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={1.0} />
          </mesh>
        ))}
        
        {/* Enhanced Lights for better Earth visibility */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={0.8} color="#4466cc" />
        <pointLight position={[0, 15, 0]} intensity={0.5} distance={20} />
      </>
    );
  }
  
  // Regions with real NASA photo descriptions (replace paths with your actual assets)
  // Function to convert geographic coordinates to 3D Cartesian coordinates
  const geographicToCartesian = (latitude, longitude, radius = 2.02) => {
    // Convert degrees to radians
    const latRad = latitude * Math.PI / 180;
    const lonRad = longitude * Math.PI / 180;
    
    // Proper spherical to Cartesian conversion for Three.js (Y-up)
    // Latitude: -90° (South Pole) to +90° (North Pole)
    // Longitude: -180° (West) to +180° (East)
    const x = radius * Math.cos(latRad) * Math.sin(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.cos(lonRad);
    
    return { x, y, z };
  };

  const regions = [
    {
      id: 'amazon',
      name: 'Amazon Rainforest',
      description: 'Confluence of the Amazon and Topajos Rivers, Brazil, South America',
      photo: '/amazon.jpg',
      // Central Amazon coordinates: -3.4653° S, -62.2159° W
      geographic: { latitude: -3.4653, longitude: -62.2159 },
      coordinates: geographicToCartesian(-3.4653, -62.2159),
      areaOfStudy: 'Monitoring Amazon deforestation patterns',
      dataPurpose: 'This data is used to model climate change, track biodiversity loss, and measure the effectiveness of conservation efforts.',
      earthBenefit: 'Informs global conservation policies and helps local governments combat illegal logging, ensuring the Amazon remains a vital source of oxygen for the planet.'
    },
    {
      id: 'arctic',
      name: 'Arctic Circle', 
      description: 'Monitor sea ice extent and polar climate changes',
      photo: '/arctic.jpg',
      // Arctic Circle coordinates: 66.5638° N, 0° E (Greenland Sea)
      geographic: { latitude: 66.5638, longitude: 0 },
      coordinates: geographicToCartesian(66.5638, 0),
      areaOfStudy: 'Sea ice extent, melt season timing, and polar climate change indicators',
      dataPurpose: 'Supports climate models, shipping route planning, and wildlife habitat protection through long-term polar monitoring.',
      earthBenefit: 'Improves global climate predictions and informs policies to mitigate warming impacts on coastal communities and ecosystems.'
    },
    {
      id: 'sahara',
      name: 'Sahara Desert',
      description: 'Study desertification and sand dune movements',
      photo: '/sahara.jpg',
      // Central Sahara coordinates: 25.2843° N, 14.4384° E (Libya)
      geographic: { latitude: 25.2843, longitude: 14.4384 },
      coordinates: geographicToCartesian(25.2843, 14.4384),
      areaOfStudy: 'Desertification trends, dune migration, and dust storm dynamics',
      dataPurpose: 'Helps forecast air quality impacts, plan land restoration, and assess climate drivers of aridification.',
      earthBenefit: 'Guides sustainable land use and public health responses to dust events across North Africa and the Mediterranean.'
    },
    {
      id: 'great-barrier',
      name: 'Great Barrier Reef',
      description: 'Monitor coral bleaching and ocean health',
      photo: '/great-barrier.jpg',
      // Great Barrier Reef coordinates: -18.2871° S, 147.6992° E (more accurate central location)
      geographic: { latitude: -18.2871, longitude: 147.6992 },
      coordinates: geographicToCartesian(-18.2871, 147.6992),
      areaOfStudy: 'Coral bleaching events, water temperature anomalies, and reef ecosystem vitality',
      dataPurpose: 'Supports marine conservation strategies, fisheries management, and ocean heatwave monitoring.',
      earthBenefit: 'Protects biodiversity and sustains coastal economies that rely on healthy reef systems.'
    },
    {
      id: 'himalayas',
      name: 'Himalayan Glaciers',
      description: 'Track glacier retreat and freshwater resources',
      photo: '/himalaya.png',
      // Mount Everest coordinates: 27.9881° N, 86.9250° E
      geographic: { latitude: 27.9881, longitude: 86.9250 },
      coordinates: geographicToCartesian(27.9881, 86.9250),
      areaOfStudy: 'Glacier mass balance, meltwater flows, and downstream reservoir impacts',
      dataPurpose: 'Supports water resource planning, flood risk assessments, and climate adaptation strategies for millions downstream.',
      earthBenefit: 'Safeguards freshwater security for communities across South Asia and informs resilient infrastructure planning.'
    }
  ];

  const handleISSClick = () => {
    setViewState('cupola');
    setMessage('Explore the International Space Station with this virtual tour from the European Space Agency. Navigate through the modules and experience life in space!');
  };

  const handleCupolaClick = () => {
    setViewState('cupola-image');
    setMessage('This is the view from the Cupola module. Click to proceed to the world map.');
  };

  const handleCupolaImageClick = () => {
    setViewState('world-map');
    setMessage('Select a region to view real NASA photos taken from the ISS.');
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setViewState('region-photo');
    setMessage(`NASA Photo: ${region.name} - ${region.description}`);
  };

  const handleBackFromPhoto = () => {
    setViewState('world-map');
    setSelectedRegion(null);
    setMessage('Select another region or go back to the ISS model.');
  };

  const handleBackToISS = () => {
    setViewState('iss-model');
    setMessage('Click the ISS model to explore different observation points from space.');
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, ...styles.card }}>
          <h2>Mission 3 — ISS Observation Experience</h2>
          <p style={styles.small}>{message}</p>
          
          {/* ISS 3D Model View */}
          {viewState === 'iss-model' && (
            <div 
              style={{
                width: '100%',
                height: '400px',
                background: 'linear-gradient(180deg, #000814 0%, #001d3d 100%)',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                marginTop: '12px'
              }}
            >
              <Canvas
                camera={{ position: [5, 5, 5], fov: 50 }}
                style={{ width: '100%', height: '100%' }}
              >
                <ambientLight intensity={5.0} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <ISSModel />
                <OrbitControls enableZoom={true} enablePan={true} />
              </Canvas>
              <button
                onClick={handleISSClick}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(43, 110, 246, 0.9)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(43, 110, 246, 1)';
                  e.target.style.transform = 'translateX(-50%) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(43, 110, 246, 0.9)';
                  e.target.style.transform = 'translateX(-50%)';
                }}
              >
                Continue to Cupola View
              </button>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                color: '#dbeeff',
                fontSize: '12px',
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '8px 12px',
                borderRadius: '4px',
                backdropFilter: 'blur(4px)'
              }}>
                Drag to rotate • Scroll to zoom
              </div>
            </div>
          )}

          {/* ESA Panoramic Virtual Tour View */}
          {viewState === 'cupola' && (
            <div 
              style={{
                width: '100%',
                height: '500px',
                background: 'linear-gradient(180deg, #000814 0%, #001d3d 100%)',
                borderRadius: '8px',
                position: 'relative',
                marginTop: '12px',
                overflow: 'hidden'
              }}
            >
              <iframe
                src="https://esamultimedia.esa.int/multimedia/virtual-tour-iss/"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px'
                }}
                title="ESA ISS Virtual Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={handleCupolaClick}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(43, 110, 246, 0.9)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(43, 110, 246, 1)';
                  e.target.style.transform = 'translateX(-50%) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(43, 110, 246, 0.9)';
                  e.target.style.transform = 'translateX(-50%)';
                }}
              >
                Continue to Earth Observation
              </button>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                color: '#dbeeff',
                fontSize: '12px',
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '8px 12px',
                borderRadius: '4px',
                backdropFilter: 'blur(4px)'
              }}>
                ESA ISS Virtual Tour - Source: European Space Agency
              </div>
            </div>
          )}

          {/* Cupola Image View */}
          {viewState === 'cupola-image' && (
            <div 
              style={{
                width: '100%',
                height: '400px',
                background: 'url("/cupola.jpg") center/cover',
                borderRadius: '8px',
                position: 'relative',
                marginTop: '12px'
              }}
            >
              <button
                onClick={handleCupolaImageClick}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(43, 110, 246, 0.9)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(43, 110, 246, 1)';
                  e.target.style.transform = 'translateX(-50%) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(43, 110, 246, 0.9)';
                  e.target.style.transform = 'translateX(-50%)';
                }}
              >
                Proceed to World Map
              </button>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                color: '#dbeeff',
                fontSize: '12px',
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '8px 12px',
                borderRadius: '4px',
                backdropFilter: 'blur(4px)'
              }}>
                View from the Cupola module
              </div>
            </div>
          )}

          {/* 3D Earth Model with Region Selection */}
          {viewState === 'world-map' && (
            <div style={{
              width: '100%',
              height: '400px',
              background: 'linear-gradient(180deg, #000814 0%, #001d3d 100%)',
              borderRadius: '8px',
              position: 'relative',
              marginTop: '12px',
              overflow: 'hidden'
            }}>
              <Canvas
                camera={{ position: [0, 0, 3], fov: 60 }}
                style={{ width: '100%', height: '100%' }}
              >
                <EarthModel 
                  onRegionSelect={handleRegionSelect}
                  regions={regions}
                />
                <OrbitControls 
                  enableZoom={true} 
                  enablePan={true}
                  minDistance={1.5}
                  maxDistance={5}
                />
              </Canvas>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                color: '#dbeeff',
                fontSize: '14px',
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '8px 12px',
                borderRadius: '4px',
                backdropFilter: 'blur(4px)'
              }}>
                Drag to rotate Earth • Scroll to zoom • Click glowing markers to view photos
              </div>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                color: '#dbeeff',
                fontSize: '12px',
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '8px 12px',
                borderRadius: '4px',
                backdropFilter: 'blur(4px)'
              }}>
                Interactive 3D Earth Model
              </div>
            </div>
          )}

          {/* Region Photo View with Detailed Panel */}
           {viewState === 'region-photo' && selectedRegion && (
             <div style={{
               width: '100%',
               height: '400px',
               display: 'grid',
               gridTemplateColumns: '1fr 360px',
               gap: '12px',
               borderRadius: '8px',
               position: 'relative',
               marginTop: '12px'
             }}>
               {/* Observation: High-resolution photo */}
               <div style={{
                 width: '100%',
                 height: '100%',
                 background: `url("${selectedRegion.photo}") center/cover`,
                 borderRadius: '8px'
               }} />

               {/* Detailed Panel */}
               <div style={{
                 background: 'rgba(255,255,255,0.06)',
                 borderRadius: '8px',
                 padding: '14px',
                 color: '#dbeeff',
                 border: '1px solid rgba(255,255,255,0.08)'
               }}>
                 <h3 style={{ margin: '0 0 10px 0', color: '#a8e7ff' }}>{selectedRegion.name}</h3>
                 <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>Photo: NASA Earth Observatory</div>

                 <div style={{ marginBottom: '12px' }}>
                   <div style={{ fontWeight: 600, marginBottom: 6 }}>Area of Study</div>
                   <div style={{ fontSize: '13px' }}>{selectedRegion.areaOfStudy}</div>
                 </div>

                 <div style={{ marginBottom: '12px' }}>
                   <div style={{ fontWeight: 600, marginBottom: 6 }}>Data's Purpose</div>
                   <div style={{ fontSize: '13px' }}>{selectedRegion.dataPurpose}</div>
                 </div>

                 <div>
                   <div style={{ fontWeight: 600, marginBottom: 6 }}>Earth Benefit 🌎</div>
                   <div style={{ fontSize: '13px' }}>{selectedRegion.earthBenefit}</div>
                 </div>

                 <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                   <button style={styles.ghost} onClick={handleBackFromPhoto}>Back to Map</button>
                   <button style={styles.button} onClick={() => setShowQuiz(true)}>Continue</button>
                 </div>
               </div>
             </div>
           )}

           {/* Quiz Modal Overlay */}
           {showQuiz && selectedRegion && (
             <div style={{
               position: 'fixed',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               backgroundColor: 'rgba(0,0,0,0.6)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               zIndex: 1000
             }}>
               <div style={{
                 width: '540px',
                 maxWidth: '92vw',
                 background: 'linear-gradient(180deg, rgba(8,53,91,0.96), rgba(20,130,180,0.88))',
                 border: '1px solid rgba(180,230,255,0.35)',
                 borderRadius: '12px',
                 boxShadow: '0 12px 32px rgba(8,40,70,0.6)',
                 color: '#dbeeff',
                 padding: '18px'
               }}>
                 <h3 style={{ margin: '0 0 8px 0', color: '#a8e7ff' }}>Quick Quiz: {selectedRegion.name}</h3>
                 <p style={{ margin: '0 0 12px 0', fontSize: '13px', opacity: 0.9 }}>Choose the best answers based on what you observed.</p>

                 {/* One-question-at-a-time quiz */}
                 <div style={{ marginBottom: '8px', fontSize: '12px', color: '#bcd6ff' }}>Question {quizStep + 1} of 3</div>
                 {quizStep === 0 && (
                   <div style={{ marginBottom: '12px' }}>
                     <div style={{ fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>Area of Study</div>
                     {[selectedRegion.areaOfStudy, 'Volcanic activity monitoring', 'Urban traffic analysis'].map((opt, idx) => (
                       <label key={`area-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                         <input
                           type="radio"
                           name="areaOfStudy"
                           value={opt}
                           checked={quizResponses.areaOfStudy === opt}
                           onChange={(e) => setQuizResponses(r => ({ ...r, areaOfStudy: e.target.value }))}
                         />
                         <span style={{ fontSize: '13px' }}>{opt}</span>
                       </label>
                     ))}
                   </div>
                 )}
                 {quizStep === 1 && (
                   <div style={{ marginBottom: '12px' }}>
                     <div style={{ fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>Data's Purpose</div>
                     {[selectedRegion.dataPurpose, 'Entertainment content creation', 'Space tourism marketing'].map((opt, idx) => (
                       <label key={`purpose-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                         <input
                           type="radio"
                           name="dataPurpose"
                           value={opt}
                           checked={quizResponses.dataPurpose === opt}
                           onChange={(e) => setQuizResponses(r => ({ ...r, dataPurpose: e.target.value }))}
                         />
                         <span style={{ fontSize: '13px' }}>{opt}</span>
                       </label>
                     ))}
                   </div>
                 )}
                 {quizStep === 2 && (
                   <div>
                     <div style={{ fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>Earth Benefit 🌎</div>
                     {[selectedRegion.earthBenefit, 'Increase smartphone sales', 'Promote video games'].map((opt, idx) => (
                       <label key={`benefit-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                         <input
                           type="radio"
                           name="earthBenefit"
                           value={opt}
                           checked={quizResponses.earthBenefit === opt}
                           onChange={(e) => setQuizResponses(r => ({ ...r, earthBenefit: e.target.value }))}
                         />
                         <span style={{ fontSize: '13px' }}>{opt}</span>
                       </label>
                     ))}
                   </div>
                 )}

                 {/* Feedback message */}
                 {quizFeedback && (
                   <div style={{
                     marginTop: '8px',
                     background: quizFeedback.correct ? 'rgba(40,180,90,0.14)' : 'rgba(200,60,60,0.14)',
                     border: `1px solid ${quizFeedback.correct ? 'rgba(80,220,140,0.4)' : 'rgba(230,120,120,0.4)'}`,
                     color: quizFeedback.correct ? '#b9ffd1' : '#ffd6d6',
                     padding: '8px',
                     borderRadius: '8px'
                   }}>
                     {quizFeedback.message}
                   </div>
                 )}

                 <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginTop: '14px' }}>
                   <button style={styles.ghost} onClick={() => { setShowQuiz(false); setQuizResponses({ areaOfStudy: '', dataPurpose: '', earthBenefit: '' }); setQuizStep(0); setQuizFeedback(null); }}>Cancel</button>
                   <div style={{ display: 'flex', gap: '8px' }}>
                     <button
                       style={styles.button}
                       onClick={() => {
                         // Determine current question correctness
                         let correct = false;
                         if (quizStep === 0) correct = quizResponses.areaOfStudy === selectedRegion.areaOfStudy;
                         if (quizStep === 1) correct = quizResponses.dataPurpose === selectedRegion.dataPurpose;
                         if (quizStep === 2) correct = quizResponses.earthBenefit === selectedRegion.earthBenefit;
                         setQuizFeedback({ correct, message: correct ? 'Correct!' : 'Not quite — try again or continue.' });
                       }}
                       disabled={
                         (quizStep === 0 && !quizResponses.areaOfStudy) ||
                         (quizStep === 1 && !quizResponses.dataPurpose) ||
                         (quizStep === 2 && !quizResponses.earthBenefit)
                       }
                     >Submit Answer</button>
                     <button
                       style={styles.ghost}
                       onClick={() => {
                         // Advance to next step or finish
                         if (quizStep < 2) {
                           setQuizStep(s => s + 1);
                           setQuizFeedback(null);
                         } else {
                           setQuizSubmitted(true);
                           setShowQuiz(false);
                           setQuizFeedback(null);
                         }
                       }}
                     >{quizStep < 2 ? 'Next' : 'Finish'}</button>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Submission confirmation */}
           {quizSubmitted && (
             <div style={{
               marginTop: '12px',
               background: 'rgba(20,130,180,0.12)',
               border: '1px solid rgba(180,230,255,0.25)',
               color: '#a8e7ff',
               padding: '10px',
               borderRadius: '8px'
             }}>
               Thanks! Your quiz has been captured for {selectedRegion?.name}. You can continue exploring other regions.
             </div>
           )}

          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {viewState !== 'iss-model' && (
              <button style={styles.ghost} onClick={viewState === 'region-photo' ? handleBackFromPhoto : handleBackToISS}>
                {viewState === 'region-photo' ? 'Back to Map' : 'Back to ISS'}
              </button>
            )}
            <button style={styles.button} onClick={onComplete}>Complete Mission</button>
            <button style={styles.ghost} onClick={onBack}>Back to Missions</button>
          </div>
        </div>

        <div style={{ width: 320 }}>
          <div style={styles.card}>
            <h3>Teaching Points</h3>
            <ul style={styles.small}>
              <li>The ISS Cupola provides astronauts with a spectacular view of Earth</li>
              <li>Astronauts conduct Earth observation photography for scientific research</li>
              <li>These photos help monitor climate change, natural disasters, and environmental changes</li>
              <li>Real-time Earth observation supports disaster response and environmental monitoring</li>
            </ul>
          </div>

          <div style={{ ...styles.card, marginTop: 12 }}>
            <h3>Regions to Explore</h3>
            <ul style={styles.small}>
              {regions.map(region => (
                <li key={region.id}>
                  <strong>{region.name}:</strong> {region.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Gallery component for 3D model viewing ----------
function Gallery({ onBack }) {
  const [selectedModel, setSelectedModel] = useState(null);
  const [enlargedModel, setEnlargedModel] = useState(null);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

  const models = [
     // Space Station Modules
     { id: 'iss', name: 'International Space Station', file: '/ISS_stationary.glb', description: 'The complete International Space Station in low Earth orbit. A modular space station serving as a microgravity research laboratory.', category: 'Station Modules' },
     { id: 'iss-indoor', name: 'ISS Interior', file: '/ISS_indoor.glb', description: 'Inside view of the International Space Station showing living quarters and work areas.', category: 'Station Modules' },
     { id: 'cupola', name: 'Cupola Module', file: '/cupola.glb', description: 'ESA-built observatory module with seven windows for Earth observation and spacewalk monitoring.', category: 'Station Modules' },
     { id: 'crew-quarters', name: 'Crew Quarters', file: '/crew_quarters.glb', description: 'Personal sleeping compartments for astronauts with privacy and storage.', category: 'Station Modules' },
     { id: 'iss-hatch', name: 'ISS Hatch', file: '/iss_hatch.glb', description: 'Standard hatch design used throughout the space station for module connections.', category: 'Station Modules' },
     
     // Astronauts and Equipment
     { id: 'astronaut', name: 'Astronaut', file: '/astronaut.glb', description: 'Fully suited astronaut ready for spacewalk or station operations.', category: 'Astronauts & Equipment' },
     { id: 'astronaut-food', name: 'Astronaut Food', file: '/astronaut_food.glb', description: 'Space food packaging and meal containers used on the ISS.', category: 'Astronauts & Equipment' },
     { id: 'space-wrench', name: 'Space Wrench', file: '/space_wrench.glb', description: 'Specialized tool designed for zero-gravity repairs and maintenance.', category: 'Astronauts & Equipment' },
     
     // Celestial Objects
     { id: 'earth', name: 'Earth Globe', file: '/earth.glb', description: 'Detailed 3D model of Earth showing continents, oceans, and cloud cover.', category: 'Celestial Objects' },
     { id: 'moon', name: 'Moon', file: '/moon.glb', description: 'Detailed 3D model of Earth\'s natural satellite showing craters and surface features.', category: 'Celestial Objects' },
     
     // Spacecraft
     { id: 'lander', name: 'Lunar Lander', file: '/lander.glb', description: 'Spacecraft designed for landing on celestial bodies like the Moon or Mars.', category: 'Spacecraft' },
     { id: 'saturn-v', name: 'Saturn V Rocket', file: '/saturn_v.glb', description: 'NASA\'s iconic Moon rocket that launched Apollo astronauts to the Moon.', category: 'Spacecraft' },
     { id: 'space-shuttle', name: 'Space Shuttle', file: '/space_shuttle.glb', description: 'Reusable spacecraft that revolutionized space travel with its orbiter design.', category: 'Spacecraft' },
     { id: 'space-exploration-vehicle', name: 'Space Exploration Vehicle', file: '/space_exploration_vehicle.glb', description: 'Next-generation rover designed for planetary surface exploration.', category: 'Spacecraft' },
     { id: 'falcon-9', name: 'Falcon 9 Rocket', file: '/falcon_9.glb', description: 'SpaceX\'s partially reusable two-stage rocket for reliable satellite launches.', category: 'Spacecraft' },
     
     // Astronauts and Equipment
     { id: 'crew-escape-suit', name: 'Crew Escape Suit', file: '/crew_escape_suit.glb', description: 'Advanced pressure suit designed for emergency escape scenarios during launch and re-entry.', category: 'Astronauts & Equipment' },
     
     // Facilities
     { id: 'vehicle-assembly-building', name: 'Vehicle Assembly Building', file: '/vehicle_assembly_building.glb', description: 'Massive NASA facility where rockets are assembled before launch.', category: 'Facilities' }
   ];

  useEffect(() => {
    // Load model-viewer component dynamically
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.onload = () => setModelViewerLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Space Objects Gallery</h2>
        <button style={styles.ghost} onClick={onBack}>Back to Dashboard</button>
      </div>

      {/* Group models by category */}
      {Array.from(new Set(models.map(m => m.category))).map(category => (
        <div key={category}>
          <h3 style={{ 
            color: '#2b6ef6', 
            margin: '32px 0 16px 0',
            borderBottom: '2px solid rgba(43, 110, 246, 0.2)',
            paddingBottom: '8px'
          }}>
            {category}
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 24,
            marginBottom: 32 
          }}>
            {models.filter(model => model.category === category).map(model => (
              <div 
                key={model.id}
                style={{
                  ...styles.card,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  transform: selectedModel === model.id ? 'scale(1.02)' : 'none',
                  boxShadow: selectedModel === model.id ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onClick={() => setSelectedModel(model.id)}
                onMouseEnter={() => setSelectedModel(model.id)}
                onMouseLeave={() => setSelectedModel(null)}
              >
                <div style={{ 
                  height: 200, 
                  background: 'linear-gradient(135deg, #1a3b5c, #2c5282)',
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {modelViewerLoaded ? (
                    <model-viewer
                      src={model.file}
                      alt={model.name}
                      camera-controls
                      auto-rotate
                      style={{ width: '100%', height: '100%' }}
                      exposure="1.0"
                      environment-intensity="1.0"
                      shadow-intensity="1.0"
                    ></model-viewer>
                  ) : (
                    <div style={{ 
                      fontSize: 48,
                      opacity: 0.8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%'
                    }}>
                      {model.id === 'iss' && '🛰️'}
                      {model.id === 'cupola' && '🔭'}
                      {model.id === 'earth' && '🌎'}
                      {model.id === 'moon' && '🌕'}
                      {model.id === 'crew-escape-suit' && '👨‍🚀'}
                      {model.id === 'saturn-v' && '🚀'}
                      {model.id === 'space-shuttle' && '🛸'}
                      {model.id === 'space-exploration-vehicle' && '🚙'}
                      {model.id === 'falcon-9' && '🚀'}
                      {model.id === 'vehicle-assembly-building' && '🏭'}
                    </div>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#2b6ef6' }}>{model.name}</h3>
                  <p style={{ ...styles.small, margin: 0, color: '#666' }}>{model.description}</p>
                  <button 
                    style={{ 
                      ...styles.button, 
                      marginTop: 12,
                      width: '100%',
                      fontSize: '14px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnlargedModel(model);
                    }}
                  >
                    View 3D Model
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Enlarged model view modal */}
      {enlargedModel && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 40
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a3b5c, #2c5282)',
            borderRadius: 16,
            padding: 24,
            maxWidth: 800,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px'
              }}
              onClick={() => setEnlargedModel(null)}
            >
              ×
            </button>
            
            <h3 style={{ margin: '0 0 16px 0', color: 'white', textAlign: 'center' }}>
              {enlargedModel.name}
            </h3>
            
            <div style={{
              height: 400,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              overflow: 'hidden'
            }}>
              {modelViewerLoaded ? (
                <model-viewer
                  src={enlargedModel.file}
                  alt={enlargedModel.name}
                  camera-controls
                  auto-rotate
                  style={{ width: '100%', height: '100%' }}
                  exposure="1.0"
                  environment-intensity="1.5"
                  shadow-intensity="1.2"
                  animation-name="auto-rotate"
                  animation-speed="0.5"
                ></model-viewer>
              ) : (
                <div style={{ fontSize: 64, opacity: 0.7 }}>
                  {enlargedModel.id === 'iss' && '🛰️'}
                  {enlargedModel.id === 'cupola' && '🔭'}
                  {enlargedModel.id === 'earth' && '🌎'}
                  {enlargedModel.id === 'moon' && '🌕'}
                  {enlargedModel.id === 'crew-escape-suit' && '👨‍🚀'}
                  {enlargedModel.id === 'saturn-v' && '🚀'}
                  {enlargedModel.id === 'space-shuttle' && '🛸'}
                  {enlargedModel.id === 'space-exploration-vehicle' && '🚙'}
                  {enlargedModel.id === 'falcon-9' && '🚀'}
                  {enlargedModel.id === 'vehicle-assembly-building' && '🏭'}
                </div>
              )}
            </div>
            
            <p style={{ 
              color: 'rgba(255,255,255,0.8)', 
              textAlign: 'center',
              margin: '0 0 24px 0',
              fontSize: '14px'
            }}>
              {enlargedModel.description}
            </p>
            
            <div style={{ textAlign: 'center' }}>
              <button
                style={{
                  ...styles.button,
                  background: 'rgba(255,255,255,0.9)',
                  color: '#2c5282',
                  border: 'none'
                }}
                onClick={() => setEnlargedModel(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Certificate generator (enhanced NASA-style certificate) ----------
function generateCertificate(){
  const c = document.createElement('canvas');
  c.width = 1400; c.height = 1000; const ctx = c.getContext('2d');
  
  // NASA-inspired background with space theme
  const bgGradient = ctx.createLinearGradient(0, 0, 0, c.height);
  bgGradient.addColorStop(0, '#000814'); // Deep space black
  bgGradient.addColorStop(0.5, '#001845'); // Space blue
  bgGradient.addColorStop(1, '#000814');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, c.width, c.height);
  
  // Add starfield background
  ctx.fillStyle = 'white';
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * c.width;
    const y = Math.random() * c.height;
    const size = Math.random() * 1.5;
    ctx.globalAlpha = Math.random() * 0.8 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  // Decorative border with NASA colors
  ctx.strokeStyle = '#0B3D91'; // NASA blue
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, c.width - 80, c.height - 80);
  
  // Inner decorative border
  ctx.strokeStyle = '#FC3D21'; // NASA red
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, c.width - 120, c.height - 120);
  
  // NASA "meatball" logo (simplified version)
  ctx.fillStyle = '#0B3D91';
  ctx.beginPath();
  ctx.arc(700, 180, 80, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(700, 180, 70, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#FC3D21';
  ctx.beginPath();
  ctx.moveTo(700, 180);
  ctx.arc(700, 180, 60, -Math.PI * 0.25, Math.PI * 0.25);
  ctx.lineTo(700, 180);
  ctx.fill();
  
  // Main title
  ctx.fillStyle = 'white';
  ctx.font = 'bold 52px "Arial", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('NASA ASTRONAUT TRAINING CERTIFICATE', 700, 320);
  
  // Subtitle
  ctx.font = 'italic 28px "Arial", sans-serif';
  ctx.fillStyle = '#A8D5FF';
  ctx.fillText('Certificate of Outstanding Achievement', 700, 370);
  
  // Main content
  ctx.font = '32px "Arial", sans-serif';
  ctx.fillStyle = 'white';
  ctx.fillText('This certifies that the trainee has successfully completed', 700, 450);
  ctx.fillText('the Astronaut Journey training program, demonstrating', 700, 490);
  ctx.fillText('excellence in space mission operations and Earth observation.', 700, 530);
  
  // Mission achievements section
  ctx.font = 'bold 28px "Arial", sans-serif';
  ctx.fillStyle = '#FC3D21';
  ctx.fillText('Missions Completed:', 700, 600);
  
  ctx.font = '24px "Arial", sans-serif';
  ctx.fillStyle = '#A8D5FF';
  ctx.textAlign = 'left';
  ctx.fillText('✓ Neutral Buoyancy Lab Training', 450, 650);
  ctx.fillText('✓ Microgravity Repair Operations', 450, 690);
  ctx.fillText('✓ Cupola Earth Observation', 450, 730);
  
  // Date and signature area
  ctx.textAlign = 'right';
  ctx.font = '20px "Arial", sans-serif';
  ctx.fillStyle = '#CCCCCC';
  ctx.fillText(`Date of Completion: ${new Date().toLocaleDateString()}`, c.width - 100, 850);
  
  ctx.font = 'italic 18px "Arial", sans-serif';
  ctx.fillText('NASA Astronaut Training Division', c.width - 100, 900);
  ctx.fillText('International Space Station Program', c.width - 100, 930);
  
  // Decorative elements - orbiting spacecraft
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(700, 180, 120, 0, Math.PI * 2);
  ctx.stroke();
  
  // Small orbiting satellite
  ctx.fillStyle = '#A8D5FF';
  ctx.beginPath();
  ctx.arc(820, 180, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Download the enhanced certificate
  const data = c.toDataURL('image/png');
  const a = document.createElement('a'); 
  a.href = data; 
  a.download = 'nasa_astronaut_certificate.png'; 
  document.body.appendChild(a); 
  a.click(); 
  a.remove();
}
