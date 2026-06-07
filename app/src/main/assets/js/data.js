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
{ id:'t_phish', cats:['technical'], type:'Incident', title:'A whale just bit',
  text:'The CFO forwarded a "DocuSign" email — and admits they already entered their password on the linked page. What\'s your first move?',
  choices:[
    { t:'Force a password reset and kill all active sessions immediately.', fx:{perf:7, technical:4, stress:3}, res:'You lock the account in 90 seconds. The attacker\'s freshly stolen session dies on the vine. Textbook.' },
    { t:'Open a ticket and email the CFO some awareness tips.', fx:{perf:-9, stress:-1}, res:'By the time anyone reads the ticket, mailbox rules are forwarding finance threads to a Gmail account. Not great.' },
    { t:'Pull the sender, isolate the inbox, and hunt for the same lure org-wide.', req:{technical:35}, fx:{perf:9, technical:6, stress:4}, res:'You containment-first, then find eleven other recipients before they click. The SOC lead notices.' }
  ]},
{ id:'t_patch', cats:['technical'], type:'Vulnerability', title:'Critical CVE, Friday 4:55pm',
  text:'A 9.8 CVE drops for the load balancer that fronts everything. A fix exists but needs a maintenance window.',
  choices:[
    { t:'Emergency-patch now and eat the brief outage.', fx:{perf:6, technical:3, stress:6}, res:'Twenty minutes of downtime, an annoyed ops team, and zero compromise over the weekend. Worth it.' },
    { t:'Apply a WAF virtual patch tonight, schedule the real fix Monday.', req:{technical:40}, fx:{perf:8, technical:5, stress:2}, res:'Clever. You blunt the exploit path without an outage and do it properly with change control. Chef\'s kiss.' },
    { t:'Wait for the normal monthly window.', fx:{perf:-11, stress:-2}, res:'It gets scanned and exploited Saturday night. You spend Sunday in a war room instead of patching. Lesson learned.' }
  ]},
{ id:'t_alert', cats:['technical'], type:'Triage', title:'Alert fatigue',
  text:'Your queue has 400 alerts and 96% are false positives from one noisy rule. Leadership wants the real threats found.',
  choices:[
    { t:'Grind through all 400 by hand to be safe.', fx:{perf:1, technical:2, stress:9}, res:'You catch everything but you\'re a husk by Thursday. This doesn\'t scale and everyone knows it.' },
    { t:'Tune the noisy rule, then triage what\'s left.', req:{technical:30}, fx:{perf:8, technical:6, stress:-2}, res:'Queue drops to 16 real alerts. You find the actual lateral-movement attempt hiding in the noise.' },
    { t:'Mute the rule entirely and move on.', fx:{perf:-7, stress:-3}, res:'You also muted the one detection that mattered. The miss surfaces two weeks later. Oof.' }
  ]},
{ id:'t_creds', cats:['technical'], type:'Finding', title:'Secrets in the repo',
  text:'During a review you find AWS keys hardcoded in a public-facing repo, committed three weeks ago.',
  choices:[
    { t:'Rotate the keys, scan CloudTrail for misuse, then fix the code.', req:{technical:30}, fx:{perf:9, technical:6, stress:4}, res:'Rotate-first saves you. Logs show one curious scan from a bot but no real damage. You also add a pre-commit hook.' },
    { t:'Delete the file and force-push. Done.', fx:{perf:-8, technical:-1, stress:1}, res:'The keys live forever in git history and were already scraped. You learn that "delete" isn\'t "rotate."' },
    { t:'Flag it to the dev team and let them handle it.', fx:{perf:-3, communication:2, stress:0}, res:'They get to it... eventually. The clock was ticking and you let it tick.' }
  ]},
{ id:'t_oncall', cats:['technical'], type:'On-call', title:'3 a.m. page',
  text:'You\'re paged: possible ransomware on a file server. You\'re half-asleep.',
  choices:[
    { t:'Isolate the host from the network first, ask questions second.', req:{technical:25}, fx:{perf:8, technical:5, stress:5}, res:'You cut its network before encryption spreads. Three machines hit instead of three hundred. Hero status.' },
    { t:'Run a full AV scan and watch.', fx:{perf:-9, stress:6}, res:'The scan watches helplessly as the share gets encrypted. Containment beats observation, always.' },
    { t:'Wait until morning when you can think clearly.', fx:{perf:-12, stress:2}, res:'Morning you inherits a much bigger fire. Some pages can\'t wait for coffee.' }
  ]},
{ id:'t_report', cats:['technical'], type:'Pentest', title:'The report nobody reads',
  text:'You found a brutal SQL injection. Your draft report is 40 pages of raw tool output.',
  choices:[
    { t:'Lead with a one-page exec summary, then the proof, then remediation steps.', req:{communication:30}, fx:{perf:8, communication:6, technical:2}, res:'Leadership actually reads it and funds the fix. A finding nobody acts on is just trivia.' },
    { t:'Ship the raw output. The data speaks for itself.', fx:{perf:-5, stress:-1}, res:'The data mumbles. The dev team skims it, shrugs, and the vuln ships to prod.' },
    { t:'Just verbally tell the dev lead over coffee.', fx:{perf:-3, communication:2}, res:'No paper trail, no ticket, no fix. When it gets exploited there\'s no record you ever found it.' }
  ]},
{ id:'t_zero', cats:['technical'], type:'Threat Intel', title:'Zero-day in the wild',
  text:'Twitter is on fire about an actively-exploited zero-day in software you definitely run. No patch yet.',
  choices:[
    { t:'Hunt for indicators of compromise across your fleet now.', req:{technical:45}, fx:{perf:9, technical:7, stress:5}, res:'You assume breach, hunt hard, and find nothing — which you can now prove. That confidence is gold.' },
    { t:'Apply the vendor\'s mitigation config and document it.', fx:{perf:6, technical:3, stress:2}, res:'Solid, measured response. You reduce exposure and have a clean trail for the after-action.' },
    { t:'Wait for the official patch.', fx:{perf:-8, stress:1}, res:'"Wait" is not a strategy during active exploitation. Leadership asks pointed questions later.' }
  ]},
{ id:'t_automate', cats:['technical'], type:'Engineering', title:'The toil tax',
  text:'Your team spends 10 hours a week manually pulling the same compliance evidence.',
  choices:[
    { t:'Spend a week scripting it once, save it forever.', req:{technical:40}, fx:{perf:8, technical:6, business:3, stress:-3}, res:'One script, 500 hours/year reclaimed. People start bringing you their toil to automate.' },
    { t:'Keep doing it manually — it\'s "only" 10 hours.', fx:{perf:-2, stress:4}, res:'Ten hours a week becomes your identity. The work expands to fill the dread.' },
    { t:'Push the task onto the newest hire.', fx:{perf:-4, leadership:-2, stress:-2}, res:'You solved your problem and created theirs. Morale dips and so does your standing.' }
  ]},
{ id:'t_segment', cats:['technical'], type:'Architecture', title:'Flat as a pancake',
  text:'You discover the entire corporate network is flat — one breach and it\'s all reachable. A segmentation project would be huge.',
  choices:[
    { t:'Propose phased microsegmentation, crown jewels first.', req:{technical:55}, fx:{perf:9, technical:6, business:4, stress:3}, res:'Phasing it makes a terrifying project fundable. The board likes "biggest risk first."' },
    { t:'Try to re-architect everything at once.', fx:{perf:-6, stress:8}, res:'Big-bang networking projects are where careers go to die. Three months in, it stalls.' },
    { t:'Note it in the risk register and move on.', fx:{perf:-2, business:1}, res:'Documenting a risk isn\'t the same as reducing it. The auditor will love finding your own note.' }
  ]},
{ id:'t_falsepos', cats:['technical'], type:'Detection', title:'The CEO\'s "malware"',
  text:'A new EDR rule keeps quarantining a tool the CEO personally loves. They are... vocal about it.',
  choices:[
    { t:'Investigate, confirm it\'s benign, then write a tight exception with monitoring.', req:{technical:35}, fx:{perf:7, technical:4, communication:3}, res:'You don\'t just cave — you verify, then allow it safely. The CEO feels heard and you stay rigorous.' },
    { t:'Disable the whole rule to stop the complaints.', fx:{perf:-7, technical:-2}, res:'You disabled a detection for the entire company to please one person. That rule existed for a reason.' },
    { t:'Tell the CEO to use a different tool. Rules are rules.', fx:{perf:-4, communication:-3, stress:2}, res:'Technically correct, politically radioactive. Security that ignores the business gets ignored back.' }
  ]},
{ id:'t_logs', cats:['technical'], type:'Forensics', title:'No logs, no glory',
  text:'Mid-investigation you realize the compromised server had logging disabled to "save disk space."',
  choices:[
    { t:'Reconstruct the timeline from network flows and adjacent systems.', req:{technical:50}, fx:{perf:8, technical:7, stress:5}, res:'You triangulate the attack from NetFlow, DNS, and a neighbor\'s logs. Resourcefulness wins.' },
    { t:'Conclude "insufficient evidence" and close it.', fx:{perf:-6, stress:-2}, res:'You leave a live question mark on a possibly-breached box. That\'s how a small incident becomes a headline.' },
    { t:'Make logging mandatory everywhere, retroactively blame ops.', fx:{perf:0, leadership:-2, communication:-2}, res:'The policy is right; the blame game is not. Ops stops cooperating with you.' }
  ]},
{ id:'t_supply', cats:['technical'], type:'Supply Chain', title:'A dependency goes rogue',
  text:'A popular npm package your apps use just pushed a version that exfiltrates env variables.',
  choices:[
    { t:'Pin versions, audit the lockfiles, rotate any exposed secrets.', req:{technical:45}, fx:{perf:9, technical:6, stress:4}, res:'You catch it before a deploy ships the poisoned version. Then you build a dependency policy. Mature.' },
    { t:'Tell devs to "just be careful" about packages.', fx:{perf:-6, leadership:-1}, res:'"Be careful" is not a control. The next bad package walks right in.' },
    { t:'Ban all open-source dependencies effective immediately.', fx:{perf:-8, business:-3, stress:3}, res:'You\'d have to ban most modern software. Engineering revolts; the ban lasts six hours.' }
  ]},
{ id:'t_handoff', cats:['technical'], type:'Mentoring', title:'The junior\'s mistake',
  text:'A junior analyst closed a real incident as a false positive. It\'s back, bigger.',
  choices:[
    { t:'Fix it with them, walking through what to look for next time.', req:{leadership:25}, fx:{perf:7, leadership:5, communication:3, stress:2}, res:'You turn a miss into the best training they\'ll get all year. They never make it again.' },
    { t:'Quietly fix it yourself and say nothing.', fx:{perf:3, technical:2, stress:3}, res:'Fire\'s out, but the junior learns nothing and you become the single point of failure.' },
    { t:'Call them out in the team channel as a lesson.', fx:{perf:-4, leadership:-4, communication:-3}, res:'Public shaming teaches one thing: hide your mistakes. Now everyone does.' }
  ]},
{ id:'t_cloud', cats:['technical'], type:'Cloud', title:'The open bucket',
  text:'A researcher emails you: a storage bucket with customer data is world-readable. They\'re "thinking about tweeting it."',
  choices:[
    { t:'Lock it down, assess exposure, and thank the researcher warmly.', req:{technical:35}, fx:{perf:8, technical:5, communication:4}, res:'You fix it in an hour and treat the reporter like a friend, not a threat. They quietly delete the draft tweet.' },
    { t:'Threaten the researcher with legal action.', fx:{perf:-10, communication:-5, stress:5}, res:'Now they DO tweet it, plus screenshots of your threat. A textbook way to turn a save into a scandal.' },
    { t:'Lock it down and ignore the researcher.', fx:{perf:3, technical:3, communication:-2}, res:'Bucket\'s fixed but the researcher feels stiffed. Goodwill is a control too.' }
  ]},
{ id:'t_deepwork', cats:['technical'], type:'Focus', title:'Death by meetings',
  text:'Your calendar is now 80% meetings and your actual security backlog is rotting.',
  choices:[
    { t:'Block two no-meeting focus mornings a week and defend them.', req:{communication:30}, fx:{perf:7, technical:4, stress:-4}, res:'Protected focus time clears your backlog and your head. People respect the boundary.' },
    { t:'Accept every invite and grind nights to keep up.', fx:{perf:2, technical:1, stress:9}, res:'You keep up for a while. Then you don\'t. Burning the candle at both ends just makes a shorter candle.' },
    { t:'Decline everything and hide.', fx:{perf:-5, communication:-3}, res:'You did get heads-down — and missed the meeting where your project got defunded.' }
  ]},
{ id:'t_legacy', cats:['technical'], type:'Architecture', title:'The unkillable server',
  text:'A 14-year-old unpatched Windows box runs payroll. Nobody knows how. Everyone\'s scared to touch it.',
  choices:[
    { t:'Map dependencies, build a tested migration, isolate it meanwhile.', req:{technical:60}, fx:{perf:9, technical:7, business:3, stress:5}, res:'You don\'t yank the band-aid — you replace the wound. Months later it\'s gone and payroll never blinked.' },
    { t:'Unplug it and see who screams.', fx:{perf:-9, stress:7}, res:'Payroll fails. A lot of people scream. "Scream test" is a meme, not a methodology, at this scale.' },
    { t:'Leave it. It\'s worked for 14 years.', fx:{perf:-4, business:-2}, res:'It works right up until the day it\'s ransomware\'s favorite front door. You knew, and you let it ride.' }
  ]},

