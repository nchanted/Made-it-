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
{ id:'t_phish', cats:['technical'], type:'Incident', title:'The boss clicked a bad link',
  text:'Your finance chief forwards a polished email that looked like a document to sign, then admits they typed their company password into the page it linked to. That password may now be in a stranger\u2019s hands \u2014 and they could already be reading email or trying to move money.',
  choices:[
    { t:'Reset the password and forcibly log out every active session right now, then check what was touched.', req:{technical:30}, fx:{perf:9, technical:5, stress:3}, res:'You kill the stolen login within minutes and confirm nothing was sent. Stop the bleeding first \u2014 textbook.', failRes:'You fumble the session cleanup, miss one active login, and the intruder quietly sets up mail-forwarding before you catch it.' },
    { t:'Reset the password and switch on a second login step for that account.', fx:{perf:4, technical:2, stress:1}, res:'A clean, solid response. The account is locked down and a second factor now blocks the stolen password.' },
    { t:'Log a ticket and send the chief some tips on spotting fake emails.', fx:{perf:-9, stress:-1}, res:'By the time anyone reads the ticket, finance threads are being forwarded to a stranger\u2019s inbox. Far too slow.' }
  ]},
{ id:'t_patch', cats:['technical'], type:'Vulnerability', title:'Severe flaw, Friday at 5pm',
  text:'A serious flaw \u2014 rated 9.8 out of 10 \u2014 is announced in the network gear that routes traffic to all your public websites. A fix exists, but installing it means a short planned outage, and attackers usually start probing flaws like this within hours.',
  choices:[
    { t:'Put a temporary shield rule in front of it tonight to block the attack, then schedule the real fix with sign-off.', req:{technical:40}, fx:{perf:8, technical:5, stress:2}, res:'You blunt the exploit with no outage and still fix it properly through change control. Elegant.', failRes:'Your stop-gap rule is misconfigured \u2014 it blocks real customers for an hour while leaving the actual hole open. Embarrassing.' },
    { t:'Take the short outage now and install the proper fix immediately.', fx:{perf:6, technical:3, stress:6}, res:'Twenty noisy minutes of downtime and some grumbling from operations \u2014 but you\u2019re safe before the weekend wave of attacks.' },
    { t:'Wait for the normal monthly maintenance window.', fx:{perf:-11, stress:2}, res:'It\u2019s scanned and exploited Saturday night. You spend Sunday in a crisis room instead of a maintenance window.' }
  ]},
{ id:'t_alert', cats:['technical'], type:'Triage', title:'Drowning in false alarms',
  text:'Your monitoring tools logged 400 warnings overnight, and almost all are false alarms from one badly-tuned rule. Somewhere in that noise there might be a real attack, and leadership wants to know there isn\u2019t.',
  choices:[
    { t:'Fix the noisy rule first to clear the false alarms, then investigate whatever\u2019s actually left.', req:{technical:30}, fx:{perf:8, technical:6, stress:-2}, res:'The queue collapses to 16 real items \u2014 one of which is a genuine attempt to burrow deeper into the network. Great catch.', failRes:'You tweak the rule wrong and accidentally silence a whole category of real alerts too. The gap surfaces later.' },
    { t:'Work through the queue by hand, flagging anything suspicious.', fx:{perf:3, technical:2, stress:7}, res:'You get through it and miss nothing, but it eats your whole week and clearly doesn\u2019t scale.' },
    { t:'Switch the noisy rule off completely and move on.', fx:{perf:-7, stress:-3}, res:'You also switched off the one detection that mattered. The miss shows up two weeks later. Ouch.' }
  ]},
{ id:'t_creds', cats:['technical'], type:'Investigation', title:'Master passwords left in public',
  text:'Reviewing some code, you spot a set of cloud account keys \u2014 essentially master passwords for company servers \u2014 accidentally published in a code repository anyone on the internet can read. They\u2019ve sat there for three weeks.',
  choices:[
    { t:'Cancel the keys, comb the cloud activity logs for misuse, then fix the code and add a guard against recurrence.', req:{technical:35}, fx:{perf:9, technical:6, stress:4}, res:'Cancelling first saves you: the logs show only a harmless bot scan. You add an automatic check so it can\u2019t happen again.', failRes:'You cancel the wrong key set first and briefly break a live service while the exposed keys stay active. Rough.' },
    { t:'Cancel and reissue the keys right away.', fx:{perf:5, technical:2, stress:2}, res:'The exposed keys are dead. You didn\u2019t dig into the logs, but the immediate danger is gone.' },
    { t:'Just delete the file from the repository.', fx:{perf:-8, technical:-1}, res:'The keys live on forever in the repository\u2019s history and were likely copied long ago. Deleting isn\u2019t cancelling.' }
  ]},
{ id:'t_oncall', cats:['technical'], type:'On-call', title:'A 3 a.m. phone call',
  text:'Your phone wakes you at 3 a.m.: a shared company file server may be infected with ransomware \u2014 software that locks up files and demands payment. Every minute it spreads to more machines. You\u2019re half asleep.',
  choices:[
    { t:'Disconnect the infected server from the network immediately, then investigate.', req:{technical:25}, fx:{perf:8, technical:5, stress:5}, res:'You cut it off before the lock-up spreads. Three machines hit instead of three hundred. Hero.', failRes:'Groggy, you pull the wrong machine offline first; the infection jumps to two more servers before you contain it.' },
    { t:'Call in the on-call senior engineer and start a response bridge while you watch it.', fx:{perf:3, communication:2, stress:4}, res:'Backup arrives in 15 minutes and you contain it together. Slower than ideal, but no heroics gone wrong.' },
    { t:'Let it run and deal with it properly in the morning.', fx:{perf:-12, stress:2}, res:'Morning-you inherits a far bigger fire. Some calls can\u2019t wait for coffee.' }
  ]},
{ id:'t_report', cats:['technical'], type:'Reporting', title:'The report nobody will read',
  text:'You found a serious flaw that would let an attacker read your customer database. Your draft write-up is 40 pages of raw tool output that no executive will ever actually read.',
  choices:[
    { t:'Rewrite it: one plain-English page on the risk and the fix up front, with the technical proof behind it.', req:{communication:30}, fx:{perf:8, communication:6, technical:2}, res:'Leadership actually reads it and funds the fix the same week. A finding nobody acts on is just trivia.', failRes:'You over-simplify and strip out too much; executives are confused, ask for a redo, and the fix slips a month.' },
    { t:'Add a short summary at the top and send the full report.', fx:{perf:4, communication:2}, res:'The summary helps; the right people skim it and a fix gets scheduled, if not rushed.' },
    { t:'Send the raw 40 pages \u2014 the data speaks for itself.', fx:{perf:-5, stress:-1}, res:'The data mumbles. The team skims, shrugs, and the flaw ships to customers anyway.' }
  ]},
{ id:'t_zero', cats:['technical'], type:'Threat Intel', title:'A brand-new flaw, already being used',
  text:'Security circles are buzzing: attackers are right now exploiting a freshly-discovered flaw in software you definitely run, and there\u2019s no official fix yet. The clock is ticking.',
  choices:[
    { t:'Assume you might already be hit and hunt across every system for signs of intrusion now.', req:{technical:45}, fx:{perf:9, technical:7, stress:5}, res:'You hunt hard and find nothing \u2014 and can now prove it. That confidence is worth its weight in gold.', failRes:'Your hunt is sloppy and inconclusive; you raise an alarm you can\u2019t back up and burn a day chasing ghosts.' },
    { t:'Apply the vendor\u2019s recommended temporary workaround and document it.', fx:{perf:6, technical:3, stress:2}, res:'A measured response: you cut your exposure and keep a clean record for the review afterward.' },
    { t:'Wait for the official patch to arrive.', fx:{perf:-8, stress:1}, res:'\u201CWait\u201D isn\u2019t a plan during an active attack. Leadership asks pointed questions later.' }
  ]},
{ id:'t_automate', cats:['technical'], type:'Engineering', title:'Death by busywork',
  text:'Your team burns about 10 hours every week manually gathering the same evidence to prove the company follows its own security rules. It\u2019s mind-numbing and easy to get wrong.',
  choices:[
    { t:'Spend a week building a tool to collect it automatically, forever.', req:{technical:40}, fx:{perf:8, technical:6, business:3, stress:-3}, res:'One week of work reclaims hundreds of hours a year. Soon everyone\u2019s bringing you their tedious chores to automate.', failRes:'The automation is half-baked and spits out wrong numbers an auditor later questions; you scramble to rebuild trust in it.' },
    { t:'Build a simple checklist and template to make the manual work faster.', fx:{perf:4, technical:2, stress:-1}, res:'Not glamorous, but the task gets a little quicker and less error-prone each week.' },
    { t:'Hand the whole chore to the newest hire.', fx:{perf:-4, leadership:-2, stress:-2}, res:'You solved your problem by creating theirs. Morale dips, and so does your standing.' }
  ]},
{ id:'t_segment', cats:['technical'], type:'Architecture', title:'The network is wide open inside',
  text:'You realize that inside the company, everything is reachable from everything else \u2014 so if an attacker breaks into any one laptop, they can reach the crown-jewel systems too. Walling it off properly would be a massive project.',
  choices:[
    { t:'Propose doing it in phases, protecting the most critical systems first.', req:{technical:55}, fx:{perf:9, technical:6, business:4, stress:3}, res:'Phasing turns a terrifying project into a fundable one. Leadership loves \u201Cbiggest risk first.\u201D', failRes:'You underestimate the complexity; the first phase drags, breaks a key app, and sours everyone on the whole idea.' },
    { t:'Start small: wall off just the crown-jewel systems behind tighter controls.', fx:{perf:5, technical:3, stress:2}, res:'A modest but real improvement. The most important systems are now harder to reach, even if the rest waits.' },
    { t:'Note it in the risk log and move on.', fx:{perf:-2, business:1}, res:'Writing down a risk isn\u2019t reducing it. The auditor will enjoy finding your own note about the gap.' }
  ]},
{ id:'t_falsepos', cats:['technical'], type:'Detection', title:'The CEO\u2019s favorite app keeps getting blocked',
  text:'A new protective tool keeps blocking a piece of software the CEO personally loves and uses daily. The CEO is\u2026 very vocal about wanting it to stop.',
  choices:[
    { t:'Check whether the app is actually safe, confirm it, then carefully allow it with extra monitoring.', req:{technical:35}, fx:{perf:7, technical:4, communication:3}, res:'You don\u2019t just cave \u2014 you verify, then allow it safely. The CEO feels heard and you keep your standards.', failRes:'You rush the exception without really checking, and the \u201Csafe\u201D app turns out to carry real risk. Now you own that.' },
    { t:'Add a narrow, temporary exception just for the CEO\u2019s machine while you look into it.', fx:{perf:4, communication:2, stress:1}, res:'A reasonable stopgap that buys goodwill and time without opening the floodgates.' },
    { t:'Switch the protective rule off for everyone to stop the complaints.', fx:{perf:-7, technical:-2}, res:'You disabled a company-wide protection to please one person. That rule existed for a reason.' }
  ]},
{ id:'t_logs', cats:['technical'], type:'Investigation', title:'No record of what happened',
  text:'A manager is sure an ex-employee copied files on their way out and wants proof. You go looking \u2014 and find that the system meant to record who-did-what was never switched on for that server.',
  choices:[
    { t:'Reconstruct events from other sources \u2014 backups, network records, email \u2014 to piece together a timeline.', req:{technical:45}, fx:{perf:8, technical:6, stress:4}, res:'Detective work pays off: you assemble a credible picture from the breadcrumbs and answer the question.', failRes:'You over-claim from thin evidence; when challenged, your reconstruction falls apart and you have to walk it back.' },
    { t:'Be honest about the gap and switch on proper logging everywhere now.', fx:{perf:5, technical:3, communication:2, stress:1}, res:'You can\u2019t fully answer this one, but you make sure you\u2019re never caught blind again. Leadership respects the candor.' },
    { t:'Tell them what they want to hear and guess at the details.', fx:{perf:-9, communication:-2}, res:'Your guesses fall apart the moment lawyers get involved. Making things up always costs more later.' }
  ]},
{ id:'t_supply', cats:['technical'], type:'Supply Chain', title:'Your software vendor got hacked',
  text:'A small company whose software is installed deep inside your systems just announced it was breached. Their problem could quietly become yours.',
  choices:[
    { t:'Treat it as a possible intrusion: hunt for misuse, restrict the vendor\u2019s access, and demand details.', req:{technical:50}, fx:{perf:9, technical:6, business:3, stress:5}, res:'You move fast and find an early foothold the attackers planted. Catching it now averts a catastrophe.', failRes:'You lock the vendor\u2019s tool down so hard you break a critical workflow, and your hunt finds nothing \u2014 lots of pain, little insight.' },
    { t:'Tighten the vendor\u2019s access and watch closely while you wait for their full report.', fx:{perf:5, technical:2, business:2, stress:2}, res:'A sensible middle path: you reduce the risk and stay alert without breaking anything.' },
    { t:'Take their \u201Ccustomers aren\u2019t affected\u201D statement at face value.', fx:{perf:-8, stress:1}, res:'Trusting a breached vendor\u2019s early reassurance ages badly when the affected-customer list keeps growing.' }
  ]},
{ id:'t_handoff', cats:['technical'], type:'Mentoring', title:'A teammate is drowning',
  text:'A junior colleague is clearly stuck on a tricky investigation, and it\u2019s slowing the whole team down. You could just take it off their hands.',
  choices:[
    { t:'Sit with them and coach them through it, even though it\u2019s slower today.', req:{leadership:25}, fx:{perf:6, leadership:5, communication:2, stress:1}, res:'They solve it with your guidance and level up. Next month they handle three like it alone. That\u2019s leverage.', failRes:'You mean to coach but get impatient and half-do it yourself; they feel sidelined and learn little.' },
    { t:'Take the investigation over yourself to get it done.', fx:{perf:4, technical:2, stress:3}, res:'It\u2019s resolved quickly and correctly \u2014 but your teammate is no more capable than they were yesterday.' },
    { t:'Tell them to figure it out; everyone learns the hard way.', fx:{perf:-5, leadership:-2, stress:2}, res:'They flounder, the investigation stalls, and morale dips. Sink-or-swim mostly just produces sinking.' }
  ]},
{ id:'t_cloud', cats:['technical'], type:'Cloud', title:'Engineers left the door open',
  text:'To move fast, the engineering team set up a new cloud system and left its storage open to the public internet. It holds internal data, and they\u2019re proud of how quickly they shipped.',
  choices:[
    { t:'Lock it down now, then work with them so new systems ship safe-by-default in future.', req:{technical:40}, fx:{perf:8, technical:5, communication:3, business:2}, res:'You fix today\u2019s exposure and tomorrow\u2019s: new systems now lock themselves down automatically. Engineers actually thank you.', failRes:'You slam it shut with no warning, break their demo, and turn the team against security for the next quarter.' },
    { t:'Close the public access and file a ticket explaining why.', fx:{perf:5, technical:2, stress:1}, res:'The data\u2019s no longer exposed. The fix is reactive, but it\u2019s done and documented.' },
    { t:'Ask them politely to fix it when they get a chance.', fx:{perf:-7, stress:1}, res:'\u201CWhen they get a chance\u201D arrives after a researcher emails about your exposed data. Hope wasn\u2019t a control.' }
  ]},
{ id:'t_deepwork', cats:['technical'], type:'Focus', title:'Too many interruptions',
  text:'You\u2019re mid-way through designing an important defense, but meetings and \u201Cquick questions\u201D keep shredding your day. You haven\u2019t had two uninterrupted hours all week.',
  choices:[
    { t:'Block focus time on your calendar and set clear expectations with everyone about response times.', req:{communication:30}, fx:{perf:6, communication:4, stress:-5}, res:'You reclaim real thinking time and, because you communicated it well, nobody feels ignored. Output and sanity both recover.', failRes:'Your \u201Cdo not disturb\u201D comes across as aloof; a couple of stakeholders feel brushed off and grumble to your boss.' },
    { t:'Come in early a couple of days for quiet hours.', fx:{perf:4, technical:2, stress:3}, res:'You claw back some focus, at the cost of longer days. It works, but it isn\u2019t sustainable forever.' },
    { t:'Push through and multitask harder.', fx:{perf:-3, stress:7}, res:'Switching contexts all day means everything takes twice as long and nothing\u2019s done well. Burnout creeps closer.' }
  ]},
{ id:'t_legacy', cats:['technical'], type:'Risk', title:'The ancient server nobody understands',
  text:'A 15-year-old server that nobody fully understands still runs a critical part of the business. It can\u2019t be safely updated without risking an outage, and the person who built it left years ago.',
  choices:[
    { t:'Map out exactly what it does, wrap protective controls around it, and plan a careful replacement.', req:{technical:50}, fx:{perf:8, technical:6, business:3, stress:4}, res:'You de-risk the scary box without touching it directly, and chart a path off it. Methodical and respected.', failRes:'Your investigation accidentally disturbs the fragile system and triggers the very outage you feared. Painful lesson.' },
    { t:'Wall it off from everything it doesn\u2019t absolutely need to talk to.', fx:{perf:5, technical:3, stress:2}, res:'You shrink the damage if it\u2019s ever compromised. The ancient box lives on, but more safely caged.' },
    { t:'Leave it alone \u2014 if it isn\u2019t broken, don\u2019t touch it.', fx:{perf:-4, business:-1}, res:'Ignored risk is still risk. The ticking just gets louder, and auditors love finding an unsupported system.' }
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
