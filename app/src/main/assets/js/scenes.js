/* ============================================================
   MADE IT — scenes
   Procedurally drawn SVG offices that evolve with the player's band,
   plus an avatar whose outfit upgrades as the career climbs and whose
   expression reflects current performance.
   ============================================================ */
const Scenes = (function(){

  const VB_W = 800, VB_H = 480;

  /* outfit by band */
  function outfitFor(band){
    return ({
      entry:'casual', mid:'casual',
      senior:'tech', architect:'tech', principal:'tech', fellow:'blazer',
      lead:'shirt', manager:'shirt',
      senior_manager:'blazer', director:'blazer',
      vp:'suit', exec:'suit', board:'prestige'
    })[band] || 'casual';
  }

  function moodFor(perf){
    if(perf >= 68) return 'happy';
    if(perf >= 42) return 'neutral';
    return 'worried';
  }

  /* ---- Avatar ---- */
  function avatar(cx, baseY, s, outfit, mood){
    const skin = '#e8b88f', skinShade = '#d49b72', hair = '#2a2f3d';
    // body color per outfit
    const body = {
      casual:'#3c5278', tech:'#2f7c6e', shirt:'#dbe6f5',
      blazer:'#1f3050', suit:'#15233e', prestige:'#1a1d28'
    }[outfit];
    const accent = {
      casual:'#16e0c8', tech:'#9be7da', shirt:'#9fb3d6',
      blazer:'#f4b740', suit:'#16e0c8', prestige:'#f4b740'
    }[outfit];

    const headR = 30*s;
    const headY = baseY - 150*s;
    const torsoY = baseY - 96*s;

    // expression
    let mouth, brow='';
    if(mood==='happy'){
      mouth = `<path d="M ${cx-12*s} ${headY+12*s} Q ${cx} ${headY+24*s} ${cx+12*s} ${headY+12*s}" stroke="#7a4a32" stroke-width="${3*s}" fill="none" stroke-linecap="round"/>`;
    } else if(mood==='worried'){
      mouth = `<path d="M ${cx-11*s} ${headY+20*s} Q ${cx} ${headY+10*s} ${cx+11*s} ${headY+20*s}" stroke="#7a4a32" stroke-width="${3*s}" fill="none" stroke-linecap="round"/>`;
      brow = `<path d="M ${cx-16*s} ${headY-4*s} L ${cx-6*s} ${headY-1*s} M ${cx+16*s} ${headY-4*s} L ${cx+6*s} ${headY-1*s}" stroke="#3a2f2a" stroke-width="${2.4*s}" stroke-linecap="round"/>`;
    } else {
      mouth = `<line x1="${cx-10*s}" y1="${headY+15*s}" x2="${cx+10*s}" y2="${headY+15*s}" stroke="#7a4a32" stroke-width="${3*s}" stroke-linecap="round"/>`;
    }

    // tie / accents for formal outfits
    let extras = '';
    if(outfit==='blazer' || outfit==='suit' || outfit==='prestige'){
      // shirt V + tie
      extras += `<path d="M ${cx-14*s} ${torsoY} L ${cx} ${torsoY+26*s} L ${cx+14*s} ${torsoY}" fill="#eef3fb"/>`;
      extras += `<path d="M ${cx-5*s} ${torsoY+4*s} L ${cx+5*s} ${torsoY+4*s} L ${cx+3*s} ${torsoY+44*s} L ${cx} ${torsoY+52*s} L ${cx-3*s} ${torsoY+44*s} Z" fill="${accent}"/>`;
      if(outfit==='prestige'){
        extras += `<rect x="${cx+22*s}" y="${torsoY+10*s}" width="${14*s}" height="${8*s}" rx="${2*s}" fill="${accent}"/>`; // pocket square
      }
    } else if(outfit==='shirt'){
      extras += `<path d="M ${cx-12*s} ${torsoY} L ${cx} ${torsoY+18*s} L ${cx+12*s} ${torsoY}" fill="#c3d2ea"/>`;
    } else if(outfit==='tech'){
      extras += `<circle cx="${cx}" cy="${torsoY+24*s}" r="${4*s}" fill="${accent}"/>`; // henley button accent
    } else { // casual hoodie strings
      extras += `<line x1="${cx-6*s}" y1="${torsoY+4*s}" x2="${cx-6*s}" y2="${torsoY+24*s}" stroke="${accent}" stroke-width="${2.4*s}"/>`;
      extras += `<line x1="${cx+6*s}" y1="${torsoY+4*s}" x2="${cx+6*s}" y2="${torsoY+24*s}" stroke="${accent}" stroke-width="${2.4*s}"/>`;
    }

    return `
      <g>
        <!-- torso -->
        <path d="M ${cx-46*s} ${baseY} Q ${cx-44*s} ${torsoY} ${cx-30*s} ${torsoY-6*s}
                 L ${cx+30*s} ${torsoY-6*s} Q ${cx+44*s} ${torsoY} ${cx+46*s} ${baseY} Z"
              fill="${body}"/>
        ${extras}
        <!-- neck -->
        <rect x="${cx-9*s}" y="${headY+20*s}" width="${18*s}" height="${22*s}" rx="${6*s}" fill="${skinShade}"/>
        <!-- head -->
        <circle cx="${cx}" cy="${headY}" r="${headR}" fill="${skin}"/>
        <!-- ears -->
        <circle cx="${cx-headR}" cy="${headY+2*s}" r="${5*s}" fill="${skinShade}"/>
        <circle cx="${cx+headR}" cy="${headY+2*s}" r="${5*s}" fill="${skinShade}"/>
        <!-- hair -->
        <path d="M ${cx-headR-1*s} ${headY-2*s}
                 Q ${cx-headR} ${headY-headR-6*s} ${cx} ${headY-headR-4*s}
                 Q ${cx+headR} ${headY-headR-6*s} ${cx+headR+1*s} ${headY-2*s}
                 Q ${cx+headR-4*s} ${headY-headR+6*s} ${cx} ${headY-headR+3*s}
                 Q ${cx-headR+4*s} ${headY-headR+6*s} ${cx-headR-1*s} ${headY-2*s} Z"
              fill="${hair}"/>
        <!-- eyes -->
        <circle cx="${cx-12*s}" cy="${headY+2*s}" r="${3.2*s}" fill="#27313f"/>
        <circle cx="${cx+12*s}" cy="${headY+2*s}" r="${3.2*s}" fill="#27313f"/>
        ${brow}
        ${mouth}
      </g>`;
  }

  /* ---- shared bits ---- */
  function skyline(x,y,w,h,tint){
    let r = '';
    const seed = 7;
    let px = x;
    let i = 0;
    while(px < x+w){
      const bw = 26 + ((i*37)%30);
      const bh = h*(0.4 + ((i*53)%50)/100);
      r += `<rect x="${px}" y="${y+h-bh}" width="${bw-4}" height="${bh}" fill="${tint}" opacity="0.5"/>`;
      // windows
      for(let wy=y+h-bh+8; wy<y+h-8; wy+=14){
        for(let wx=px+4; wx<px+bw-8; wx+=10){
          if(((wx+wy+i)%3)===0) r += `<rect x="${wx}" y="${wy}" width="5" height="7" fill="#ffd98a" opacity="0.6"/>`;
        }
      }
      px += bw; i++;
    }
    return r;
  }

  function monitor(x,y,w,h,glow){
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#0a0f1c" stroke="#26344f" stroke-width="2"/>
      <rect x="${x+6}" y="${y+6}" width="${w-12}" height="${h-12}" rx="3" fill="url(#scr)"/>
      <g opacity="0.85" font-family="monospace" font-size="8" fill="${glow||'#16e0c8'}">
        <text x="${x+12}" y="${y+20}">$ scan --all</text>
        <text x="${x+12}" y="${y+32}">[OK] no threats</text>
        <text x="${x+12}" y="${y+44}">&gt; monitoring...</text>
      </g>
      <rect x="${x+w/2-10}" y="${y+h}" width="20" height="10" fill="#1a2740"/>
      <rect x="${x+w/2-26}" y="${y+h+10}" width="52" height="5" rx="2" fill="#26344f"/>`;
  }

  /* ---- defs (gradients) ---- */
  function defs(top, bottom, screen){
    return `<defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${top}"/>
        <stop offset="1" stop-color="${bottom}"/>
      </linearGradient>
      <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0d2a2a"/>
        <stop offset="1" stop-color="#06121c"/>
      </linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${screen||'#141f33'}"/>
        <stop offset="1" stop-color="#0a1120"/>
      </linearGradient>
    </defs>`;
  }

  /* ============================================================
     SCENE BUILDERS  (each returns inner SVG; avatar added by render)
     ============================================================ */
  const builders = {

    cubicle(){ return `
      ${defs('#1a2336','#0d1424')}
      <rect width="${VB_W}" height="${VB_H}" fill="url(#bgGrad)"/>
      <!-- fluorescent panel -->
      <rect x="280" y="0" width="240" height="22" fill="#2a3553" opacity="0.7"/>
      <rect x="300" y="6" width="200" height="8" rx="4" fill="#d7e6ff" opacity="0.5"/>
      <rect x="0" y="360" width="${VB_W}" height="120" fill="url(#floor)"/>
      <!-- cubicle walls -->
      <rect x="120" y="150" width="560" height="220" fill="#5a6378" opacity="0.35"/>
      <rect x="120" y="150" width="560" height="14" fill="#39435c"/>
      <!-- desk -->
      <rect x="250" y="320" width="300" height="16" rx="3" fill="#3a2f26"/>
      <rect x="262" y="336" width="14" height="34" fill="#2a2119"/>
      <rect x="524" y="336" width="14" height="34" fill="#2a2119"/>
      ${monitor(360,250,90,64)}
      <!-- sticky notes -->
      <rect x="150" y="200" width="26" height="26" fill="#f4d35e" transform="rotate(-6 163 213)"/>
      <rect x="190" y="210" width="26" height="26" fill="#7be0c4" transform="rotate(4 203 223)"/>
      <!-- coffee -->
      <rect x="300" y="304" width="14" height="16" rx="2" fill="#cfd8e8"/>`; },

    openfloor(){ return `
      ${defs('#1b2740','#0e1729')}
      <rect width="${VB_W}" height="${VB_H}" fill="url(#bgGrad)"/>
      <rect x="0" y="350" width="${VB_W}" height="130" fill="url(#floor)"/>
      <!-- far desks -->
      <g opacity="0.5">
        <rect x="60" y="250" width="120" height="10" fill="#3a2f26"/>
        <rect x="620" y="250" width="120" height="10" fill="#3a2f26"/>
        ${monitor(90,205,54,38)} ${monitor(650,205,54,38)}
      </g>
      <!-- main dual-monitor desk -->
      <rect x="280" y="318" width="320" height="16" rx="3" fill="#3a2f26"/>
      ${monitor(320,236,92,66)} ${monitor(470,236,92,66)}
      <!-- plant -->
      <rect x="600" y="300" width="16" height="20" fill="#5a4632"/>
      <path d="M 608 300 Q 596 280 600 268 Q 612 278 608 300 Q 620 282 624 270 Q 616 296 608 300" fill="#3ddc84" opacity="0.8"/>
      <!-- window strip -->
      <rect x="0" y="60" width="${VB_W}" height="90" fill="#0e2036" opacity="0.6"/>
      ${skyline(0,70,VB_W,80,'#22344f')}`; },

    seniordesk(){ return `
      ${defs('#172a40','#0c1828')}
      <rect width="${VB_W}" height="${VB_H}" fill="url(#bgGrad)"/>
      <rect x="0" y="50" width="${VB_W}" height="110" fill="#0c1f33"/>
      ${skyline(0,60,VB_W,100,'#26415f')}
      <rect x="0" y="355" width="${VB_W}" height="125" fill="url(#floor)"/>
      <!-- big ultrawide -->
      <rect x="250" y="312" width="360" height="16" rx="3" fill="#2f2a3f"/>
      <rect x="290" y="226" width="280" height="86" rx="8" fill="#0a0f1c" stroke="#2b6f63" stroke-width="2"/>
      <rect x="298" y="234" width="264" height="70" rx="4" fill="url(#scr)"/>
      <g font-family="monospace" font-size="8" fill="#16e0c8" opacity="0.85">
        <text x="306" y="250">INCIDENT #4471  severity: high</text>
        <text x="306" y="264">timeline  ▓▓▓▓▓░░░  containing</text>
        <text x="306" y="278">$ block 203.0.113.7  [done]</text>
        <text x="306" y="292">runbook: apply • verify • close</text>
      </g>
      <!-- plant + mug -->
      <rect x="630" y="296" width="18" height="22" fill="#5a4632"/>
      <path d="M 639 296 Q 624 272 630 258 Q 646 270 639 296 Q 656 274 660 260 Q 650 292 639 296" fill="#3ddc84"/>
      <rect x="270" y="296" width="16" height="16" rx="2" fill="#16e0c8" opacity="0.8"/>`; },

    labdesk(){ return `
      ${defs('#101f2e','#08131f')}
      <rect width="${VB_W}" height="${VB_H}" fill="url(#bgGrad)"/>
      <!-- server rack glow -->
      <rect x="40" y="120" width="90" height="240" rx="6" fill="#0c1722" stroke="#1d3b40" stroke-width="2"/>
      <g>${Array.from({length:9}).map((_,i)=>`<rect x="50" y="${134+i*24}" width="70" height="16" rx="2" fill="#0a141c"/><circle cx="60" cy="${142+i*24}" r="3" fill="${i%3?'#16e0c8':'#3ddc84'}"/>`).join('')}</g>
      <rect x="0" y="360" width="${VB_W}" height="120" fill="url(#floor)"/>
      <!-- triple monitor -->
      <rect x="250" y="318" width="380" height="16" rx="3" fill="#241f33"/>
      ${monitor(280,236,96,70)} ${monitor(392,236,96,70)} ${monitor(504,236,96,70)}
      <!-- whiteboard with architecture -->
      <rect x="640" y="120" width="150" height="120" rx="6" fill="#eef3fb" opacity="0.92"/>
      <g stroke="#1f3050" stroke-width="2" fill="none">
        <rect x="660" y="150" width="34" height="22"/><rect x="730" y="150" width="34" height="22"/>
        <rect x="695" y="195" width="34" height="22"/>
        <line x1="694" y1="161" x2="730" y2="161"/><line x1="677" y1="172" x2="710" y2="195"/><line x1="747" y1="172" x2="714" y2="195"/>
      </g>`; },

    teamroom(){ return `
      ${defs('#1c2a44','#0f1a2e')}
      <rect width="${VB_W}" height="${VB_H}" fill="url(#bgGrad)"/>
      <rect x="0" y="355" width="${VB_W}" height="125" fill="url(#floor)"/>
      <!-- whiteboard -->
      <rect x="500" y="70" width="270" height="150" rx="8" fill="#eef3fb"/>
      <g stroke="#16a08f" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M 520 110 H 600"/><path d="M 520 130 H 640"/><path d="M 520 150 H 580"/>
      </g>
      <g stroke="#f4b740" stroke-width="3" fill="none"><circle cx="700" cy="120" r="22"/><path d="M 690 120 l 8 8 l 14 -16"/></g>
      <!-- two teammates (silhouettes) -->
      <g opacity="0.85">
        <circle cx="150" cy="250" r="24" fill="#d49b72"/><rect x="120" y="278" width="60" height="80" rx="20" fill="#3c5278"/>
        <circle cx="250" cy="258" r="22" fill="#e8b88f"/><rect x="222" y="282" width="56" height="76" rx="18" fill="#2f7c6e"/>
      </g>
      <!-- shared table -->
      <rect x="120" y="350" width="420" height="14" rx="3" fill="#3a2f26"/>`; },

    office(){ return `
      ${defs('#1d2c4a','#0f1c33')}
      <rect width="${VB_W}" height="${VB_H}" fill="url(#bgGrad)"/>
      <!-- window with skyline -->
      <rect x="430" y="50" width="340" height="200" rx="6" fill="#0c2034"/>
      ${skyline(440,90,320,150,'#2c486a')}
      <rect x="430" y="50" width="340" height="200" rx="6" fill="none" stroke="#2c3c5c" stroke-width="6"/>
      <line x1="600" y1="50" x2="600" y2="250" stroke="#2c3c5c" stroke-width="4"/>
      <rect x="0" y="360" width="${VB_W}" height="120" fill="url(#floor)"/>
      <!-- exec desk -->
      <rect x="120" y="330" width="320" height="18" rx="4" fill="#2a1f17"/>
      <rect x="140" y="348" width="16" height="30" fill="#1c150f"/>
      <rect x="404" y="348" width="16" height="30" fill="#1c150f"/>
      ${monitor(220,256,96,66)}
      <!-- nameplate + plant -->
      <rect x="160" y="316" width="60" height="14" rx="2" fill="#cba35a"/>
      <rect x="360" y="300" width="18" height="30" fill="#5a4632"/>
      <path d="M 369 300 Q 352 270 360 254 Q 380 268 369 300 Q 388 270 394 256 Q 382 296 369 300" fill="#3ddc84"/>`; },

    corner(){ return `
      ${defs('#203357','#101e38')}
      <rect width="${VB_W}" height="${VB_H}" fill="url(#bgGrad)"/>
      <!-- wraparound corner windows -->
      <rect x="0" y="40" width="${VB_W}" height="240" fill="#0b1f33"/>
      ${skyline(0,70,VB_W,210,'#33527a')}
      <g stroke="#2c3c5c" stroke-width="5">
        <line x1="0" y1="40" x2="${VB_W}" y2="40"/>
        <line x1="260" y1="40" x2="260" y2="280"/>
        <line x1="540" y1="40" x2="540" y2="280"/>
        <line x1="0" y1="160" x2="${VB_W}" y2="160"/>
      </g>
      <rect x="0" y="280" width="${VB_W}" height="200" fill="url(#floor)"/>
      <!-- big desk -->
      <rect x="220" y="340" width="380" height="20" rx="5" fill="#241a12"/>
      ${monitor(330,262,100,70)}
      <rect x="250" y="324" width="70" height="14" rx="2" fill="#cba35a"/>
      <!-- guest chairs -->
      <rect x="180" y="372" width="40" height="40" rx="10" fill="#2a3a5c"/>
      <rect x="600" y="372" width="40" height="40" rx="10" fill="#2a3a5c"/>`; },

    execsuite(){ return `
      ${defs('#24244a','#121233')}
      <rect width="${VB_W}" height="${VB_H}" fill="url(#bgGrad)"/>
      <rect x="0" y="36" width="${VB_W}" height="250" fill="#0c1430"/>
      ${skyline(0,90,VB_W,196,'#3a3f78')}
      <rect x="0" y="36" width="${VB_W}" height="250" fill="none" stroke="#2e2f5c" stroke-width="6"/>
      <rect x="0" y="286" width="${VB_W}" height="194" fill="url(#floor)"/>
      <!-- art piece -->
      <rect x="60" y="120" width="90" height="120" rx="4" fill="#0f1a30" stroke="#f4b740" stroke-width="3"/>
      <path d="M 75 220 L 100 150 L 120 200 L 135 170" stroke="#16e0c8" stroke-width="3" fill="none"/>
      <!-- executive desk -->
      <rect x="240" y="346" width="360" height="22" rx="6" fill="#1d1410"/>
      ${monitor(360,266,100,72)}
      <rect x="270" y="330" width="84" height="14" rx="2" fill="#e6c878"/>
      <!-- decanter -->
      <rect x="560" y="320" width="20" height="26" rx="4" fill="#16e0c8" opacity="0.5"/>`; },

    boardroom(){ return `
      ${defs('#1f2c4e','#0e1b36')}
      <rect width="${VB_W}" height="${VB_H}" fill="url(#bgGrad)"/>
      <rect x="0" y="30" width="${VB_W}" height="210" fill="#0b1d33"/>
      ${skyline(0,60,VB_W,180,'#39568a')}
      <rect x="0" y="240" width="${VB_W}" height="240" fill="url(#floor)"/>
      <!-- long boardroom table -->
      <ellipse cx="400" cy="400" rx="320" ry="70" fill="#241a12"/>
      <ellipse cx="400" cy="392" rx="320" ry="70" fill="#33261a"/>
      <!-- chairs around -->
      <g fill="#1f2c46">
        <rect x="120" y="318" width="40" height="48" rx="12"/>
        <rect x="220" y="306" width="40" height="48" rx="12"/>
        <rect x="540" y="306" width="40" height="48" rx="12"/>
        <rect x="640" y="318" width="40" height="48" rx="12"/>
      </g>
      <!-- presentation screen -->
      <rect x="300" y="70" width="200" height="120" rx="6" fill="#0a0f1c" stroke="#f4b740" stroke-width="2"/>
      <g font-family="monospace" font-size="9" fill="#f4b740">
        <text x="316" y="100">FY SECURITY REVIEW</text>
        <text x="316" y="120" fill="#16e0c8">risk ▼ 38%   incidents ▼ 52%</text>
        <text x="316" y="140" fill="#3ddc84">posture: STRONG</text>
        <text x="316" y="172" fill="#9fb3d6">— recommended: approve</text>
      </g>`; }
  };

  /* avatar placement per scene */
  const avatarPos = {
    cubicle:   {x:400, y:368, s:1.0},
    openfloor: {x:400, y:360, s:1.0},
    seniordesk:{x:430, y:362, s:1.05},
    labdesk:   {x:430, y:368, s:1.05},
    teamroom:  {x:380, y:362, s:1.1},
    office:    {x:285, y:368, s:1.15},
    corner:    {x:410, y:372, s:1.2},
    execsuite: {x:420, y:372, s:1.25},
    boardroom: {x:400, y:320, s:1.2}
  };

  const sceneLabel = {
    cubicle:'Cubicle • Floor 2', openfloor:'Open Floor • SOC Bay',
    seniordesk:'Senior Desk • Window Seat', labdesk:'Security Lab',
    teamroom:'Team Room', office:'Private Office',
    corner:'Corner Office', execsuite:'Executive Suite', boardroom:'The Boardroom'
  };

  function render(state){
    const rank = RANKS[state.rank];
    const sceneId = rank ? rank.scene : 'cubicle';
    const build = builders[sceneId] || builders.cubicle;
    const pos = avatarPos[sceneId] || avatarPos.cubicle;
    const out = outfitFor(rank ? rank.band : 'entry');
    const mood = moodFor(state.perf);
    const inner = build() + avatar(pos.x, pos.y, pos.s, out, mood);
    const svg = `<svg viewBox="0 0 ${VB_W} ${VB_H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    return { svg, label: sceneLabel[sceneId] || '' };
  }

  return { render };
})();