/* ---------------- PEOPLE / MANAGEMENT ---------------- */
{ id:'p_star', cats:['people'], type:'Talent', title:'Your best engineer is leaving',
  text:'Your strongest engineer hands in their notice — a competitor offered 30% more.',
  choices:[
    { t:'Have a real conversation: what do they actually want besides money?', req:{leadership:30}, fx:{perf:7, leadership:6, communication:4, stress:3}, res:'Turns out they wanted growth, not just cash. You craft a path and a counter. They stay — and tell others why.' },
    { t:'Immediately offer to beat the salary, no questions.', fx:{perf:1, business:-2, stress:2, money:0}, res:'They stay for now, but you set a precedent: threaten to leave, get a raise. Your budget — and your retention — wobble.' },
    { t:'Let them go. People are replaceable.', fx:{perf:-7, leadership:-4, stress:4}, res:'They take two teammates and your incident response knowledge with them. Replaceable, sure — at triple the cost.' }
  ]},
{ id:'p_conflict', cats:['people'], type:'Conflict', title:'Two seniors at war',
  text:'Two senior team members can\'t stand each other and it\'s poisoning standups.',
  choices:[
    { t:'Meet each separately, find the real issue, then mediate together.', req:{leadership:35}, fx:{perf:8, leadership:6, communication:5, stress:4}, res:'The "feud" was a misread Slack message from months ago. You clear it and they\'re fine. Most wars are misunderstandings.' },
    { t:'Tell them to "be professional" and move on.', fx:{perf:-5, leadership:-3, stress:3}, res:'"Be professional" solves nothing. The cold war goes underground and the whole team tiptoes.' },
    { t:'Reorganize so they never interact.', fx:{perf:-2, leadership:-1, stress:2}, res:'You built a wall instead of a bridge. It works until the next reorg forces them back together.' }
  ]},
{ id:'p_burnout', cats:['people'], type:'Wellbeing', title:'A teammate is fraying',
  text:'One of your analysts has been working weekends, snapping at people, and missed two deadlines.',
  choices:[
    { t:'Check in privately, redistribute load, and mean it.', req:{leadership:30}, fx:{perf:7, leadership:6, communication:4, stress:2}, res:'They were drowning silently. You throw a real lifeline, not platitudes. Weeks later they thank you. Loyalty earned.' },
    { t:'Put them on a performance improvement plan for the missed deadlines.', fx:{perf:-6, leadership:-5, stress:5}, res:'You punished burnout instead of treating it. They quit; the team watches how you handle people who struggle.' },
    { t:'Ignore it; they\'ll sort themselves out.', fx:{perf:-4, leadership:-3, stress:2}, res:'They don\'t. The fraying spreads. "They\'ll be fine" is the most expensive sentence in management.' }
  ]},
{ id:'p_hire', cats:['people'], type:'Hiring', title:'The brilliant jerk',
  text:'A candidate is technically dazzling but three references hint they\'re toxic to work with.',
  choices:[
    { t:'Pass. Culture is a control you can\'t patch later.', req:{leadership:40}, fx:{perf:6, leadership:6, communication:3}, res:'Hard to walk away from raw talent, but you protect the five people you already have. The team notices what you value.' },
    { t:'Hire them — talent solves everything.', fx:{perf:-3, leadership:-4, stress:5}, res:'Three months later your two best people are interviewing elsewhere. A 10x engineer who makes ten people 0.5x is a net negative.' },
    { t:'Hire them but "keep an eye on it."', fx:{perf:-4, leadership:-2, stress:6}, res:'"Keeping an eye on it" becomes your second job. The behavior was in the references for a reason.' }
  ]},
{ id:'p_credit', cats:['people'], type:'Leadership', title:'Who gets the credit',
  text:'Your team crushed a major project. The VP congratulates YOU personally in the all-hands.',
  choices:[
    { t:'Redirect the spotlight: name the team and what each person did.', req:{leadership:30}, fx:{perf:8, leadership:7, communication:4}, res:'You give the credit away and somehow end up with more. The team would run through walls for you now.' },
    { t:'Accept graciously and mention the team in passing.', fx:{perf:2, leadership:1}, res:'Fine, forgettable. A missed chance to build the loyalty that compounds.' },
    { t:'Take the win. You did manage it, after all.', fx:{perf:-5, leadership:-6, stress:2}, res:'The team hears it. Credit-hoarding managers get exactly one great project out of a team before it stops trying.' }
  ]},
{ id:'p_layoff', cats:['people'], type:'Hard Call', title:'Cut one role',
  text:'Finance says you must eliminate one position. You have one underperformer and one expensive star.',
  choices:[
    { t:'Be honest: coach the underperformer hard first, fight to keep both a quarter.', req:{leadership:45, business:30}, fx:{perf:6, leadership:5, business:3, stress:6}, res:'You buy time, the underperformer turns a corner, and you find savings elsewhere. Sometimes the third option is the answer.' },
    { t:'Cut the underperformer cleanly and humanely.', fx:{perf:4, leadership:2, business:2, stress:5}, res:'The right call, done with dignity. You give a strong reference and real notice. Tough but respected.' },
    { t:'Cut the expensive star to save the most money.', fx:{perf:-7, business:-2, leadership:-3, stress:4}, res:'You optimized a spreadsheet and gutted your capability. The remaining team quietly updates their résumés.' }
  ]},
{ id:'p_remote', cats:['people'], type:'Policy', title:'The return-to-office order',
  text:'Leadership mandates 4 days in-office. Half your team was hired fully remote and is furious.',
  choices:[
    { t:'Push back upward with data, negotiate a hybrid exception for your team.', req:{communication:40, business:30}, fx:{perf:7, leadership:5, communication:5, stress:5}, res:'You shield your people without defying leadership outright. They learn you\'ll go to bat for them.' },
    { t:'Enforce it word-for-word. Orders are orders.', fx:{perf:-5, leadership:-4, stress:3}, res:'Three resignations in two weeks. "I was just following policy" doesn\'t retain talent.' },
    { t:'Quietly ignore it and hope nobody notices.', fx:{perf:-3, business:-2, stress:6}, res:'Someone notices. Now it looks like you can\'t manage, instead of like you protected your team openly.' }
  ]},
{ id:'p_feedback', cats:['people'], type:'1:1', title:'The defensive report',
  text:'You need to give tough feedback to a report who gets defensive at the slightest critique.',
  choices:[
    { t:'Anchor on specific behavior and impact, invite their view, agree on one change.', req:{communication:35}, fx:{perf:7, communication:6, leadership:4}, res:'Specific + collaborative defuses the defensiveness. They actually change. Feedback is a skill, and you have it.' },
    { t:'Sandwich it in compliments so it\'s painless.', fx:{perf:-2, communication:-1}, res:'The "compliment sandwich" hides the meat. They walk out having heard only the bread.' },
    { t:'Avoid it. Why ruin the relationship?', fx:{perf:-5, leadership:-4, stress:3}, res:'The problem grows, the team wonders why you tolerate it, and one day it explodes. Avoidance is just deferred cost.' }
  ]},
{ id:'p_oncallrev', cats:['people'], type:'Process', title:'Nobody wants on-call',
  text:'Your on-call rotation is hated and one person quietly covers most of it. They\'re cracking.',
  choices:[
    { t:'Redesign the rotation, add comp time, and fix the noisy alerts driving pages.', req:{leadership:35, technical:40}, fx:{perf:8, leadership:5, technical:3, stress:-2}, res:'You treat the cause (alert noise) and the symptom (unfair load). Pages drop, fairness rises, the hero stops cracking.' },
    { t:'Mandate equal rotation and call it fair.', fx:{perf:0, leadership:1, stress:3}, res:'Equal but still miserable. You spread the pain without reducing it. People grumble equally now.' },
    { t:'Keep leaning on the one reliable person.', fx:{perf:-6, leadership:-5, stress:4}, res:'They burn out and quit, taking the tribal knowledge of every 2 a.m. fix with them.' }
  ]},
{ id:'p_growth', cats:['people'], type:'Development', title:'The plateaued veteran',
  text:'A loyal 8-year veteran is reliable but hasn\'t grown in years and is blocking a promotion slot.',
  choices:[
    { t:'Find them a new challenge that fits their strengths and reignites them.', req:{leadership:40}, fx:{perf:7, leadership:6, communication:3, stress:3}, res:'You don\'t write them off — you redeploy them. They rediscover momentum and mentor the newcomer in the slot.' },
    { t:'Gently encourage them to "explore opportunities elsewhere."', fx:{perf:-2, leadership:-3, stress:4}, res:'Loyalty cuts both ways and the team is watching. Pushing out the faithful sends a chilling message.' },
    { t:'Promote around them and hope they don\'t notice.', fx:{perf:-4, leadership:-2, communication:-3}, res:'They notice. Eight years of goodwill curdles in one quarter.' }
  ]},

