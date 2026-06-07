/* ============================================================
   MADE IT — game data
   Career ladder (with branching), scenario library, achievements.
   Everything here is data-driven so it's easy to extend: add more
   objects to SCENARIOS and they automatically enter rotation for the
   matching career band.
   ============================================================ */

const SKILLS = ['technical', 'leadership', 'business', 'communication'];
const SKILL_LABEL = {
  technical: 'Technical', leadership: 'Leadership',
  business: 'Business', communication: 'Comms'
};

/* ----- Company flavor (picked once per playthrough) ----- */
const COMPANIES = [
  ['Vantage Bank', 'a regional bank'],
  ['Nimbus Logistics', 'a freight & logistics giant'],
  ['Helix Health', 'a hospital network'],
  ['Orbital Retail', 'a national retailer'],
  ['Quanta Energy', 'a power utility'],
  ['Meridian Media', 'a streaming company'],
  ['Irongate Insurance', 'an insurance group'],
  ['Stratus Cloud', 'a SaaS platform'],
  ['Foundry Manufacturing', 'an industrial manufacturer'],
  ['Sterling Capital', 'a hedge fund']
];

/* ----- Career ladder -------------------------------------------------
   band drives which scenarios appear and which office scene is shown.
   req = what you need to be promoted OUT of this role.
   next = the role(s) you can be promoted INTO.
--------------------------------------------------------------------- */
const RANKS = {
  /* --- Entry technical (3 starting paths) --- */
  soc1: { title:'SOC Analyst I', band:'entry', scene:'cubicle', cat:'technical',
    salary:68, desc:'Watch the dashboards. Triage the alerts. Welcome to the trenches.',
    focus:'technical', req:{perf:55, skill:'technical', val:25, weeks:6}, next:['soc2'] },
  pentest1: { title:'Junior Penetration Tester', band:'entry', scene:'cubicle', cat:'technical',
    salary:72, desc:'Break things on purpose, write it up, do it again.',
    focus:'technical', req:{perf:55, skill:'technical', val:25, weeks:6}, next:['pentest2'] },
  eng1: { title:'Junior Security Engineer', band:'entry', scene:'cubicle', cat:'technical',
    salary:70, desc:'Patch, harden, automate. Keep the lights on, securely.',
    focus:'technical', req:{perf:55, skill:'technical', val:25, weeks:6}, next:['eng2'] },

  /* --- Mid technical --- */
  soc2: { title:'SOC Analyst II', band:'mid', scene:'openfloor', cat:'technical',
    salary:88, desc:'You own the harder escalations now, and the tier-1s look to you.',
    focus:'technical', req:{perf:58, skill:'technical', val:42, weeks:7}, next:['sanalyst'] },
  pentest2: { title:'Penetration Tester', band:'mid', scene:'openfloor', cat:'technical',
    salary:95, desc:'Full engagements, real scopes, real findings.',
    focus:'technical', req:{perf:58, skill:'technical', val:42, weeks:7}, next:['spentest'] },
  eng2: { title:'Security Engineer', band:'mid', scene:'openfloor', cat:'technical',
    salary:90, desc:'You design controls instead of just applying them.',
    focus:'technical', req:{perf:58, skill:'technical', val:42, weeks:7}, next:['seng'] },

  /* --- Senior technical (the first big fork lives here) --- */
  sanalyst: { title:'Senior Security Analyst', band:'senior', scene:'seniordesk', cat:'technical',
    salary:118, desc:'Lead incidents end-to-end. People copy your runbooks.',
    focus:'technical', req:{perf:62, skill:'technical', val:58, weeks:8}, next:['arch','lead'], forkLabel:'Your reputation has reached a crossroads. How do you want to grow?' },
  spentest: { title:'Senior Penetration Tester', band:'senior', scene:'seniordesk', cat:'technical',
    salary:135, desc:'You set the methodology and mentor the juniors.',
    focus:'technical', req:{perf:62, skill:'technical', val:58, weeks:8}, next:['arch','lead'], forkLabel:'Your reputation has reached a crossroads. How do you want to grow?' },
  seng: { title:'Senior Security Engineer', band:'senior', scene:'seniordesk', cat:'technical',
    salary:125, desc:'You architect the controls everyone else builds on.',
    focus:'technical', req:{perf:62, skill:'technical', val:58, weeks:8}, next:['arch','lead'], forkLabel:'Your reputation has reached a crossroads. How do you want to grow?' },

  /* --- Individual-contributor prestige branch --- */
  arch: { title:'Security Architect', band:'architect', scene:'labdesk', cat:'technical',
    salary:158, desc:'You draw the blueprints the whole org is judged against.',
    focus:'technical', req:{perf:66, skill:'technical', val:70, weeks:9}, next:['principal'] },
  principal: { title:'Principal Security Engineer', band:'principal', scene:'labdesk', cat:'technical',
    salary:205, desc:'Highest IC rung but one. Your call settles the hard debates.',
    focus:'technical', req:{perf:70, skill:'technical', val:80, weeks:10}, next:['fellow','director'],
    forkLabel:'You could chase the top IC rung — or finally cross into leadership.' },
  fellow: { title:'Security Fellow', band:'fellow', scene:'labdesk', cat:'technical',
    salary:255, desc:'A title the company invented to keep you. You define the field.',
    focus:'technical', req:{perf:80, skill:'technical', val:92, weeks:12}, next:[], ending:'fellow' },

  /* --- Management branch (people first, then budget) --- */
  lead: { title:'Security Team Lead', band:'lead', scene:'teamroom', cat:'people',
    salary:145, desc:'Five people, one of you. Their growth is now your job.',
    focus:'leadership', req:{perf:62, skill:'leadership', val:45, weeks:8}, next:['manager'] },
  manager: { title:'Security Manager', band:'manager', scene:'office', cat:'people',
    salary:175, desc:'You run the function. Hiring, firing, morale, delivery.',
    focus:'leadership', req:{perf:64, skill:'leadership', val:60, weeks:9}, next:['smanager'] },
  smanager: { title:'Senior Security Manager', band:'senior_manager', scene:'office', cat:'budget',
    salary:205, desc:'Now you fight for headcount and defend the budget.',
    focus:'business', req:{perf:66, skill:'business', val:55, weeks:9}, next:['director'] },
  director: { title:'Director of Security', band:'director', scene:'corner', cat:'budget',
    salary:250, desc:'Whole programs, multiple teams, real money on the line.',
    focus:'business', req:{perf:68, skill:'business', val:68, weeks:10}, next:['vp'] },
  vp: { title:'VP of Security', band:'vp', scene:'corner', cat:'executive',
    salary:320, desc:'The board knows your name now. Strategy and exposure.',
    focus:'business', req:{perf:72, skill:'communication', val:70, weeks:11}, next:['ciso'] },
  ciso: { title:'Chief Information Security Officer', band:'exec', scene:'execsuite', cat:'executive',
    salary:430, desc:'The buck stops here. Peers in the C-suite, answers to the board.',
    focus:'communication', req:{perf:80, skill:'communication', val:84, weeks:12}, next:['board'] },
  board: { title:'Board Director & CSO', band:'board', scene:'boardroom', cat:'executive',
    salary:600, desc:'You made it. A seat at the table you used to fear.',
    focus:'communication', req:null, next:[], ending:'board' }
};

const ENTRY_ROLES = [
  { id:'soc1', track:'blue', name:'SOC Analyst (Blue Team)',
    blurb:'Defense & detection. You live in the SIEM, hunt threats, and respond to incidents. The classic on-ramp.' },
  { id:'pentest1', track:'red', name:'Penetration Tester (Red Team)',
    blurb:'Offense. You break in so the bad guys can\'t. High variance, high glory, lots of reports.' },
  { id:'eng1', track:'build', name:'Security Engineer (Build)',
    blurb:'Construction. You build the controls, pipelines and guardrails the whole company relies on.' }
];

/* Scene shown per band */
function sceneForBand(band){
  return RANKS[ band ] ? RANKS[band].scene : ({
    entry:'cubicle', mid:'openfloor', senior:'seniordesk',
    architect:'labdesk', principal:'labdesk', fellow:'labdesk',
    lead:'teamroom', manager:'office', senior_manager:'office',
    director:'corner', vp:'corner', exec:'execsuite', board:'boardroom'
  }[band] || 'cubicle');
}

/* ============================================================
   SCENARIO LIBRARY
   fx keys: perf, technical, leadership, business, communication, stress, money($)
   ============================================================ */
