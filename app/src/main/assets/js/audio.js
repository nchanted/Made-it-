/* ============================================================
   MADE IT — audio (procedural, no asset files)
   Tiny WebAudio blips for clicks, success, warnings, promotions.
   ============================================================ */
const Sound = (function(){
  let ctx = null, muted = false;

  function ac(){
    if(!ctx){
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e){ ctx = null; }
    }
    if(ctx && ctx.state === 'suspended'){ ctx.resume(); }
    return ctx;
  }

  function tone(freq, dur, type, gain, when){
    const c = ac(); if(!c || muted) return;
    const t0 = c.currentTime + (when||0);
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.12, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  function chord(freqs, dur, type, gain){
    freqs.forEach((f,i)=> tone(f, dur, type, gain, i*0.06));
  }

  return {
    setMuted(m){ muted = m; },
    isMuted(){ return muted; },
    tap(){ tone(420, 0.06, 'triangle', 0.06); },
    select(){ tone(620, 0.07, 'sine', 0.08); },
    good(){ chord([523,659,784], 0.18, 'sine', 0.1); },
    bad(){ tone(180, 0.22, 'sawtooth', 0.08); tone(140, 0.26, 'sawtooth', 0.06, 0.04); },
    cash(){ tone(880,0.06,'square',0.06); tone(1175,0.08,'square',0.06,0.05); tone(1568,0.1,'square',0.05,0.1); },
    warn(){ tone(330,0.14,'square',0.07); tone(247,0.18,'square',0.07,0.12); },
    promo(){ chord([523,659,784,1047], 0.3, 'sine', 0.12); chord([784,988,1175,1568], 0.4, 'triangle', 0.07); },
    fired(){ tone(220,0.3,'sawtooth',0.08); tone(165,0.4,'sawtooth',0.07,0.18); tone(110,0.6,'sawtooth',0.06,0.4); },
    win(){ [523,659,784,1047,1319].forEach((f,i)=> tone(f,0.45,'sine',0.12,i*0.13)); }
  };
})();