/* ---------------- BUDGET / PRIORITIES ---------------- */
{ id:'b_budget', cats:['budget'], type:'Budget', title:'Defend your number',
  text:'Finance wants to cut your security budget 20% "since nothing bad happened this year."',
  choices:[
    { t:'Reframe: nothing bad happened BECAUSE of the spend — show prevented-loss data.', req:{business:45, communication:40}, fx:{perf:9, business:6, communication:5, stress:4}, res:'You turn "we wasted money" into "we earned our keep" with hard numbers. The cut becomes a modest increase.' },
    { t:'Accept the cut and quietly absorb it.', fx:{perf:-6, business:-4, stress:5}, res:'You signaled the budget was padded. Next year they cut again. Silence is read as agreement.' },
    { t:'Threaten that a breach is "inevitable" without the money.', fx:{perf:-4, communication:-3, business:-2}, res:'Fear-based budgeting works once. The CFO has heard "the sky is falling" too often to fund it again.' }
  ]},
{ id:'b_tool', cats:['budget'], type:'Vendor', title:'The shiny platform',
  text:'A vendor pitches a $2M "AI-powered" platform that supposedly replaces five of your tools.',
  choices:[
    { t:'Run a scoped proof-of-value against real use cases before committing a dollar.', req:{business:40, technical:35}, fx:{perf:8, business:6, technical:3}, res:'The PoV reveals it does two of five jobs well. You buy a smaller scope and save $1.4M. Rigor pays.' },
    { t:'Buy it. Consolidation sounds great on a slide.', fx:{perf:-6, business:-4, money:0, stress:4}, res:'Six months and $2M later, you\'re running the old five tools AND the new one. Shelfware is expensive.' },
    { t:'Refuse all new tools on principle.', fx:{perf:-3, business:-2, technical:-2}, res:'Reflexive "no" is as lazy as reflexive "yes." You miss a genuine efficiency and look rigid.' }
  ]},
{ id:'b_priority', cats:['budget'], type:'Prioritization', title:'Three fires, one team',
  text:'You have budget and bodies for ONE of: a SOC upgrade, an IAM overhaul, or a compliance gap closure due in 60 days.',
  choices:[
    { t:'Close the compliance gap first — the deadline is real and the rest can wait a quarter.', req:{business:45}, fx:{perf:8, business:6, stress:3}, res:'You sequence by hard constraint, not by what\'s exciting. The audit passes; the other two get funded next cycle.' },
    { t:'Do the IAM overhaul — identity is the new perimeter, after all.', fx:{perf:1, business:2, technical:2, stress:4}, res:'Defensible in theory, but you blew the compliance deadline and ate a fine. Right answer, wrong order.' },
    { t:'Try to do all three at 33% effort.', fx:{perf:-7, business:-3, stress:8}, res:'Three half-finished projects help no one. Spreading thin is how you fail at everything simultaneously.' }
  ]},
{ id:'b_chargeback', cats:['budget'], type:'Politics', title:'The land grab',
  text:'A peer director proposes absorbing your cloud-security budget into their platform team "for efficiency."',
  choices:[
    { t:'Meet them first, find the shared goal, propose a joint roadmap you co-own.', req:{communication:45, business:40}, fx:{perf:8, business:5, communication:6, stress:4}, res:'You convert a turf war into an alliance. You keep your budget AND gain a powerful ally. Politics, played well.' },
    { t:'Fight it loudly in the leadership meeting.', fx:{perf:-3, communication:-3, stress:6}, res:'You win the budget but make an enemy who outranks you next reorg. Pyrrhic.' },
    { t:'Let it go to avoid conflict.', fx:{perf:-7, business:-5, leadership:-3}, res:'You ceded control of your own mandate. Your team now reports through someone who doesn\'t prioritize security.' }
  ]},
{ id:'b_roi', cats:['budget'], type:'Strategy', title:'Prove the ROI',
  text:'The board wants every security investment justified with hard ROI. Security ROI is famously slippery.',
  choices:[
    { t:'Use risk-quantified loss avoidance and benchmark against peer breach costs.', req:{business:55, communication:45}, fx:{perf:9, business:7, communication:5, stress:4}, res:'You speak the board\'s language — dollars and probability, not FUD. They start treating security as investment, not cost.' },
    { t:'Argue security is "priceless" and shouldn\'t need ROI.', fx:{perf:-6, communication:-4, business:-3}, res:'"Priceless" reads as "I can\'t measure it." The board funds what it can measure.' },
    { t:'Pad the numbers to make the case look better.', fx:{perf:-8, business:-4, stress:6}, res:'A sharp board member checks one figure. Now your credibility — your only real currency up here — is shot.' }
  ]},
{ id:'b_debt', cats:['budget'], type:'Tradeoff', title:'Ship date vs. security gate',
  text:'A flagship product launch is in 2 weeks. Your team found a serious-but-not-critical flaw that would slip the date.',
  choices:[
    { t:'Quantify the risk, propose a compensating control to launch on time, fix fast-follow.', req:{business:45, technical:45}, fx:{perf:8, business:5, technical:4, stress:5}, res:'You become the leader who finds the safe yes. The launch ships with a guardrail and a committed fix date.' },
    { t:'Block the launch. Security doesn\'t negotiate.', fx:{perf:-4, business:-4, communication:-3, stress:4}, res:'You\'re technically right and organizationally radioactive. "The team that says no" gets routed around.' },
    { t:'Wave it through silently to be liked.', fx:{perf:-7, technical:-3, stress:6}, res:'It ships, it breaks, and the post-mortem finds you knew. The one time saying no mattered, you didn\'t.' }
  ]},
{ id:'b_insurance', cats:['budget'], type:'Risk', title:'The cyber-insurance questionnaire',
  text:'Your cyber-insurance renewal hinges on a questionnaire. Honest answers mean a 60% premium hike; "optimistic" answers don\'t.',
  choices:[
    { t:'Answer honestly, then use the hike to fund the gaps it exposes.', req:{business:40}, fx:{perf:8, business:6, stress:4}, res:'You turn a painful renewal into a funded roadmap. And if you ever claim, the policy actually pays.' },
    { t:'Answer "optimistically." Everyone does it.', fx:{perf:-9, business:-3, stress:5}, res:'Until you have a breach and they deny the claim for material misrepresentation. The cheap policy was worthless.' },
    { t:'Drop the insurance to avoid the whole question.', fx:{perf:-6, business:-5}, res:'You traded a premium for unbounded liability. The board did not authorize that bet.' }
  ]},