const SCENARIOS = [

/* ---------------- TECHNICAL ---------------- */
/* track: 'blue' (SOC/defence), 'red' (offensive), 'build' (engineering), 'any' (cross-cutting)
   tier: 1 entry, 2 mid, 3 senior, 4 architect/principal */

/* --- BLUE TEAM: detection & response --- */
{ id:'bl_phish', cats:['technical'], track:'blue', tier:1, type:'Alert', title:'A flood of look-alike login emails',
  text:'Staff are reporting emails that look exactly like your company\u2019s login page, asking them to \u201Creconfirm\u201D their password. A few admit they already entered it. This is a classic phishing wave \u2014 attackers harvesting passwords to walk straight in the front door.',
  choices:[
    { t:'Pull the malicious sender from everyone\u2019s inboxes, force a password reset for anyone who clicked, and block the fake site.', req:{technical:30}, fx:{perf:9, technical:5, stress:3}, res:'You contain the wave at the source and shut the door before the harvested passwords get used. Fast and complete.', failRes:'You reset the obvious victims but miss the inbox-wide cleanup; new clicks keep rolling in for another day.' },
    { t:'Reset passwords for the handful who admit they clicked and warn the company.', fx:{perf:4, technical:2, communication:2, stress:1}, res:'You catch the known victims and raise awareness. Solid, though some quieter clickers may slip through.' },
    { t:'Send a company-wide \u201Cdon\u2019t click suspicious links\u201D reminder and move on.', fx:{perf:-8, stress:-1}, res:'A reminder doesn\u2019t un-steal the passwords already typed in. Attackers log in that night.' }
  ]},
{ id:'bl_triage', cats:['technical'], track:'blue', tier:1, type:'Triage', title:'400 alerts, one of them real',
  text:'Your monitoring dashboard logged 400 alerts overnight, almost all false alarms from one noisy rule. Somewhere in that haystack there may be one real needle, and your shift is judged on what you miss.',
  choices:[
    { t:'Tune the noisy rule to kill the false alarms, then investigate the handful that remain.', req:{technical:28}, fx:{perf:8, technical:6, stress:-2}, res:'The queue drops to 14 real items \u2014 one is an attacker testing stolen credentials. The needle was hiding in the noise.', failRes:'Your rule change is too broad and silences a real detection alongside the noise. The gap shows up later.' },
    { t:'Work the whole queue by hand so nothing is missed.', fx:{perf:3, technical:2, stress:7}, res:'Nothing slips past you, but it devours your shift and clearly won\u2019t scale to tomorrow\u2019s 400.' },
    { t:'Mark them all \u201Clikely false positive\u201D to clear the board.', fx:{perf:-9, stress:-2}, res:'You also dismissed the one that mattered. Bulk-closing alerts is how real intrusions go unnoticed for months.' }
  ]},
{ id:'bl_signin', cats:['technical'], track:'blue', tier:1, type:'Investigation', title:'Logged in from two countries at once',
  text:'An employee\u2019s account just signed in from your city and, eight minutes later, from a data centre overseas. Nobody teleports \u2014 this \u201Cimpossible travel\u201D usually means an attacker is using a stolen password (ATT&CK calls it \u201CValid Accounts\u201D).',
  choices:[
    { t:'Suspend the session, reset the account, and check what the foreign login already accessed.', req:{technical:30}, fx:{perf:8, technical:6, stress:3}, res:'You lock it down and confirm the intruder only had minutes \u2014 not enough to do damage. Quick instincts win.', failRes:'You reset the password but don\u2019t review the activity, missing the mail rule the attacker quietly set up first.' },
    { t:'Call the employee to confirm it wasn\u2019t them, then reset if not.', fx:{perf:5, communication:2, technical:2, stress:2}, res:'A quick phone call confirms it\u2019s an intruder and you act. A few minutes slower, but no false alarm either.' },
    { t:'Assume they\u2019re travelling with a VPN and close the alert.', fx:{perf:-9, stress:1}, res:'It wasn\u2019t a VPN. By morning the attacker has read months of email. Assumptions are how footholds become breaches.' }
  ]},
{ id:'bl_ransom', cats:['technical'], track:'blue', tier:2, type:'Incident', title:'Files are locking up across a server',
  text:'Files on a shared server are being scrambled in real time and a ransom note just appeared \u2014 ransomware, the same play that shut down Colonial Pipeline. It\u2019s spreading machine to machine and every second counts.',
  choices:[
    { t:'Isolate the infected machines from the network now, identify the spread method, and preserve evidence.', req:{technical:42}, fx:{perf:9, technical:7, stress:6}, res:'You sever the spread within minutes \u2014 a dozen machines hit instead of the whole site \u2014 and keep the forensics intact.', failRes:'You isolate the wrong segment first; the encryption jumps to a backup server before you contain it. Costly minutes lost.' },
    { t:'Disconnect the obviously-infected server and call in senior responders.', fx:{perf:5, technical:3, communication:2, stress:5}, res:'You stop the most visible spread and escalate. Help arrives to finish containment \u2014 measured and safe.' },
    { t:'Start restoring from backup while it\u2019s still spreading.', fx:{perf:-10, stress:6}, res:'Restoring into a live infection just re-encrypts your clean data. Contain first, restore second \u2014 always.' }
  ]},
{ id:'bl_c2', cats:['technical'], track:'blue', tier:2, type:'Detection', title:'A laptop is phoning home on a schedule',
  text:'One laptop is quietly contacting the same unfamiliar server every 60 seconds, around the clock. That regular \u201Cheartbeat\u201D is the signature of attacker remote-control software (like Cobalt Strike) waiting for orders \u2014 ATT&CK calls it Command and Control.',
  choices:[
    { t:'Quietly isolate the host, capture the malware for analysis, and hunt for the same beacon elsewhere.', req:{technical:42}, fx:{perf:9, technical:7, stress:4}, res:'You bag the implant and find it on two more machines \u2014 catching the whole foothold instead of one symptom.', failRes:'You move loudly and tip off the attacker, who burns the access and digs in deeper before you finish. Harder now.' },
    { t:'Block the suspicious server at the firewall and reimage the laptop.', fx:{perf:5, technical:3, stress:2}, res:'You cut the attacker\u2019s line and clean the machine. The immediate threat is gone, even if you didn\u2019t scope the full picture.' },
    { t:'Add the address to a watchlist and keep monitoring.', fx:{perf:-8, stress:2}, res:'\u201CWatching\u201D an active backdoor just gives the attacker more time. They escalate while you take notes.' }
  ]},
{ id:'bl_log4shell', cats:['technical'], track:'blue', tier:2, type:'Crisis', title:'A flaw in software you all use, exploited now',
  text:'The whole industry is scrambling: a critical flaw in a widely-used software component (think Log4Shell) is being mass-exploited tonight, and it\u2019s buried inside dozens of your applications. There\u2019s no clean fix yet.',
  choices:[
    { t:'Deploy detection for the exploit and actively hunt for successful attempts while engineering mitigates.', req:{technical:45}, fx:{perf:9, technical:7, stress:6}, res:'You spot two exploit attempts and confirm neither landed \u2014 turning blind panic into a controlled, evidenced response.', failRes:'Your detection is rushed and full of gaps; you can\u2019t actually tell whether you were hit, and the uncertainty haunts the review.' },
    { t:'Apply the recommended temporary mitigations to the internet-facing apps first.', fx:{perf:6, technical:4, stress:4}, res:'You shrink the exposure where it matters most while a full fix is prepared. Pragmatic triage under fire.' },
    { t:'Wait for vendors to ship patched versions.', fx:{perf:-9, stress:3}, res:'Waiting during mass exploitation is a gamble you lose. The scanners find your exposed apps before the patch does.' }
  ]},
{ id:'bl_hunt', cats:['technical'], track:'blue', tier:3, type:'Threat Hunt', title:'Quiet network, nagging feeling',
  text:'No alarms are firing, but a peer org in your industry was just breached by a stealthy group that lives off the land (using normal admin tools so nothing looks malicious). Your gut says: assume they\u2019re here too and go looking.',
  choices:[
    { t:'Run a hypothesis-driven hunt based on that group\u2019s known techniques across your logs and endpoints.', req:{technical:52}, fx:{perf:9, technical:7, communication:2, stress:4}, res:'Your hunt surfaces a dormant foothold no alert would ever have caught. Proactive hunting is what separates good from great.', failRes:'Your hunt is unfocused \u2014 you trawl everything, find nothing conclusive, and burn a week you can\u2019t fully justify.' },
    { t:'Add detections for that group\u2019s known indicators and watch closely.', fx:{perf:5, technical:3, stress:2}, res:'You tune your sensors to the threat and stay alert. Reactive, but a sensible use of the warning.' },
    { t:'No alerts means no problem \u2014 stay focused on the queue.', fx:{perf:-6, technical:-1, stress:1}, res:'The stealthiest attackers never trip an alert by design. \u201CNo news\u201D was exactly what they were counting on.' }
  ]},
{ id:'bl_exfil', cats:['technical'], track:'blue', tier:3, type:'Insider', title:'A trusted account is hoarding data',
  text:'A long-tenured employee\u2019s account is suddenly downloading huge volumes of customer records and copying them to personal cloud storage \u2014 late at night. It could be data theft on the way out the door, or it could be innocent. Get it wrong and you either miss a breach or falsely accuse a colleague.',
  choices:[
    { t:'Quietly preserve the evidence, loop in HR and legal, and build the picture before anyone is confronted.', req:{technical:50}, fx:{perf:9, technical:6, communication:3, stress:4}, res:'You handle a delicate insider case by the book \u2014 evidence first, accusations never \u2014 and it holds up when it matters.', failRes:'You jump to conclusions and confront them directly; if you\u2019re wrong it\u2019s a disaster, and even if right you\u2019ve tainted the evidence.' },
    { t:'Restrict the account\u2019s access to stop further downloads and flag it to your manager.', fx:{perf:5, technical:3, stress:2}, res:'You stop the bleeding and escalate appropriately. You may have tipped them off, but the data stops moving.' },
    { t:'Confront the employee directly to ask what they\u2019re doing.', fx:{perf:-7, communication:-2, stress:3}, res:'You tipped your hand and trampled the evidence. Insider cases are won with patience and process, not ambushes.' }
  ]},
{ id:'bl_tabletop', cats:['technical'], track:'blue', tier:3, type:'Preparedness', title:'Nobody knows who does what in a crisis',
  text:'Your last small incident was chaos \u2014 people tripping over each other, no clear decision-maker. A major one would be a catastrophe. You could run a tabletop exercise: a realistic walk-through where the team rehearses a breach before a real one tests them.',
  choices:[
    { t:'Design and run a realistic tabletop based on a likely attack, then turn the gaps it exposes into a fixed plan.', req:{technical:48}, fx:{perf:8, technical:5, leadership:3, communication:3, stress:-2}, res:'The exercise surfaces a dozen gaps in a safe setting. When the real thing hits months later, the team moves like clockwork.', failRes:'Your scenario is unrealistic and the session drifts; people leave unconvinced and the gaps stay hidden until a real crisis.' },
    { t:'Write a one-page incident checklist and circulate it.', fx:{perf:5, communication:3, technical:1}, res:'A clear checklist beats nothing and gives people a spine to follow under pressure. A solid first step.' },
    { t:'Assume the team will rise to the occasion when it counts.', fx:{perf:-6, leadership:-2, stress:2}, res:'Teams don\u2019t rise to the occasion; they fall to their level of preparation. The next incident proves it.' }
  ]},

/* --- RED TEAM: offensive / pen testing --- */
{ id:'rd_scope', cats:['technical'], track:'red', tier:1, type:'Engagement', title:'The client wants you to \u201Cjust test everything\u201D',
  text:'You\u2019re kicking off a penetration test \u2014 an authorized, simulated attack to find weaknesses before real attackers do. The client waves a hand and says \u201Cjust hack whatever you can.\u201D But with no written scope, you could break the law or take down their live shop.',
  choices:[
    { t:'Insist on written rules of engagement: what\u2019s in scope, what\u2019s off-limits, and an emergency contact.', req:{technical:28}, fx:{perf:8, technical:5, communication:3}, res:'A clear scope protects the client, protects you legally, and makes the whole test cleaner. Professionals never skip this.', failRes:'You draft a vague scope to seem easy-going; mid-test you hit a grey area nobody agreed on and the trust evaporates.' },
    { t:'Agree verbally and stick to obviously-safe targets.', fx:{perf:4, technical:2, communication:1, stress:1}, res:'You proceed carefully and avoid disaster, but a handshake scope leaves you exposed if anything goes sideways.' },
    { t:'Take them at their word and start hammering everything.', fx:{perf:-9, communication:-2, stress:2}, res:'You knock their live checkout offline and brush against systems they don\u2019t even own. \u201CThey said anything\u201D is not a legal defence.' }
  ]},
{ id:'rd_webapp', cats:['technical'], track:'red', tier:1, type:'Web App', title:'You can read other users\u2019 orders',
  text:'Testing the client\u2019s web shop, you change a number in the address bar and suddenly you\u2019re looking at another customer\u2019s order and home address. It\u2019s a textbook access-control flaw (ATT&CK-style: abusing trusted access). How you prove and report it matters.',
  choices:[
    { t:'Document it cleanly with one safe proof, note the impact, and stop \u2014 don\u2019t go trawling real customer data.', req:{technical:30}, fx:{perf:8, technical:6, communication:2}, res:'You prove the flaw with a single screenshot and restraint. A great finding shows impact without abusing real people\u2019s data.', failRes:'You pull dozens of real customer records to \u201Cprove severity\u201D and now you\u2019re the one mishandling personal data. Sloppy.' },
    { t:'Note the flaw and move on to find more issues.', fx:{perf:5, technical:3, stress:1}, res:'You log it and keep hunting. Efficient, though a crisper impact write-up would land harder with the client.' },
    { t:'Download a big sample of customer data to show how bad it is.', fx:{perf:-7, communication:-2, stress:2}, res:'You just exfiltrated real personal data during a test. Proving a point by committing the harm is exactly backwards.' }
  ]},
{ id:'rd_crit', cats:['technical'], track:'red', tier:1, type:'Disclosure', title:'You found a way straight to the crown jewels',
  text:'Two hours into the test you stumble onto a flaw that would let anyone take over the client\u2019s entire customer database \u2014 right now, today, even outside your test. Real attackers could be finding the same thing.',
  choices:[
    { t:'Pause and alert the client immediately about the critical, actively-dangerous flaw, then continue.', req:{technical:30}, fx:{perf:9, technical:5, communication:4, stress:2}, res:'You don\u2019t sit on a live, exploitable hole for two weeks to pad your report. Flagging it now is the only ethical call.', failRes:'You try to alert them but bury it in jargon they don\u2019t grasp; the urgency is lost and the hole stays open for days.' },
    { t:'Note it as your headline finding and keep testing.', fx:{perf:3, technical:3, stress:2}, res:'It\u2019ll be a great report \u2014 but a critical, exploitable-today flaw really shouldn\u2019t wait for the write-up.' },
    { t:'Keep it quiet to make a dramatic reveal at the final readout.', fx:{perf:-10, communication:-3, stress:2}, res:'You gambled the client\u2019s data for a dramatic moment. If they\u2019d been breached in the meantime, that\u2019s on you.' }
  ]},
{ id:'rd_outage', cats:['technical'], track:'red', tier:2, type:'Engagement', title:'Your test just took their system down',
  text:'A scan you launched hit a fragile server harder than expected and knocked the client\u2019s internal app offline. Staff can\u2019t work. The clock is running and so is the client\u2019s patience.',
  choices:[
    { t:'Stop testing immediately, call the emergency contact, own it, and help them recover.', req:{technical:40}, fx:{perf:8, technical:4, communication:5, stress:4}, res:'Fast, honest ownership turns a screw-up into a trust-builder. They recover quickly and respect that you didn\u2019t hide.', failRes:'You scramble to fix it quietly first; the outage drags, they find out anyway, and the cover-up stings worse than the crash.' },
    { t:'Pause that test, quietly confirm it recovers, then disclose in your daily check-in.', fx:{perf:4, technical:3, communication:1, stress:3}, res:'It comes back on its own and you report it promptly. Honest, if a touch slower than picking up the phone.' },
    { t:'Carry on \u2014 fragile systems failing is kind of the point.', fx:{perf:-9, communication:-3, stress:3}, res:'Causing and ignoring an outage during a test torches the relationship. Finding weakness doesn\u2019t mean abandoning care.' }
  ]},
{ id:'rd_social', cats:['technical'], track:'red', tier:2, type:'Social Eng', title:'Phishing your own client\u2019s staff',
  text:'The engagement includes a phishing simulation \u2014 sending fake-but-harmless scam emails to the client\u2019s employees to test who clicks. One theme you\u2019re considering (fake layoff notices) would work brilliantly but could genuinely upset people.',
  choices:[
    { t:'Pick a realistic-but-humane pretext, agree it with the client, and frame results as learning, not gotchas.', req:{technical:40}, fx:{perf:8, technical:4, communication:4, leadership:2}, res:'You get honest results without traumatizing anyone or breeding resentment toward security. Ethical and effective.', failRes:'Your pretext is fine but you name-and-shame the clickers in the report; morale craters and people now hate security.' },
    { t:'Use a generic delivery-notification lure that nobody could take personally.', fx:{perf:5, technical:3, communication:1}, res:'Safe and uncontroversial. The click-rate data is useful, even if a sharper lure might have taught more.' },
    { t:'Use the layoff scare \u2014 the higher the click-rate, the better the test.', fx:{perf:-7, communication:-3, stress:3}, res:'You got a great click-rate and a wave of genuinely distressed staff. Effective phishing tests don\u2019t require real cruelty.' }
  ]},
{ id:'rd_oob', cats:['technical'], track:'red', tier:2, type:'Ethics', title:'You found something you weren\u2019t looking for',
  text:'While testing, you stumble onto evidence the client may have already been breached months ago \u2014 by someone real \u2014 and possibly some genuinely illegal content on a server. This is well outside your scope.',
  choices:[
    { t:'Stop, preserve what you saw without digging further, and escalate to the client and legal channels carefully.', req:{technical:42}, fx:{perf:9, technical:5, communication:4, stress:5}, res:'You handle a genuinely thorny discovery with exactly the right restraint and escalation. This is judgment, not just hacking.', failRes:'You keep poking to confirm your hunch and end up tampering with what may be evidence \u2014 a legal mess for everyone, you included.' },
    { t:'Note it factually in your findings and raise it at the next check-in.', fx:{perf:5, technical:2, communication:2, stress:3}, res:'You flag it through the proper channel without overstepping. Measured, if a fraction slower than picking up the phone.' },
    { t:'Investigate it yourself to get the full story first.', fx:{perf:-8, communication:-2, stress:4}, res:'Chasing a real breach (and maybe a crime) outside your scope turns a finding into your liability. Stay in your lane.' }
  ]},
{ id:'rd_exploit', cats:['technical'], track:'red', tier:3, type:'Tradecraft', title:'Off-the-shelf tools aren\u2019t getting in',
  text:'The target is well-defended and the usual public tools bounce right off. You suspect a custom exploit could slip past their defenses \u2014 but writing one is risky, time-consuming, and could destabilize their systems if it goes wrong.',
  choices:[
    { t:'Develop a careful, tested custom exploit in a lab first, then use it surgically against the live target.', req:{technical:54}, fx:{perf:9, technical:7, stress:4}, res:'Your bespoke exploit proves a flaw their defenses (and their off-the-shelf scanners) completely missed. Elite, responsible tradecraft.', failRes:'You rush the exploit straight at production without lab-testing; it misfires, crashes a service, and proves only that you skipped a step.' },
    { t:'Document the defenses as effective against common attacks and focus elsewhere.', fx:{perf:5, technical:3, communication:2}, res:'\u201CYour defenses stopped the standard playbook\u201D is itself a valuable, honest finding. You spend your time where it pays off.' },
    { t:'Throw every public exploit at it and hope something sticks.', fx:{perf:-6, technical:-1, stress:3}, res:'Spraying noisy public exploits at a hardened target just lights up their alerts and wastes the engagement.' }
  ]},
{ id:'rd_report', cats:['technical'], track:'red', tier:3, type:'Disclosure', title:'The client wants the bad findings softened',
  text:'Your report lists several serious flaws. The client\u2019s manager \u2014 whose team built the flawed systems \u2014 quietly asks you to \u201Ctone it down\u201D so it looks better to their executives. Your integrity and your repeat business are both on the line.',
  choices:[
    { t:'Keep the findings accurate, but reframe them constructively \u2014 clear risks plus a credible path to fix.', req:{technical:50}, fx:{perf:9, technical:4, communication:5}, res:'You refuse to fake the facts but make them usable, so the manager gets a roadmap instead of a beating. Integrity and tact.', failRes:'You try to please everyone and blur the severity; executives later get blindsided by a \u201Cminor\u201D issue and trust in you collapses.' },
    { t:'Present the facts plainly and let the client decide what to share upward.', fx:{perf:5, communication:2, technical:2, stress:2}, res:'You hold the line on accuracy and stay out of their politics. Honest and clean, if a little blunt.' },
    { t:'Soften the wording to keep the client happy.', fx:{perf:-9, technical:-2, communication:-2, stress:3}, res:'A pen-test report you let someone edit for vanity is worthless \u2014 and when a softened flaw gets exploited, your name is on it.' }
  ]},
{ id:'rd_purple', cats:['technical'], track:'red', tier:3, type:'Purple Team', title:'The defenders never even saw you',
  text:'You walked through the client\u2019s network and their defenders (the blue team) detected almost none of it. You could write a scathing report \u2014 or you could sit down with them and turn your attack into their education (a \u201Cpurple team\u201D approach).',
  choices:[
    { t:'Run a collaborative replay with the defenders, building detections together for each step you took.', req:{technical:50}, fx:{perf:9, technical:6, communication:4, leadership:2}, res:'They leave able to catch the very attacks they missed. The point of red teaming is a stronger blue team, not a humiliated one.', failRes:'Your replay turns into a lecture that talks down to them; they get defensive and learn far less than they could have.' },
    { t:'Deliver a thorough written report mapping each step to a missing detection.', fx:{perf:5, technical:4, communication:2}, res:'A detailed, mapped report gives them a clear to-do list. Useful, even without the live collaboration.' },
    { t:'Write up how thoroughly you owned them and let the findings sting.', fx:{perf:-6, communication:-3, leadership:-1, stress:2}, res:'A gloating report makes you look clever and the defenders dig in. You proved a point and improved nothing.' }
  ]},

/* --- BUILD: security engineering --- */
{ id:'bd_secrets', cats:['technical'], track:'build', tier:1, type:'Code', title:'A password is hard-coded in the app',
  text:'Reviewing a teammate\u2019s code before it ships, you spot a database password typed directly into the source \u2014 and that code is about to be published where anyone can read it. Leaked secrets like this are behind countless breaches.',
  choices:[
    { t:'Block the release, move the secret into a proper secrets vault, and add an automated scan so it can\u2019t recur.', req:{technical:30}, fx:{perf:9, technical:6, stress:2}, res:'You fix this instance and the whole class of problem \u2014 from now on, leaked secrets get caught automatically. Engineering at its best.', failRes:'You pull the secret out but skip the automated guard; a different secret leaks the same way two sprints later.' },
    { t:'Ask the teammate to move the password into a config file before release.', fx:{perf:5, technical:3, communication:1}, res:'The secret\u2019s out of the public code. A vault would be sturdier, but you stopped the leak.' },
    { t:'Let it ship and rotate the password afterward.', fx:{perf:-8, technical:-1, stress:1}, res:'\u201CAfterward\u201D is too late \u2014 bots scrape new code for secrets within minutes of it going public.' }
  ]},
{ id:'bd_s3', cats:['technical'], track:'build', tier:1, type:'Cloud', title:'A storage bucket is open to the world',
  text:'You discover a cloud storage bucket holding internal files is set to \u201Cpublic,\u201D readable by anyone on the internet. Misconfigured buckets like this have leaked data at some of the biggest companies in the world.',
  choices:[
    { t:'Lock it down now, audit who could have accessed it, and scan for any other public buckets.', req:{technical:30}, fx:{perf:8, technical:6, stress:2}, res:'You close this hole and sweep for siblings \u2014 finding one more. One exposed bucket usually means others.', failRes:'You fix the one you found but don\u2019t sweep; a second public bucket surfaces in a researcher\u2019s email next month.' },
    { t:'Set the bucket to private and note it for the owning team.', fx:{perf:5, technical:3, stress:1}, res:'The data\u2019s no longer exposed and the team\u2019s aware. A clean, contained fix.' },
    { t:'Message the owning team to fix it when convenient.', fx:{perf:-7, stress:1}, res:'\u201CWhen convenient\u201D is a lifetime online. Someone scrapes the open bucket before the team gets to it.' }
  ]},
{ id:'bd_iam', cats:['technical'], track:'build', tier:1, type:'Access', title:'Everyone\u2019s an admin',
  text:'You notice almost every engineer has full administrator rights \u201Cto save time.\u201D If any one of their laptops is compromised, an attacker instantly owns everything. The principle of least privilege says people should only have the access they actually need.',
  choices:[
    { t:'Map who truly needs what, then roll out least-privilege access with a smooth request process.', req:{technical:32}, fx:{perf:8, technical:6, communication:2, stress:2}, res:'You shrink the blast radius dramatically while keeping engineers productive. Done well, security people barely notice the change.', failRes:'You yank admin rights overnight with no easy way to request access; work grinds to a halt and engineers revolt.' },
    { t:'Remove admin from the few accounts that clearly don\u2019t need it.', fx:{perf:5, technical:3, stress:1}, res:'A sensible start that trims the riskiest excess without a big fight. The rest can follow later.' },
    { t:'Leave it \u2014 changing it would slow everyone down.', fx:{perf:-6, technical:-1, stress:1}, res:'Convenience for all is convenience for the attacker too. The first phished laptop becomes a company-wide compromise.' }
  ]},
{ id:'bd_pipeline', cats:['technical'], track:'build', tier:2, type:'Supply Chain', title:'Your software build process is wide open',
  text:'Your build pipeline \u2014 the automated system that assembles and ships your software \u2014 can be modified by almost anyone, with no review. This is exactly the weakness behind the SolarWinds attack, where intruders poisoned software at the source and it shipped to thousands.',
  choices:[
    { t:'Lock down the pipeline: signed builds, mandatory review, and a record of exactly what went into each release.', req:{technical:44}, fx:{perf:9, technical:7, business:2, stress:3}, res:'You make tampering detectable and traceable \u2014 turning your build process from a soft target into a hard one. Real supply-chain defense.', failRes:'You bolt on controls without buy-in and break the pipeline for a day; engineers route around your half-built guardrails.' },
    { t:'Require code review and restrict who can change the pipeline.', fx:{perf:5, technical:4, stress:2}, res:'Tighter access and review close the most obvious door. Not bulletproof, but far harder to slip poison through.' },
    { t:'Trust the team \u2014 they\u2019re careful.', fx:{perf:-7, technical:-1, stress:2}, res:'SolarWinds trusted their team too. An unguarded build pipeline is one compromised account away from disaster.' }
  ]},
{ id:'bd_mfa', cats:['technical'], track:'build', tier:2, type:'Identity', title:'Rolling out a second login step',
  text:'Most break-ins start with a stolen password. Multi-factor authentication \u2014 a second step like a phone tap \u2014 stops the vast majority of them. But you have to roll it out to thousands of people who will grumble about the friction.',
  choices:[
    { t:'Phase it in with clear comms, easy enrollment, and exceptions handled gracefully \u2014 starting with the riskiest accounts.', req:{technical:40}, fx:{perf:8, technical:5, communication:4, stress:2}, res:'You close the single biggest door attackers use, and the thoughtful rollout means people grumble for a week, then forget it was ever new.', failRes:'You force it on everyone overnight with a clunky tool; lockouts flood the help desk and people associate security with pain.' },
    { t:'Mandate it for admins and sensitive systems first.', fx:{perf:6, technical:4, stress:1}, res:'You protect the highest-value accounts immediately \u2014 the best bang for the buck while the broad rollout waits.' },
    { t:'Make it optional so nobody complains.', fx:{perf:-6, technical:-1, stress:-1}, res:'Optional security is the security almost nobody turns on. The accounts that skip it are the ones that get popped.' }
  ]},
{ id:'bd_dep', cats:['technical'], track:'build', tier:2, type:'Vulnerability', title:'A flaw buried in code you didn\u2019t write',
  text:'A critical flaw drops in an open-source component your apps quietly depend on (the Log4Shell scenario, from the builder\u2019s side). The catch: nobody has a clear list of which of your apps even use it.',
  choices:[
    { t:'Build an inventory of what uses the component (an SBOM), patch by risk, and keep the inventory for next time.', req:{technical:44}, fx:{perf:9, technical:7, business:2, stress:4}, res:'You fix today\u2019s fire and make the next one a five-minute lookup instead of a week of panic. Knowing what you run is half the battle.', failRes:'You patch the apps you can think of from memory and miss two; the gap surfaces in the post-incident review.' },
    { t:'Patch the internet-facing apps you know use it, fast.', fx:{perf:6, technical:4, stress:3}, res:'You cover the most exposed, most likely targets first. Solid triage, even if the long tail waits.' },
    { t:'Wait for each app team to sort out their own dependencies.', fx:{perf:-8, stress:2}, res:'Leaving a critical flaw to a dozen busy teams means it never fully gets fixed. Attackers only need the one app everyone forgot.' }
  ]},
{ id:'bd_guardrails', cats:['technical'], track:'build', tier:3, type:'Platform', title:'Security keeps saying no after the fact',
  text:'Engineering ships fast and your team is forever catching problems too late, playing whack-a-mole. You could instead build guardrails into the platform so the secure way is the default, automatic path \u2014 mistakes become hard to make in the first place.',
  choices:[
    { t:'Invest in paved-road defaults: secure templates and automated checks built into how everyone ships.', req:{technical:52}, fx:{perf:9, technical:7, business:3, stress:-2}, res:'Engineers get secure-by-default for free and ship faster; your team stops firefighting. Prevention scales in a way policing never will.', failRes:'You build rigid guardrails without consulting engineers; they\u2019re too restrictive, get bypassed, and your effort is wasted.' },
    { t:'Add automated security checks to the release pipeline.', fx:{perf:6, technical:4, stress:1}, res:'Catching issues automatically at release beats catching them by hand in production. A strong, practical step.' },
    { t:'Keep reviewing things manually \u2014 it works.', fx:{perf:-5, technical:-1, stress:3}, res:'Manual review doesn\u2019t scale with the company. You stay the bottleneck, and the things you miss keep shipping.' }
  ]},
{ id:'bd_logging', cats:['technical'], track:'build', tier:3, type:'Detection Eng', title:'When something breaks, you\u2019re blind',
  text:'During the last incident, the defenders had almost no useful data \u2014 critical systems simply weren\u2019t recording what happened. As the engineer, you can build the telemetry (the logging and monitoring) that future investigations will live or die by.',
  choices:[
    { t:'Design and roll out consistent, security-relevant logging across key systems, tuned to real attack techniques.', req:{technical:52}, fx:{perf:9, technical:7, communication:2, stress:3}, res:'Next incident, the responders actually have the breadcrumbs they need. You can\u2019t defend what you can\u2019t see \u2014 and now you can see.', failRes:'You log everything indiscriminately; the cost balloons and the real signals drown in noise nobody can search.' },
    { t:'Turn on solid logging for the most critical systems first.', fx:{perf:6, technical:4, stress:2}, res:'You light up the highest-value systems where visibility matters most. A focused, fundable start.' },
    { t:'Leave logging to each system\u2019s defaults.', fx:{perf:-5, technical:-1, stress:1}, res:'Default logging is built for debugging, not for catching attackers. The next investigation hits the same wall.' }
  ]},
{ id:'bd_segment', cats:['technical'], track:'build', tier:3, type:'Architecture', title:'One break-in reaches everything',
  text:'The network is flat \u2014 break into any laptop and you can reach the crown-jewel systems directly. You want to segment it so a single compromise can\u2019t spread, but it\u2019s a big, delicate change to live infrastructure.',
  choices:[
    { t:'Design phased segmentation, ringfencing the crown jewels first and proving each step before the next.', req:{technical:54}, fx:{perf:9, technical:7, business:3, stress:3}, res:'You turn \u201Cone breach owns everything\u201D into \u201Cone breach is contained.\u201D Phasing makes a daunting project safe and fundable.', failRes:'You re-architect too aggressively and sever a dependency you didn\u2019t map; a key system goes dark and confidence in the project tanks.' },
    { t:'Isolate just the most critical systems behind tighter controls.', fx:{perf:6, technical:4, stress:2}, res:'The crown jewels are now far harder to reach, even if the rest of the network waits. Real risk reduction.' },
    { t:'Leave the network flat \u2014 re-architecting is too risky.', fx:{perf:-5, business:-1, stress:1}, res:'A flat network is a gift to attackers: one foothold becomes total control. The risk you avoided touching only grew.' }
  ]},

/* --- ANY TRACK: fundamentals (tier 1) & architecture (tier 3-4) --- */
{ id:'an_rule', cats:['technical'], track:'any', tier:1, type:'Ethics', title:'A colleague asks you to bend a rule',
  text:'A friendly senior colleague asks you to quietly share your access so they can \u201Cskip the paperwork\u201D on an urgent task. It would help them out and they\u2019re clearly trustworthy \u2014 but sharing credentials breaks a basic rule for good reasons.',
  choices:[
    { t:'Politely decline and help them get their own access fast through the proper route.', req:{technical:25}, fx:{perf:7, technical:3, communication:3}, res:'You hold the line without being a jobsworth \u2014 and solve their actual problem. Shared credentials are how small favors become big breaches.', failRes:'You over-explain the policy and lecture them; they get the access elsewhere and you\u2019ve gained a reputation as the difficult one for no benefit.' },
    { t:'Ask your manager how to handle it before doing anything.', fx:{perf:4, communication:2, stress:1}, res:'Escalating an awkward ask is never wrong early in your career. Your manager backs you up.' },
    { t:'Share your login just this once \u2014 they\u2019re trustworthy.', fx:{perf:-7, technical:-2, stress:2}, res:'Now actions taken under your name aren\u2019t yours, and the rule existed precisely for the \u201Cjust this once\u201D that goes wrong.' }
  ]},
{ id:'an_password', cats:['technical'], track:'any', tier:1, type:'Hygiene', title:'The same admin password everywhere',
  text:'You discover the same simple administrator password is reused across dozens of important systems. Crack or phish it once, and an attacker owns all of them. It\u2019s one of the most common ways break-ins escalate.',
  choices:[
    { t:'Roll out unique, vaulted passwords for those accounts and enable a second login step on the critical ones.', req:{technical:30}, fx:{perf:8, technical:5, stress:2}, res:'You break the \u201Cone key fits all locks\u201D problem. Now a single stolen password no longer cascades into everything.', failRes:'You change them all at once without coordinating; two automated jobs that used the old password break and you spend the night untangling it.' },
    { t:'Change the password on the most critical systems first.', fx:{perf:5, technical:3, stress:1}, res:'You protect the highest-value systems immediately and chip away at the rest. Sensible prioritization.' },
    { t:'Note it as a risk to address later.', fx:{perf:-6, technical:-1}, res:'A reused master password is a live grenade, not a backlog item. \u201CLater\u201D is whenever the attacker decides.' }
  ]},
{ id:'an_legacy', cats:['technical'], track:'any', tier:3, type:'Risk', title:'The ancient server nobody understands',
  text:'A 15-year-old server still runs something critical, can\u2019t be safely updated, and the person who built it left long ago. Touch it wrong and the business stops; leave it and it\u2019s a soft target.',
  choices:[
    { t:'Map exactly what it does, wrap protective controls around it, and plan a careful replacement.', req:{technical:50}, fx:{perf:8, technical:6, business:3, stress:4}, res:'You de-risk the scary box without disturbing it and chart a real path off it. Methodical and respected.', failRes:'Your probing disturbs the fragile system and triggers the very outage you feared. A hard way to learn caution.' },
    { t:'Wall it off from everything it doesn\u2019t absolutely need to reach.', fx:{perf:5, technical:4, stress:2}, res:'You shrink the damage if it\u2019s ever compromised. The relic lives on, but caged.' },
    { t:'Leave it alone \u2014 if it isn\u2019t broken, don\u2019t touch it.', fx:{perf:-4, business:-1}, res:'Ignored risk is still risk, and auditors love finding an unsupported system propping up the business.' }
  ]},
{ id:'an_threatmodel', cats:['technical'], track:'any', tier:3, type:'Design', title:'A flagship product, designed without security',
  text:'The company\u2019s new flagship product is racing toward launch, and security was never in the room. You can run a threat-modeling session \u2014 systematically asking \u201Chow could this be attacked?\u201D \u2014 before it ships, or let it go and hope.',
  choices:[
    { t:'Facilitate a focused threat-modeling workshop with the product team and turn the top risks into fixes before launch.', req:{technical:52}, fx:{perf:9, technical:6, communication:3, business:2}, res:'You catch design flaws now, when they\u2019re cheap to fix, instead of after launch when they\u2019re a breach. Security earns a seat at the table.', failRes:'Your session is abstract and academic; the product team tunes out and ships with the same flaws you failed to make real to them.' },
    { t:'Review the riskiest single component and flag its issues.', fx:{perf:6, technical:4, stress:1}, res:'You can\u2019t cover everything pre-launch, but securing the riskiest piece meaningfully lowers the odds of a bad day.' },
    { t:'Let it ship and review security in a later version.', fx:{perf:-6, business:-1, stress:2}, res:'Bolting security on after launch costs ten times as much \u2014 and the flaws are live in the meantime.' }
  ]},
{ id:'an_zerotrust', cats:['technical'], track:'any', tier:4, type:'Architecture', title:'\u201CInside the network\u201D no longer means safe',
  text:'Your security still assumes anyone inside the corporate network is trustworthy \u2014 a model that collapses the moment one laptop is compromised or someone works from a cafe. The modern answer is \u201Czero trust\u201D: verify every request, every time, regardless of where it comes from. It\u2019s a multi-year shift.',
  choices:[
    { t:'Set a phased zero-trust roadmap anchored on strong identity and per-request checks, sequenced by risk.', req:{technical:60}, fx:{perf:9, technical:7, business:4, communication:3, stress:3}, res:'You give the company a credible, fundable path off the crumbling \u201Ctrusted network\u201D model. Architecture that ages well.', failRes:'You chase the buzzword and try to boil the ocean at once; the program stalls under its own weight and skeptics pounce.' },
    { t:'Start with the highest-impact piece: strong identity and access checks on critical apps.', fx:{perf:6, technical:5, business:2, stress:2}, res:'You plant zero trust where it pays off first and prove the model before scaling. Pragmatic architecture.' },
    { t:'Keep trusting the internal network \u2014 it\u2019s worked so far.', fx:{perf:-6, technical:-2, business:-1, stress:1}, res:'\u201CWorked so far\u201D is survivorship bias. The flat, trusted network is exactly what turns one phish into a company-wide breach.' }
  ]},
{ id:'an_identity', cats:['technical'], track:'any', tier:4, type:'Architecture', title:'Identity is held together with tape',
  text:'Logins are scattered across a dozen disconnected systems, ex-employees\u2019 accounts linger for months, and there\u2019s no single source of truth for who can access what. Identity is now the real perimeter \u2014 and yours is a mess.',
  choices:[
    { t:'Architect unified identity: single sign-on, automatic joiner/mover/leaver, and conditional access by risk.', req:{technical:60}, fx:{perf:9, technical:7, business:4, stress:3}, res:'You make access provable, revocable, and risk-aware across the company. Get identity right and half of security follows.', failRes:'You pick an over-complex design and a migration nobody can finish; the half-built system is messier than the tape it replaced.' },
    { t:'Fix the worst gap first: automatically disable accounts the day someone leaves.', fx:{perf:6, technical:4, business:2, stress:2}, res:'Closing the lingering-access hole removes a favorite attacker (and ex-employee) entry point. A high-value first move.' },
    { t:'Keep managing identity system-by-system as you do now.', fx:{perf:-6, technical:-2, stress:2}, res:'Fragmented identity guarantees forgotten accounts and blind spots \u2014 the seams an attacker walks right through.' }
  ]},
{ id:'an_thirdparty', cats:['technical'], track:'any', tier:4, type:'Supply Chain', title:'Hundreds of vendors, no oversight',
  text:'Hundreds of outside vendors and software suppliers plug into your systems, and nobody really tracks the risk they bring. A breach at one of them (the Target and SolarWinds lesson) becomes a breach at you \u2014 and you\u2019d have no idea until it\u2019s too late.',
  choices:[
    { t:'Build a risk-tiered third-party program: know who has access to what, hold the critical ones to real standards, and monitor.', req:{technical:60}, fx:{perf:9, technical:6, business:5, communication:3, stress:4}, res:'You turn an invisible mountain of risk into something measured and managed. Most big breaches now come through a supplier \u2014 and you\u2019re ready.', failRes:'You send every vendor a giant questionnaire and drown in paper that nobody reads; real risk stays exactly where it was.' },
    { t:'Focus first on the handful of vendors with deep access to critical systems.', fx:{perf:6, technical:4, business:3, stress:2}, res:'You concentrate scrutiny where a breach would hurt most. The long tail can wait; the crown-jewel vendors can\u2019t.' },
    { t:'Trust that vendors handle their own security.', fx:{perf:-7, business:-2, stress:2}, res:'Their security is now your security, whether you manage it or not. The supplier breach arrives without warning.' }
  ]},
{ id:'an_breach_ic', cats:['technical'], track:'any', tier:3, type:'Incident', title:'You\u2019re the senior tech in a live breach',
  text:'A real intrusion is unfolding and, as the most senior technical person on shift, everyone is looking to you. Executives want answers, responders need direction, and the attacker is still active. There\u2019s no manager to hide behind tonight.',
  choices:[
    { t:'Take technical command: assign clear tasks, keep a tight evidence trail, and feed leadership steady, honest updates.', req:{technical:52}, fx:{perf:10, technical:7, communication:4, leadership:3, stress:6}, res:'Your calm coordination turns a scramble into a controlled response that ejects the attacker. This is the moment seniors are made.', failRes:'You try to personally do every technical task and the coordination collapses; responders duplicate work while the attacker moves freely.' },
    { t:'Anchor on the technical work and ask a teammate to handle exec updates.', fx:{perf:7, technical:5, communication:2, stress:5}, res:'You play to your strength and delegate the comms. The response holds together and the attacker is contained.' },
    { t:'Wait for instructions before acting.', fx:{perf:-9, stress:5}, res:'Hesitation during an active breach hands the attacker time and the room loses confidence in you. Seniority means stepping up.' }
  ]},

/* ---------------- PEOPLE ---------------- */
{ id:'p_star', cats:['people'], type:'Retention', title:'Your best person has an offer',
  text:'Your strongest analyst quietly tells you a competitor offered them more money. They like the team but feel stuck and unappreciated. You can\u2019t instantly match the salary.',
  choices:[
    { t:'Have an honest talk about their growth: map a real path, hand them a visible high-impact project, and fight for what raise you can.', req:{leadership:35}, fx:{perf:8, leadership:5, communication:3}, res:'They stay \u2014 not for the money, but because you showed them a future. Retention is built on meaning, not just pay.', failRes:'You overpromise on a path you can\u2019t actually deliver; they sense it, stay briefly, then leave anyway feeling misled.' },
    { t:'Push HR hard for the biggest counter-offer you can get.', fx:{perf:5, business:2, stress:2}, res:'The money helps and buys time, but the \u201Cstuck\u201D feeling is still there. You\u2019ve delayed the problem, not solved it.' },
    { t:'Wish them well and start hiring a replacement \u2014 everyone\u2019s replaceable.', fx:{perf:-7, leadership:-2, stress:3}, res:'Word spreads that loyalty means nothing here. Two more people quietly start job-hunting.' }
  ]},
{ id:'p_conflict', cats:['people'], type:'Conflict', title:'Two senior people at war',
  text:'Two senior members of your team can\u2019t stand each other, and the feud is splitting the group into camps. Meetings have turned icy and work is stalling.',
  choices:[
    { t:'Get them in a room, name the problem directly, and broker a concrete working agreement.', req:{leadership:40}, fx:{perf:8, leadership:6, communication:3, stress:3}, res:'Uncomfortable but effective: they agree on ground rules and the team exhales. Conflict avoided only festers.', failRes:'You wade in before you\u2019ve built the standing to mediate; the meeting blows up and now both blame you. Worse.' },
    { t:'Talk to each privately to understand their side and lower the friction.', fx:{perf:4, communication:3, leadership:1, stress:2}, res:'You bring the temperature down and gather useful context. Not resolved, but no longer combustible.' },
    { t:'Stay out of it \u2014 they\u2019re adults, they\u2019ll sort it out.', fx:{perf:-7, leadership:-3, stress:2}, res:'They don\u2019t sort it out. The camps harden and a good person resigns to escape the drama.' }
  ]},
{ id:'p_burnout', cats:['people'], type:'Wellbeing', title:'Someone is running on empty',
  text:'A reliable team member has been working brutal hours and is starting to make small mistakes. They insist they\u2019re \u201Cfine,\u201D but you can see they\u2019re burning out.',
  choices:[
    { t:'Insist they take real time off and quietly redistribute their work so they can actually unplug.', req:{leadership:30}, fx:{perf:6, leadership:5, stress:-3}, res:'They come back recharged and loyal. Protecting your people\u2019s energy is protecting your team\u2019s output.', failRes:'You force the time off but don\u2019t cover the work, so it just piles up and greets them on return \u2014 now they\u2019re stressed AND behind.' },
    { t:'Have a candid check-in and trim their workload a bit.', fx:{perf:4, communication:2, leadership:1, stress:-1}, res:'A caring conversation and a lighter week take the edge off. A good start, if not a full fix.' },
    { t:'Praise their hustle and hope they push through.', fx:{perf:-6, leadership:-2, stress:3}, res:'They burn out completely and take three weeks of sick leave. \u201CHustle culture\u201D sends the bill eventually.' }
  ]},
{ id:'p_hire', cats:['people'], type:'Hiring', title:'Brilliant jerk or solid team player?',
  text:'You have one open role and two finalists: a brilliant technician who rubs people the wrong way, and a solid-but-unspectacular candidate everyone would enjoy working with.',
  choices:[
    { t:'Hire the team player and coach their skills \u2014 attitude is harder to teach than technique.', req:{leadership:40}, fx:{perf:7, leadership:5, business:2}, res:'They grow fast in a team that lifts them, and the group\u2019s chemistry stays intact. A bet on culture that pays off.', failRes:'You pick the \u201Csafe\u201D hire but never actually invest in their growth; they plateau and you quietly wonder about the one who got away.' },
    { t:'Hire the brilliant technician for the raw capability.', fx:{perf:5, technical:2, stress:2}, res:'The output is real and immediate \u2014 but you\u2019ll be managing the friction they bring for a good while.' },
    { t:'Stall and re-open the search hoping for someone perfect.', fx:{perf:-5, stress:3}, res:'The \u201Cperfect\u201D candidate never appears, both finalists take other jobs, and your team works short-handed for months.' }
  ]},
{ id:'p_credit', cats:['people'], type:'Recognition', title:'Your boss took the credit',
  text:'A project your team poured months into just succeeded, and in the big meeting your own boss took most of the credit in front of senior leadership.',
  choices:[
    { t:'Privately and graciously make sure leadership knows who did the work \u2014 and lavish public credit on your team yourself.', req:{leadership:35}, fx:{perf:7, leadership:5, communication:2}, res:'Your team feels seen, leadership quietly notes your generosity, and you look like exactly the kind of leader they promote.', failRes:'Your attempt to set the record straight reads as petty politicking; it backfires and strains things with your boss.' },
    { t:'Make a point of celebrating your team loudly within the group.', fx:{perf:4, leadership:2, communication:1}, res:'Your people know you have their backs, even if the wider org\u2019s perception didn\u2019t shift much.' },
    { t:'Let it go and quietly fume.', fx:{perf:-4, leadership:-1, stress:4}, res:'Your team noticed the credit grab too \u2014 and noticed you said nothing. Trust erodes a little.' }
  ]},
{ id:'p_layoff', cats:['people'], type:'Hard Call', title:'You have to let someone go',
  text:'Budgets are cut and you\u2019re told to let one person go from a team of eight. Everyone is competent. However you handle it, the survivors will be watching closely.',
  choices:[
    { t:'Decide on clear criteria, deliver it with dignity and real support, and be transparent with the rest of the team.', req:{leadership:45}, fx:{perf:7, leadership:6, communication:3, stress:5}, res:'It\u2019s awful, but you do it humanely and honestly. The team, though shaken, trusts that you\u2019ll treat them fairly too.', failRes:'You stumble through the message; mixed signals and a clumsy delivery leave the survivors anxious and rumor-ridden.' },
    { t:'Let go the most recent hire and keep it brief and professional.', fx:{perf:4, stress:4}, res:'Defensible and quick. It\u2019s done cleanly, even if \u201Clast in, first out\u201D leaves some quietly uneasy.' },
    { t:'Soften it by being vague and hinting it might be temporary.', fx:{perf:-6, leadership:-3, communication:-2, stress:3}, res:'False hope is a cruelty. When \u201Ctemporary\u201D turns permanent, you\u2019ve lost the room\u2019s trust entirely.' }
  ]},
{ id:'p_remote', cats:['people'], type:'Policy', title:'Office or home? Everyone\u2019s fighting',
  text:'Half your team thrives working from home; the other half feels isolated and wants everyone back in the office. Both sides are lobbying you hard, and leadership wants \u201Ca decision.\u201D',
  choices:[
    { t:'Design a clear hybrid setup around the actual work, and explain the reasoning so everyone feels heard.', req:{communication:40}, fx:{perf:7, communication:5, leadership:3}, res:'Not everyone gets their first choice, but the thoughtful, transparent approach earns buy-in from both camps.', failRes:'Your policy is muddled and the rollout confusing; both camps feel ignored and the lobbying only intensifies.' },
    { t:'Set a simple rule \u2014 a couple of fixed in-office days a week.', fx:{perf:4, leadership:2, stress:1}, res:'Not artful, but clear and fair enough. People adapt and the lobbying dies down.' },
    { t:'Avoid deciding and let everyone do whatever they want.', fx:{perf:-5, leadership:-2, stress:2}, res:'The vacuum breeds resentment: the in-office crowd feels like suckers and teamwork frays.' }
  ]},
{ id:'p_feedback', cats:['people'], type:'Feedback', title:'The well-liked underperformer',
  text:'A well-liked, hard-working team member is quietly underperforming, and everyone\u2019s tiptoeing around it \u2014 including you. It\u2019s starting to drag the whole team down.',
  choices:[
    { t:'Give direct, kind, specific feedback and build an improvement plan together.', req:{leadership:35}, fx:{perf:7, leadership:5, communication:3, stress:2}, res:'A hard conversation, handled with care. They rise to it \u2014 most people can, when you\u2019re honest and supportive.', failRes:'You go in underprepared; the feedback lands as vague criticism, they get defensive, and the issue is now a wound.' },
    { t:'Drop gentle hints and hope they pick up on them.', fx:{perf:2, communication:1, stress:2}, res:'The hints mostly miss. Nothing gets worse, but nothing really improves either.' },
    { t:'Quietly route their work to others to compensate.', fx:{perf:-6, leadership:-2, stress:3}, res:'You\u2019ve now overloaded your strong performers to cover for one struggler. Resentment brews fast.' }
  ]},
{ id:'p_oncallrev', cats:['people'], type:'Process', title:'The on-call rota is crushing people',
  text:'Your after-hours on-call rotation is grueling and people quietly dread their turn. One engineer just told you they\u2019ll quit before doing another month of 3 a.m. alerts.',
  choices:[
    { t:'Overhaul it: fix the root causes of the night-time alerts and fairly reward the burden.', req:{leadership:35}, fx:{perf:8, leadership:5, technical:3, business:2, stress:-2}, res:'Fewer alerts, fairer load, happier team. You treated the cause, not just the symptom.', failRes:'You reshuffle the schedule without fixing why the alerts happen; the misery just moves to a different person.' },
    { t:'Spread the load across more people and add a small on-call bonus.', fx:{perf:4, leadership:2, business:1, stress:1}, res:'It eases the pain and the threat-to-quit recedes. The underlying noise remains, but morale improves.' },
    { t:'Remind everyone it\u2019s part of the job.', fx:{perf:-7, leadership:-3, stress:3}, res:'The engineer makes good on the threat, and two others update their resumes. \u201CPart of the job\u201D isn\u2019t a retention plan.' }
  ]},
{ id:'p_growth', cats:['people'], type:'Development', title:'The quiet one who\u2019s secretly great',
  text:'A shy, junior team member has quietly become very good \u2014 but they never put themselves forward, and they\u2019re at real risk of being overlooked when promotions come around.',
  choices:[
    { t:'Actively sponsor them: give them visible work, coach them, and advocate for them with leadership.', req:{leadership:30}, fx:{perf:7, leadership:5, communication:2}, res:'With a real sponsor, they blossom and get the recognition they earned. Spotting and lifting hidden talent is the job.', failRes:'You push them into the spotlight before they\u2019re ready and without support; they stumble publicly and retreat further.' },
    { t:'Encourage them privately with honest, specific praise.', fx:{perf:4, leadership:2, communication:1}, res:'Your encouragement lifts their confidence a notch. A kind nudge, if not a full launch.' },
    { t:'Leave it \u2014 good work speaks for itself.', fx:{perf:-4, leadership:-2}, res:'It doesn\u2019t. They\u2019re passed over, decide they have no future here, and start looking elsewhere.' }
  ]},
{ id:'p_newteam', cats:['people'], type:'New Team', title:'A burned, cynical team',
  text:'You\u2019ve just inherited a team that\u2019s churned through three managers in two years. They\u2019re guarded and cynical, clearly waiting to see whether you\u2019re worth trusting.',
  choices:[
    { t:'Spend your first weeks listening \u2014 one-on-ones with everyone \u2014 before changing a thing.', req:{leadership:35}, fx:{perf:7, leadership:5, communication:3}, res:'By earning trust before exercising authority, you win the room. They start bringing you the real problems.', failRes:'Your listening tour feels performative because you haven\u2019t earned any credibility yet; they stay guarded and unimpressed.' },
    { t:'Set a few clear, modest expectations and then reliably deliver on your promises.', fx:{perf:4, leadership:2, stress:1}, res:'Reliability is its own message. Doing exactly what you said you\u2019d do slowly thaws the cynicism.' },
    { t:'Assert authority early to show who\u2019s in charge.', fx:{perf:-6, leadership:-3, communication:-2, stress:2}, res:'Coming in swinging at a burned team confirms their worst fears. They close ranks against you.' }
  ]},
{ id:'p_diversity', cats:['people'], type:'Culture', title:'Everyone thinks alike',
  text:'Your team is talented, but everyone thinks the same way \u2014 and it shows as blind spots during planning. Widening the range of perspectives would help, but the easy hires all come from the same mold.',
  choices:[
    { t:'Rework how you find and interview candidates to widen the pool and reduce bias, even though it takes longer.', req:{leadership:40}, fx:{perf:7, leadership:5, business:2}, res:'The slower, fairer process brings in perspectives that immediately sharpen the team\u2019s thinking. Worth the patience.', failRes:'You change the process clumsily and without buy-in; it\u2019s seen as box-ticking and a couple of hires feel tokenized. Backfire.' },
    { t:'Make a point of inviting quieter voices into the decisions you already make.', fx:{perf:4, communication:2, leadership:1}, res:'Surfacing existing-but-unheard perspectives helps right away, even before any new hires.' },
    { t:'Keep hiring the proven profile \u2014 it\u2019s lower risk.', fx:{perf:-3, business:-1}, res:'The blind spots stay blind. Months later, a \u201Csurprise\u201D problem hits that an outside view would have caught.' }
  ]},
{ id:'p_mistake', cats:['people'], type:'Accountability', title:'Your report caused an outage',
  text:'Someone on your team made a genuine, costly mistake that briefly took a system offline. Leadership is asking who\u2019s responsible, and your report is bracing to be thrown under the bus.',
  choices:[
    { t:'Take responsibility upward as the manager, shield your report, and run a blame-free review to fix the underlying cause.', req:{leadership:40}, fx:{perf:7, leadership:6, communication:2, stress:3}, res:'You absorb the heat and turn the failure into a fix. Your team would now run through walls for you.', failRes:'You try to shield them but fumble the upward message; leadership reads it as you dodging accountability. Costly.' },
    { t:'Stick to the facts: explain what happened and what you\u2019ll change, without singling anyone out.', fx:{perf:5, communication:3, leadership:1}, res:'A calm, honest account satisfies leadership and spares your report a public flogging. Solid.' },
    { t:'Let the facts fall where they may \u2014 they did make the mistake.', fx:{perf:-6, leadership:-4, stress:2}, res:'Hanging your own person out to dry is the fastest way to lose a team\u2019s trust. Everyone recalibrates their loyalty.' }
  ]},
{ id:'p_promote_peer', cats:['people'], type:'Dynamics', title:'Now you manage your friends',
  text:'You were just promoted to lead the very peers you joked and complained with yesterday. Today you have to assign their work, judge their performance, and sometimes say no to friends.',
  choices:[
    { t:'Have an honest reset chat with each of them about the new dynamic and what you\u2019ll need from each other.', req:{leadership:30}, fx:{perf:7, leadership:5, communication:3}, res:'Naming the awkwardness defuses it. The friendships adapt, and their respect for you as a manager grows.', failRes:'The reset chats come off stiff and self-important; a couple of friends feel you\u2019ve changed overnight, and it stings.' },
    { t:'Lead by being consistently fair and let your actions rebuild the relationship.', fx:{perf:4, leadership:2, stress:2}, res:'Fairness over time earns the new kind of respect. A few bumps, but the relationships find new footing.' },
    { t:'Keep acting like one of the gang to avoid friction.', fx:{perf:-5, leadership:-3, stress:3}, res:'Trying to be friend and boss at once, you become a convincing neither. Accountability quietly collapses.' }
  ]},

/* ---------------- BUDGET ---------------- */
{ id:'b_budget', cats:['budget'], type:'Budget', title:'A smaller budget, a bigger company',
  text:'It\u2019s planning season. Next year\u2019s security budget lands on your desk 15% smaller than last year\u2019s \u2014 while the company keeps growing and the threats keep multiplying.',
  choices:[
    { t:'Rebuild the budget around risk: fund what reduces the most danger, cut the rest, and show leadership the math.', req:{business:45}, fx:{perf:8, business:6, communication:3}, res:'By tying every dollar to risk reduced, you defend the essentials and even win some funding back. Numbers persuade.', failRes:'Your risk model is shaky and a sharp finance chief pokes holes in it; you lose credibility and the cuts land where they hurt most.' },
    { t:'Trim evenly across the board to hit the number without drama.', fx:{perf:4, business:2, stress:2}, res:'Fair and fast, but flat cuts dull your strongest defenses along with the weak. It\u2019ll do for now.' },
    { t:'Protest the cut and refuse to plan until it\u2019s restored.', fx:{perf:-7, business:-2, communication:-2, stress:3}, res:'Digging in with no counter-proposal just makes you look unrealistic. Finance imposes worse cuts for you.' }
  ]},
{ id:'b_tool', cats:['budget'], type:'Vendor', title:'The dazzling $400k sales pitch',
  text:'A slick vendor is pitching a $400,000 \u201CAI-powered\u201D security platform that promises to solve problems you\u2019re not sure you even have. The demo was genuinely dazzling.',
  choices:[
    { t:'Run a hard-nosed evaluation against your real needs and negotiate aggressively \u2014 or walk away.', req:{business:50}, fx:{perf:8, business:6, stress:2}, res:'You cut through the hype, prove what you\u2019d actually use, and either land a great deal or save the money. Discipline wins.', failRes:'You try to play hardball without really understanding the need; the vendor runs circles around you and you overpay anyway.' },
    { t:'Run a small paid trial before committing to anything.', fx:{perf:5, business:3, technical:1, stress:1}, res:'A cheap pilot reveals what the demo hid. You make the call on evidence, not adrenaline.' },
    { t:'Just buy it \u2014 leadership loves the idea of \u201CAI security.\u201D', fx:{perf:-6, business:-3, money:-20000}, res:'The shelfware gathers dust while you keep paying for it. Buying the buzzword cost real money and credibility.' }
  ]},
{ id:'b_priority', cats:['budget'], type:'Prioritization', title:'Boring fix or exciting project?',
  text:'You can fund exactly one big effort this year. Option A fixes a dull-but-real weakness the auditors flag every single year. Option B is an exciting project everyone\u2019s buzzing about, but its payoff is fuzzy.',
  choices:[
    { t:'Make the case for the unglamorous fix by putting a dollar figure on what the recurring risk actually costs.', req:{business:45}, fx:{perf:7, business:6, communication:2}, res:'You translate \u201Cboring\u201D into dollars and risk, and leadership backs the right call over the shiny one. Maturity.', failRes:'Your cost argument is hand-wavy; leadership picks the exciting option anyway, and the audit finding returns to haunt you.' },
    { t:'Just do the audit fix \u2014 it\u2019s the responsible choice.', fx:{perf:5, business:2, stress:1}, res:'Not glamorous, but defensible. The recurring finding finally goes away and the auditors stop circling.' },
    { t:'Chase the exciting project to boost team morale.', fx:{perf:-4, business:-2, stress:2}, res:'The fun project fizzles with no measurable benefit, and the known risk is still sitting there at audit time.' }
  ]},
{ id:'b_chargeback', cats:['budget'], type:'Economics', title:'Everyone treats you as free',
  text:'Other departments treat your security team as a free, infinite resource, flooding you with requests. You\u2019re drowning, with no way to signal that this work actually costs something.',
  choices:[
    { t:'Introduce a simple internal pricing model so teams budget for the security work they ask for.', req:{business:50}, fx:{perf:8, business:6, communication:3, stress:-2}, res:'Suddenly requests get prioritized by the people making them, and your team\u2019s value shows up on the books. Elegant.', failRes:'You roll out charging clumsily; other teams revolt at the bureaucracy and your boss tells you to scrap it. Ouch.' },
    { t:'Create a clear intake form and triage requests by impact.', fx:{perf:5, business:2, communication:2, stress:-1}, res:'A simple front door brings order to the chaos. You\u2019re still busy, but no longer ambushed.' },
    { t:'Just keep saying yes to everything.', fx:{perf:-6, stress:5}, res:'Saying yes to everything means doing nothing well. Quality slips and your team quietly resents the firehose.' }
  ]},
{ id:'b_roi', cats:['budget'], type:'Value', title:'What did all that money buy us?',
  text:'The finance chief asks the hardest question in security, and a fair one: \u201CWe spent millions and nothing bad happened. So what did we actually get for it?\u201D',
  choices:[
    { t:'Tell the story with data: incidents prevented, risks reduced, and what a single breach would have cost.', req:{communication:45}, fx:{perf:8, communication:6, business:4}, res:'You make the invisible visible. They leave understanding that \u201Cnothing happened\u201D was exactly the product they bought.', failRes:'Your metrics are a wall of numbers with no story; their eyes glaze over and the doubt about the spend only grows.' },
    { t:'Walk them through a few concrete near-misses you stopped this year.', fx:{perf:5, communication:3, business:2}, res:'Real stories land better than spreadsheets. They nod \u2014 they get it, at least for now.' },
    { t:'Insist that security is priceless and can\u2019t be measured.', fx:{perf:-7, business:-3, communication:-2}, res:'To a finance chief, \u201Cunmeasurable\u201D sounds like \u201Cunaccountable.\u201D Next year\u2019s budget talk just got harder.' }
  ]},
{ id:'b_debt', cats:['budget'], type:'Risk', title:'A mountain of we\u2019ll-fix-it-later',
  text:'Years of shortcuts have piled into a mountain of security debt. Fixing it is expensive and invisible to customers, so it never wins against shiny new features.',
  choices:[
    { t:'Propose a steady, funded program to pay down the riskiest debt a little each quarter.', req:{business:50}, fx:{perf:8, business:6, technical:2, stress:2}, res:'Framed as ongoing upkeep rather than a scary one-time bill, it finally gets funded. Slow and steady de-risks the company.', failRes:'You pitch it as one giant project with a giant price tag; sticker shock kills it and the debt keeps compounding.' },
    { t:'Tackle the single riskiest item now and prove the value.', fx:{perf:5, business:2, technical:2}, res:'One concrete win is worth a thousand slides. It builds the case for funding more later.' },
    { t:'Keep deferring \u2014 features pay the bills.', fx:{perf:-5, technical:-2, stress:2}, res:'The debt comes due at the worst possible moment, as it always does, turning a cheap fix into an expensive crisis.' }
  ]},
{ id:'b_insurance', cats:['budget'], type:'Risk Transfer', title:'Cyber-insurance just doubled',
  text:'It\u2019s renewal time for the company\u2019s cyber-insurance, and the premium has doubled. The insurer demands proof that you have specific protections in place \u2014 or they won\u2019t cover you.',
  choices:[
    { t:'Treat their checklist as a free risk roadmap: close the gaps, then negotiate the premium down with proof.', req:{business:45}, fx:{perf:8, business:6, technical:2}, res:'You turn an annoying audit into genuinely better defenses AND a lower premium. Two birds, one well-run project.', failRes:'You rush attestations you can\u2019t fully back up; their audit catches the gap and your coverage gets restricted. Risky.' },
    { t:'Meet the minimum requirements to keep coverage and pay the premium.', fx:{perf:5, business:2, stress:2}, res:'You stay covered and compliant. The safe path, even if you left a negotiation on the table.' },
    { t:'Push back on the requirements and threaten to switch insurers.', fx:{perf:-5, business:-2, stress:3}, res:'Every insurer wants the same basics. You waste weeks shopping around and end up meeting them anyway, later.' }
  ]},
{ id:'b_consolidate', cats:['budget'], type:'Tool Sprawl', title:'40 tools, half of them duplicates',
  text:'You\u2019ve inherited 40 overlapping security tools bought over the years. Half do the same thing, nobody remembers why some exist, and the combined bill is enormous.',
  choices:[
    { t:'Map every tool to what it actually does, cut the redundant ones, and consolidate onto a lean set.', req:{business:50}, fx:{perf:8, business:6, technical:3, stress:3}, res:'You slash the bill, simplify operations, and the team finally understands its own toolbox. Painful audit, huge payoff.', failRes:'You cut a tool you didn\u2019t fully understand and quietly remove a protection that mattered. The gap surfaces badly.' },
    { t:'Cancel the few obviously-unused tools to bank some quick savings.', fx:{perf:5, business:3, stress:1}, res:'Low-hanging fruit, picked. Real savings with little risk \u2014 and a start on the bigger cleanup.' },
    { t:'Leave it; switching tools is disruptive.', fx:{perf:-4, business:-2}, res:'The bloated bill and tangled operations roll on. Inertia is comfortable, right up until the budget review.' }
  ]},
{ id:'b_build_buy', cats:['budget'], type:'Build vs Buy', title:'Build it ourselves, or just buy it?',
  text:'Your team wants to build a custom security tool in-house instead of buying one. They\u2019re excited, and it would fit perfectly \u2014 but it would also become something you have to maintain forever.',
  choices:[
    { t:'Build it \u2014 but only after honestly costing the long-term upkeep and committing to support it.', req:{business:50}, fx:{perf:7, business:6, technical:3, stress:2}, res:'Eyes open about the true cost, you build something genuinely better-fit and budget to sustain it. Rare discipline.', failRes:'You greenlight the build on optimism, underestimate the upkeep, and a year later own a fragile tool nobody has time to maintain.' },
    { t:'Buy the off-the-shelf option and spend your team\u2019s time on higher-value work.', fx:{perf:6, business:3, stress:-1}, res:'Sometimes the boring choice is the smart one. You get 90% of the value and none of the maintenance burden.' },
    { t:'Let the team build it for fun without costing the upkeep.', fx:{perf:-6, business:-3, technical:1, stress:2}, res:'The exciting prototype becomes an unfunded forever-chore. Enthusiasm doesn\u2019t pay maintenance bills.' }
  ]},
{ id:'b_metrics', cats:['budget'], type:'Reporting', title:'The board wants one simple number',
  text:'The board wants a single dashboard that tells them, at a glance, whether the company is \u201Csecure.\u201D Security doesn\u2019t really work that way \u2014 but \u201Cit\u2019s complicated\u201D won\u2019t fly.',
  choices:[
    { t:'Build a small set of honest, meaningful indicators and teach the board how to read them.', req:{communication:45}, fx:{perf:8, communication:6, business:3}, res:'You resist the fake green light and give them something true and usable. The board trusts what they can understand.', failRes:'Your dashboard is technically pure but baffling to non-experts; the board feels talked down to and tunes out.' },
    { t:'Give them a simple red/amber/green summary with notes.', fx:{perf:5, communication:3, business:1}, res:'Imperfect but digestible. The traffic lights aren\u2019t the whole truth, but they open the right conversations.' },
    { t:'Hand them the raw technical metrics and let them figure it out.', fx:{perf:-6, communication:-3}, res:'The board drowns in jargon, concludes security is a black box, and trusts it less, not more.' }
  ]},
{ id:'b_cut_request', cats:['budget'], type:'Pressure', title:'Skip the review, we need to ship',
  text:'A powerful executive wants to launch a product fast and is pressuring you to skip the security review to hit the date. It would genuinely save weeks \u2014 and genuinely add real risk.',
  choices:[
    { t:'Offer a faster risk-based review that protects the date AND the essentials, and put the leftover risk in writing for them to own.', req:{business:45}, fx:{perf:8, business:5, communication:4, stress:3}, res:'You neither block nor cave \u2014 you find the third path and make the risk-owner explicit. A leadership-grade move.', failRes:'Your compromise is vague and the risk acceptance unclear; when something slips, accountability is a mess \u2014 and it lands on you.' },
    { t:'Negotiate a smaller delay to cover just the critical checks.', fx:{perf:5, business:2, communication:2, stress:2}, res:'You trim the review to its must-haves and win a short extension. Not perfect, but the worst risks are covered.' },
    { t:'Cave to the pressure and skip the review.', fx:{perf:-7, business:-2, stress:3}, res:'The product ships with a hole in it. When it\u2019s found, \u201CI was told to\u201D protects no one, least of all you.' }
  ]},
{ id:'b_audit', cats:['budget'], type:'Compliance', title:'Pass the audit or lose the customer',
  text:'A major customer says they\u2019ll walk unless you pass a tough security audit in 60 days. Passing legitimately is possible but will consume your team; faking it is tempting and faster.',
  choices:[
    { t:'Run a focused program to genuinely close the gaps the audit cares about, and use it to harden the company for real.', req:{business:45}, fx:{perf:8, business:6, technical:3, stress:5}, res:'You pass honestly and come out genuinely stronger. The customer stays and you\u2019ve banked real improvements.', failRes:'You over-scope it and exhaust the team chasing everything at once; you scrape a pass but burn people out.' },
    { t:'Prioritize the audit\u2019s biggest items and bring in outside help for the rest.', fx:{perf:5, business:3, stress:3}, res:'Triage plus a little outside help gets you across the line without melting the team. Pragmatic.' },
    { t:'Paper over the gaps to pass quickly.', fx:{perf:-8, business:-3, stress:2}, res:'Auditors are paid to find paper. The shortcut is caught, the customer leaves anyway, and your word is now suspect.' }
  ]},

/* ---------------- EXECUTIVE ---------------- */
{ id:'e_breach', cats:['executive'], type:'Crisis', title:'The breach is about to go public',
  text:'It\u2019s confirmed: attackers stole customer data, and it\u2019s about to hit the news. The next 24 hours of decisions will define how customers, regulators, and the press judge the company \u2014 and you.',
  choices:[
    { t:'Get ahead of it: coordinate a fast, honest disclosure with legal and communications, and front the response yourself.', req:{communication:60}, fx:{perf:9, communication:6, business:3, stress:6}, res:'Owning it early and honestly turns a disaster into a story about competence. Trust is lost in buckets and regained in drops \u2014 you chose the drops.', failRes:'You move fast but mis-coordinate with legal; a premature, inconsistent statement makes the company look chaotic and exposes it legally.' },
    { t:'Follow the rehearsed incident-response plan and let the prepared process drive.', fx:{perf:6, communication:3, business:2, stress:5}, res:'The plan holds. The response is competent and measured, if not visionary. This is exactly why you rehearsed it.' },
    { t:'Stay quiet and hope the details never surface.', fx:{perf:-12, communication:-3, business:-2, stress:6}, res:'The cover-up always becomes the story. When it leaks anyway, the silence is what regulators and customers can\u2019t forgive.' }
  ]},
{ id:'e_board', cats:['executive'], type:'Board', title:'A nervous board wants reassurance',
  text:'After a competitor\u2019s headline breach, your board is nervous and wants reassurance. Promise too much and you\u2019ll own an impossible standard; admit too much and you\u2019ll spook them.',
  choices:[
    { t:'Give them a clear-eyed, honest picture \u2014 real risks, real plan, real limits \u2014 and frame security as managed risk, not a guarantee.', req:{communication:65}, fx:{perf:9, communication:7, business:3}, res:'The board respects the candor and your command of the topic. You\u2019ve turned anxiety into informed confidence.', failRes:'You aim for nuance but lose the room in caveats; the board hears waffling, and their nervousness curdles into doubt about you.' },
    { t:'Walk them through what you\u2019re doing and how you compare to peers.', fx:{perf:6, communication:3, business:2}, res:'A solid, reassuring update. Benchmarking against peers gives them a frame they can hold onto.' },
    { t:'Promise them the company is completely secure.', fx:{perf:-9, communication:-3, business:-2}, res:'You just signed up to own an impossible promise. The first incident makes a liar of you in front of the board.' }
  ]},
{ id:'e_peer', cats:['executive'], type:'Politics', title:'A rival executive is undermining you',
  text:'A fellow executive sees your security initiatives as a threat to their turf and has started quietly undermining you in leadership meetings.',
  choices:[
    { t:'Find the shared goal, build a genuine alliance, and reframe your work as advancing their agenda too.', req:{business:55}, fx:{perf:8, business:5, communication:4}, res:'You turn a rival into a partner by making the win mutual. The most senior skill isn\u2019t fighting \u2014 it\u2019s aligning.', failRes:'Your overture is read as a power play; the rival digs in harder, and now leadership sees an open executive feud. Messy.' },
    { t:'Keep delivering visible wins and let results speak for themselves.', fx:{perf:5, business:2, communication:1, stress:2}, res:'Competence is armor. The undermining doesn\u2019t fully stop, but your track record makes it ring hollow.' },
    { t:'Fight fire with fire and undermine them right back.', fx:{perf:-7, business:-3, communication:-2, stress:4}, res:'Two executives knifing each other in meetings makes both look small. The CEO loses patience with the pair of you.' }
  ]},
{ id:'e_regulator', cats:['executive'], type:'Regulator', title:'A regulator comes knocking',
  text:'A regulator opens an inquiry into how the company handles data, with the power to levy serious fines. How you engage will shape both the outcome and the company\u2019s reputation.',
  choices:[
    { t:'Engage proactively and transparently, show good-faith effort, and treat the regulator as a stakeholder, not an enemy.', req:{communication:60}, fx:{perf:9, communication:6, business:4, stress:4}, res:'Cooperation and visible good faith soften the stance. You leave with guidance and goodwill instead of a headline fine.', failRes:'You over-share without aligning with legal and hand them ammunition; the inquiry widens and counsel is furious. Costly.' },
    { t:'Work closely with legal and respond carefully to exactly what\u2019s asked.', fx:{perf:6, communication:2, business:2, stress:3}, res:'Measured and defensible. You give them no surprises and no openings. The careful path serves you well.' },
    { t:'Stonewall and disclose as little as legally possible.', fx:{perf:-9, business:-3, stress:4}, res:'Regulators read stonewalling as something to hide. The inquiry hardens and the eventual penalty reflects the attitude.' }
  ]},
{ id:'e_culture', cats:['executive'], type:'Culture', title:'The department of no',
  text:'Across the company, people see security as the \u201Cdepartment of no\u201D and route around it. You can mandate rules all day, but you can\u2019t police thousands of people who don\u2019t buy in.',
  choices:[
    { t:'Launch a culture shift: make security helpful, human, and even rewarded \u2014 turn employees into allies, not adversaries.', req:{communication:60}, fx:{perf:8, communication:6, leadership:3, stress:2}, res:'Slowly, \u201Cno\u201D becomes \u201Cyes, and here\u2019s how to do it safely.\u201D When people want to do the right thing, you\u2019ve won the unwinnable fight.', failRes:'Your campaign feels like corporate sloganeering with no substance behind it; cynical employees roll their eyes and tune out.' },
    { t:'Quietly engineer the secure path to be the easy default in key systems.', fx:{perf:6, communication:2, technical:2}, res:'Good defaults beat nagging. People do the safe thing without even noticing. Real, quiet progress.' },
    { t:'Tighten the rules and enforce harder.', fx:{perf:-7, communication:-3, leadership:-2, stress:3}, res:'More walls just mean more clever ways around them. Adversarial security loses to human creativity every time.' }
  ]},
{ id:'e_war', cats:['executive'], type:'Crisis', title:'An attacker is inside, right now',
  text:'A sophisticated attacker is in your systems as you read this, and it\u2019s all-hands. People are panicking, executives demand updates every five minutes, and you have to lead the response while everyone watches.',
  choices:[
    { t:'Take calm command: set clear roles, a steady update rhythm, and shield the responders from the noise so they can work.', req:{communication:65}, fx:{perf:10, communication:7, leadership:4, business:2, stress:7}, res:'Your composure becomes the team\u2019s composure. Clear command turns chaos into a coordinated response that ejects the attacker.', failRes:'You try to run everything yourself and become the bottleneck; updates slip, responders get conflicting orders, and the chaos deepens.' },
    { t:'Empower your best incident lead to run it, and personally absorb the executive pressure for them.', fx:{perf:7, communication:3, leadership:3, stress:5}, res:'Knowing when to delegate is its own strength. Your lead runs a tight response while you take the heat from above.' },
    { t:'Demand constant status updates from everyone so you stay fully informed.', fx:{perf:-9, communication:-2, stress:6}, res:'Every status update is time not spent fighting the attacker. Your need for control slows the very response you\u2019re leading.' }
  ]},
{ id:'e_succession', cats:['executive'], type:'Pipeline', title:'No one could replace you',
  text:'You\u2019re being eyed for an even bigger role, but if you left, your organization has no obvious successor. Building one takes time and means sharing the spotlight now.',
  choices:[
    { t:'Deliberately develop two strong deputies, delegate real authority, and let them shine.', req:{leadership:55}, fx:{perf:8, leadership:6, communication:3}, res:'You build an organization that doesn\u2019t need you in the room \u2014 the truest mark of a leader. Your own path opens up, too.', failRes:'You hand over authority you haven\u2019t prepared them for; they stumble in the spotlight and it reflects on your judgment.' },
    { t:'Quietly mentor one promising deputy on the side.', fx:{perf:5, leadership:3, communication:1}, res:'A modest investment in one person. It\u2019s a start on a bench, even if the org still leans heavily on you.' },
    { t:'Stay indispensable \u2014 it\u2019s good job security.', fx:{perf:-5, leadership:-3, stress:3}, res:'Indispensable people don\u2019t get promoted; they get stuck. And a team that fails without one person terrifies the board.' }
  ]},
{ id:'e_ethics', cats:['executive'], type:'Ethics', title:'The company is over-collecting data',
  text:'You discover the company quietly collects far more customer data than it admits, in a legal grey area that happens to be profitable. Raising it will anger powerful people; staying silent makes you complicit.',
  choices:[
    { t:'Raise it through the right channels with a clear-eyed case for the legal, reputational, and ethical risk.', req:{communication:60}, fx:{perf:8, communication:5, business:4, stress:5}, res:'You make the responsible case so well that leadership acts before it becomes a scandal. Integrity, delivered with skill.', failRes:'You raise it clumsily and accusatorially; defensive leadership shoots the messenger and the practice continues \u2014 now with you marked.' },
    { t:'Document your concerns formally and push for a privacy review.', fx:{perf:6, communication:3, business:2, stress:3}, res:'You create a paper trail and a process. Slower than a confrontation, but it moves the issue into the light responsibly.' },
    { t:'Look the other way \u2014 it\u2019s profitable and technically legal.', fx:{perf:-8, communication:-2, business:-2, stress:4}, res:'\u201CTechnically legal\u201D is cold comfort when it becomes a headline \u2014 and you\u2019ll be on record as having known.' }
  ]},
{ id:'e_acquire', cats:['executive'], type:'M&A', title:'Buying a possible disaster',
  text:'The company is about to acquire a smaller firm, and you have days to judge whether you\u2019re also acquiring a hidden security disaster. The deal team sees you as a speed bump.',
  choices:[
    { t:'Run a sharp, risk-focused review and turn the findings into deal terms \u2014 price, protections, or walk-away.', req:{business:60}, fx:{perf:9, business:6, communication:4, stress:4}, res:'You find real risk and turn it into leverage at the negotiating table. Security with a seat at the deal \u2014 rare and valued.', failRes:'Your assessment is rushed and alarmist; the deal team dismisses it as fear-mongering and the real issues get buried.' },
    { t:'Flag the top risks clearly and recommend conditions on closing the deal.', fx:{perf:6, business:3, communication:2}, res:'You can\u2019t boil the ocean in days, but you surface the big rocks and get sensible conditions attached. Good enough, fast.' },
    { t:'Rubber-stamp it to avoid being the deal-blocker.', fx:{perf:-8, business:-3, stress:3}, res:'The acquired company\u2019s breach becomes your breach six months later. The speed bump would have been cheaper.' }
  ]},
{ id:'e_talent_exec', cats:['executive'], type:'Org', title:'You\u2019re always firefighting',
  text:'Your security organization has outgrown its structure. Talented people are leaving because there\u2019s no room to grow, and you spend all your time firefighting instead of leading.',
  choices:[
    { t:'Redesign the org with real career paths and leadership layers, even though it means giving up direct control.', req:{leadership:55}, fx:{perf:8, leadership:6, business:3, communication:2, stress:2}, res:'You build a machine that grows its own talent and runs without you in every meeting. That\u2019s what executives are for.', failRes:'You reorganize on paper without buy-in or the right leaders ready; the structure wobbles and good people leave during the churn.' },
    { t:'Create a couple of senior roles to relieve the pressure and keep key people.', fx:{perf:6, leadership:3, business:2, stress:-1}, res:'Two well-placed promotions ease the bottleneck and signal that growth is possible here. A solid step.' },
    { t:'Keep firefighting and deal with structure later.', fx:{perf:-6, leadership:-3, stress:5}, res:'\u201CLater\u201D never comes while you\u2019re firefighting. More talent leaves, and the fires only multiply.' }
  ]},
{ id:'e_global', cats:['executive'], type:'Strategy', title:'Expanding into a risky new region',
  text:'The company is expanding into a region with very different data laws and a more hostile threat landscape. Leadership wants growth fast; you see a minefield.',
  choices:[
    { t:'Build a region-aware security and compliance strategy that makes the expansion safe instead of blocking it.', req:{business:60}, fx:{perf:9, business:6, communication:4, stress:4}, res:'You become the executive who makes growth possible, not the one who fears it. Security as a business enabler \u2014 the top of the craft.', failRes:'Your strategy is overbuilt and slow; the business blows past you to hit its date, leaving you looking like an obstacle anyway.' },
    { t:'Bring in regional expertise and tackle the biggest legal risks first.', fx:{perf:6, business:3, communication:2}, res:'Smart not to pretend you know it all. Local expertise plus a focus on the top risks keeps the expansion on the rails.' },
    { t:'Apply your existing playbook unchanged \u2014 security is security.', fx:{perf:-8, business:-3, stress:3}, res:'Your home-region playbook collides with local law and local threats. What worked back home becomes a liability abroad.' }
  ]},
{ id:'e_layoff_exec', cats:['executive'], type:'Hard Call', title:'Cut a quarter of your org',
  text:'The company is slashing costs and your entire security organization must shrink by a quarter. You must decide where, defend it to peers fighting for the same dollars, and keep your remaining people from fleeing.',
  choices:[
    { t:'Make risk-based cuts, fight hard for the essentials, and lead the survivors through it with honesty and a clear plan.', req:{leadership:55}, fx:{perf:8, leadership:6, communication:4, business:2, stress:6}, res:'You protect what matters most, lose with dignity what you must, and keep the team\u2019s trust through candor. Leadership in the fire.', failRes:'Your cuts look arbitrary because you can\u2019t clearly justify them; peers raid your budget and your best people read the chaos and leave.' },
    { t:'Cut the lowest-risk areas and over-communicate with the team throughout.', fx:{perf:6, leadership:3, communication:2, stress:4}, res:'A defensible, humane approach. The team is shaken but informed, and the core capability survives intact.' },
    { t:'Spread the cuts thinly to avoid making hard choices.', fx:{perf:-7, leadership:-3, business:-2, stress:4}, res:'Cutting everything a little leaves nothing working well. You\u2019ve weakened every defense instead of consciously dropping a few.' }
  ]},
{ id:'e_legacy_exec', cats:['executive'], type:'Vision', title:'What will you leave behind?',
  text:'You\u2019ve reached the top of the security world. A peer asks you the question that defines a career: when you eventually move on, what do you actually want to leave behind?',
  choices:[
    { t:'Commit to building lasting institutions \u2014 the people, culture, and practices that outlive you \u2014 over chasing personal headlines.', req:{communication:65}, fx:{perf:8, communication:6, leadership:4, business:2, stress:-2}, res:'You choose legacy over limelight. The systems and leaders you build will protect people long after you\u2019ve gone. That\u2019s the whole game.', failRes:'Your grand vision is long on inspiration and short on substance; people nod politely but can\u2019t tell you what you\u2019d actually change.' },
    { t:'Focus on leaving the organization measurably stronger than you found it.', fx:{perf:6, business:3, communication:2, leadership:2}, res:'A grounded, honorable ambition. Better-than-you-found-it is a legacy most never achieve. Quietly admirable.' },
    { t:'Focus on your own profile and your next big title.', fx:{perf:-5, leadership:-2, communication:-2, stress:2}, res:'Building a personal brand on a hollow organization is sandcastle work. The next incident\u2019s tide finds it out.' }
  ]}
];