/* ---------------- EXECUTIVE / BOARD ---------------- */
{ id:'e_breach', cats:['executive'], type:'Crisis', title:'You\'ve been breached',
  text:'Confirmed: attackers exfiltrated customer data. Legal, PR, the CEO and the board all want different things, now.',
  choices:[
    { t:'Run a calm, single source of truth: facts, regulatory clock, customer-first comms plan.', req:{communication:60, business:50}, fx:{perf:10, communication:7, business:5, stress:8}, res:'You become the steady hand in the storm. Disclosure is timely, honest, and well-managed. The company survives its worst week intact.' },
    { t:'Downplay it publicly while you "investigate."', fx:{perf:-12, communication:-6, business:-4, stress:9}, res:'The truth leaks, the cover-up becomes the story, and a regulator opens an inquiry. The lie cost more than the breach.' },
    { t:'Blame the vendor and deflect.', fx:{perf:-9, communication:-5, leadership:-4, stress:7}, res:'Customers don\'t care whose fault it is — they care whose name is on the door. Deflection reads as weakness.' }
  ]},
{ id:'e_board', cats:['executive'], type:'Boardroom', title:'The board wants a number',
  text:'A board member asks point-blank: "On a scale of 1-10, how secure are we?"',
  choices:[
    { t:'Refuse the false precision; give a risk-based picture with the top 3 exposures and the plan.', req:{communication:65, business:55}, fx:{perf:10, communication:7, business:5, stress:5}, res:'You resist the trap of a meaningless number and educate the board instead. They leave more confident, and so do you.' },
    { t:'Say "8 out of 10" because it sounds reassuring.', fx:{perf:-7, communication:-5, business:-3}, res:'Next breach, that "8" is on a slide in the lawsuit. Never give a number you can\'t defend under oath.' },
    { t:'Say "3 out of 10" to scare loose more budget.', fx:{perf:-6, communication:-4, business:-4, stress:4}, res:'You spook the board into questioning whether YOU\'RE the problem. Fear aimed at yourself backfires.' }
  ]},
{ id:'e_peer', cats:['executive'], type:'C-Suite', title:'The CTO wants to move fast',
  text:'The CTO is pushing a aggressive AI product launch that you believe carries real data-exposure risk. They outrank your influence with the CEO.',
  choices:[
    { t:'Partner early: embed your team, define guardrails that let them move fast safely.', req:{communication:60, technical:50}, fx:{perf:10, communication:6, business:4, technical:3}, res:'You become the CTO\'s ally, not their speed bump. The product ships fast AND safe, and you get the credit for both.' },
    { t:'Escalate to the CEO over the CTO\'s head.', fx:{perf:-6, communication:-5, stress:7}, res:'You win the battle and a permanent rival in the C-suite. The CEO now sees you as someone who can\'t resolve things peer-to-peer.' },
    { t:'Document your objection and step aside.', fx:{perf:-5, business:-3}, res:'A paper trail protects you but doesn\'t protect the company. "I told you so" is a poor substitute for "I helped fix it."' }
  ]},
{ id:'e_regulator', cats:['executive'], type:'Regulatory', title:'The regulator calls',
  text:'A regulator opens a formal inquiry into your industry\'s security practices. They want documentation. Yours is... incomplete.',
  choices:[
    { t:'Cooperate fully, present what you have honestly, and show a credible remediation roadmap.', req:{communication:55, business:50}, fx:{perf:9, communication:6, business:5, stress:7}, res:'Regulators reward candor and a plan over polish. You turn an inquiry into a working relationship.' },
    { t:'Stall and produce the minimum required.', fx:{perf:-7, business:-4, stress:6}, res:'Adversarial posture invites a deeper look. They find what you hid and the penalty doubles.' },
    { t:'Have legal fight every request aggressively.', fx:{perf:-5, communication:-4, business:-3}, res:'Lawyers win some motions; the company loses the relationship and the headline. Sometimes the legal win is the business loss.' }
  ]},
{ id:'e_culture', cats:['executive'], type:'Org', title:'Security is "the department of no"',
  text:'An employee survey reveals the whole company sees security as a blocker. Morale toward your org is at rock bottom.',
  choices:[
    { t:'Launch a "secure by default, easy by design" program — make the safe path the easy path.', req:{communication:60, business:55}, fx:{perf:10, communication:6, business:5, leadership:4}, res:'You stop policing behavior and start engineering it. A year later, security is "the team that unblocks us." Legacy-defining.' },
    { t:'Mandate more security training to fix the "attitude."', fx:{perf:-5, communication:-3, stress:3}, res:'More mandatory training for a perception problem is gasoline on the fire. The next survey is worse.' },
    { t:'Dismiss the survey — security isn\'t a popularity contest.', fx:{perf:-7, leadership:-5, business:-4}, res:'Culture you ignore becomes culture that ignores you. Shadow IT blooms; your controls get routed around.' }
  ]},
{ id:'e_war', cats:['executive'], type:'Geopolitics', title:'Nation-state weather',
  text:'Intelligence suggests companies in your sector are being targeted by a sophisticated state-backed group. The board is nervous.',
  choices:[
    { t:'Brief the board with calm specifics: likely TTPs, your readiness, and the 90-day hardening plan.', req:{communication:65, technical:50, business:50}, fx:{perf:10, communication:6, business:5, technical:3, stress:6}, res:'You translate scary headlines into a clear-eyed plan. The board funds the hardening and trusts you to lead it.' },
    { t:'Reassure them everything\'s fine to avoid alarm.', fx:{perf:-8, communication:-5, business:-3}, res:'False calm is a liability. When something does happen, "you said we were fine" is the first quote in the inquiry.' },
    { t:'Recommend pausing all digital initiatives until the threat passes.', fx:{perf:-7, business:-6, communication:-3}, res:'You can\'t freeze the business indefinitely. Recommending paralysis makes you look unable to manage risk, only avoid it.' }
  ]},
{ id:'e_succession', cats:['executive'], type:'Leadership', title:'Build your bench',
  text:'The CEO asks who could do your job if you got hit by a bus. You realize you\'ve made yourself indispensable — and that\'s a problem.',
  choices:[
    { t:'Name two deputies and start visibly developing them for the role.', req:{leadership:55}, fx:{perf:9, leadership:7, communication:4}, res:'Great leaders build successors, not dependencies. You free yourself to think bigger and the board notes your maturity.' },
    { t:'Say "honestly, no one" — and feel secretly secure about it.', fx:{perf:-6, leadership:-5, stress:4}, res:'Indispensability is a trap, not a moat. It caps your own growth and worries the board about single points of failure.' },
    { t:'Name someone unqualified to avoid creating a rival.', fx:{perf:-5, leadership:-4, communication:-3}, res:'The CEO sees through it. Protecting your throne instead of the mission is exactly the wrong instinct at this level.' }
  ]},
{ id:'e_ethics', cats:['executive'], type:'Ethics', title:'The quiet ask',
  text:'The CEO privately asks you to delay disclosing a breach until after the quarter closes, "to protect the stock."',
  choices:[
    { t:'Respectfully refuse and lay out the legal and reputational reality, in writing.', req:{communication:60, business:55}, fx:{perf:10, communication:6, business:5, stress:9}, res:'You hold the line on the one thing you can never get back: integrity. It\'s tense — but it\'s the decision that defines a real CISO.' },
    { t:'Go along with it. The CEO is the boss.', fx:{perf:-14, communication:-6, business:-6, stress:9}, res:'Securities fraud is not in your job description. When it unravels, "the CEO told me to" protects no one — least of all you.' },
    { t:'Quietly leak it to force the issue.', fx:{perf:-8, communication:-5, leadership:-4, stress:8}, res:'You may be morally right, but you torched trust and process. There were lawful ways to be right that you skipped.' }
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