/* ============================================================
   ACHIEVEMENTS
   ============================================================ */
const ACHIEVEMENTS = [
  { id:'first_day', icon:'🎒', name:'Day One', desc:'Start your career.' },
  { id:'first_promo', icon:'⬆️', name:'On the Up', desc:'Earn your first promotion.' },
  { id:'six_figures', icon:'💵', name:'Six Figures', desc:'Reach a six-figure salary.' },
  { id:'people_person', icon:'🧑‍🤝‍🧑', name:'People Person', desc:'Reach a management role.' },
  { id:'bean_counter', icon:'📊', name:'Bean Counter', desc:'Reach a budget-owning role.' },
  { id:'ic_legend', icon:'🧠', name:'The Architect\'s Legacy', desc:'Reach Security Fellow.' },
  { id:'c_suite', icon:'🏆', name:'C-Suite', desc:'Become CISO.' },
  { id:'made_it', icon:'👑', name:'You Made It', desc:'Earn a seat on the board.' },
  { id:'millionaire', icon:'💰', name:'Millionaire', desc:'Earn $1,000,000 total.' },
  { id:'survivor', icon:'🛟', name:'Survivor', desc:'Recover from a final warning.' },
  { id:'clean_sweep', icon:'✨', name:'Clean Sweep', desc:'Promote with 90+ performance.' },
  { id:'zen', icon:'🧘', name:'Work-Life Balance', desc:'Pass a review with stress under 20.' },
  { id:'workaholic', icon:'🔥', name:'Maximum Overdrive', desc:'Survive a quarter at 100 stress.' },
  { id:'escorted', icon:'📦', name:'Escorted Out', desc:'Get fired. It happens to the best.' }
];

/* Endings text */
const ENDINGS = {
  fellow: { icon:'🧠', title:'The Architect\'s Legacy',
    body:'You never wanted the corner office — you wanted to be the best in the world at the work itself. And you got there. Junior engineers cite your design docs like scripture. The systems you built will outlast you. You made it your way.' },
  board: { icon:'👑', title:'You Made It',
    body:'From a beige cubicle and a screaming alert queue to a seat at the table that once terrified you. You learned that security was never really about firewalls — it was about people, trust, and judgment under pressure. The kid watching dashboards at 3 a.m. would not believe this. You made it.' },
  fired: { icon:'📦', title:'Escorted Out',
    body:'A badge deactivated, a box of desk plants, an awkward elevator ride. It stings — but every great career has a chapter like this. The best in the business have all been walked out at least once. Dust yourself off. The ladder is still there.' }
};
