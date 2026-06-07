# Made It — a cybersecurity career-ladder game

**Made It** is a single-player management/choice game for Android. You start at
the bottom of a cybersecurity org and climb — from a beige cubicle watching alert
queues to a seat on the board. Each week brings a realistic decision; your
choices move your **performance**, **stress**, four **skills**, and your
**bank balance**. Perform well and you get promoted (and bonuses). Perform badly
and your manager — then HR — start handing out warnings. Three strikes and
you're escorted out with a box of desk plants.

It plays in **portrait or landscape**, **auto-saves** continuously, and runs
fully offline.

---

## How to build the APK (no local Android SDK needed)

The project builds itself on **GitHub Actions**. You only need a GitHub account.

1. Create a new GitHub repository (e.g. `made-it`).
2. Upload **everything in this folder** to the repo (keep the structure intact),
   or push it with git:
   ```bash
   git init
   git add .
   git commit -m "Made It"
   git branch -M main
   git remote add origin https://github.com/<you>/made-it.git
   git push -u origin main
   ```
3. Open the repo's **Actions** tab. The **Build APK** workflow runs automatically
   on every push. Wait for the green check (~2–4 min the first time).
4. Click the finished run → scroll to **Artifacts** → download **`made-it-apk`**.
   Inside is `made-it.apk`.

### Want a downloadable Release instead?
Push a version tag and the workflow attaches the APK to a GitHub Release:
```bash
git tag v1.0
git push origin v1.0
```
Then find it under the repo's **Releases**.

### Install on your phone
1. Copy `made-it.apk` to your Android device.
2. Tap it. Android will ask you to allow installs from this source — enable it.
3. Open **Made It** and play.

> The build produces a **debug** APK, which is signed with Android's debug key and
> installs directly. (A release APK would need you to set up your own signing key.)

---

## How the game works

- **Pick a starting role** — Blue Team (SOC), Red Team (pen testing) or Build
  (security engineering). They start you on the technical track.
- **Each week = one decision.** The category of decision depends on your level:
  technical problems early on, then people management, then budgets, then
  executive/board-level dilemmas.
- **Meters:** Performance and Stress, plus four skills — Technical, Leadership,
  Business, Comms. The ★ marks the skill that matters most in your current role.
- **Skill-gated choices.** The best option in a scenario is often locked until
  you've built the relevant skill (shown as 🔒 Needs Leadership 30, etc.). A
  promotion gives you onboarding experience in the new discipline so you arrive
  able to compete.
- **Reviews** happen every 8 weeks: bonuses if you're doing well, warnings if
  you're not. A strong quarter can walk back a warning.
- **Promotions** appear when you meet the bar (time in role + performance +
  the right skill). At certain rungs the ladder **forks**: chase the
  individual-contributor track toward **Security Fellow**, or cross into
  management toward **CISO** and the **board**.
- **Endings:** become a Fellow, take a board seat ("You Made It"), or get fired.
  There are 14 achievements to collect across runs.

A single climb runs roughly 45–90 in-game weeks; seeing every path, ending and
achievement is several hours of play.

---

## Project layout

app/src/main/
├── AndroidManifest.xml         # single activity, rotation handled in-app
├── java/.../MainActivity.java  # thin WebView host + Back/auto-save bridge
├── res/                        # theme, colors, adaptive launcher icon (vector)
└── assets/                     # the actual game
    ├── index.html
    ├── css/style.css           # all styling + responsive layout
    └── js/
        ├── data.js             # ← career ladder, scenarios, achievements (content)
        ├── audio.js            # procedural sound effects (no audio files)
        ├── scenes.js           # SVG office scenes + evolving avatar
        ├── engine.js           # state, turn loop, reviews, promotions, saves
        ├── ui.js               # all screens, modals, toasts
        └── main.js             # bootstrap + lifecycle wiring

The Android side is deliberately tiny: it's a WebView pointed at the bundled
HTML game. No third-party libraries, no AndroidX, no Kotlin — so the CI build is
fast and very unlikely to break.

---

## Extending the game

Almost all content lives in **`app/src/main/assets/js/data.js`** and is plain
data — add to the arrays and it's picked up automatically.

**Add a scenario** — append an object to `SCENARIOS`. `cats` controls which
career stage it appears in (`technical`, `people`, `budget`, `executive`):
```js
{ id:'t_newthing', cats:['technical'], type:'Incident', title:'Your title',
  text:'The situation the player faces…',
  choices:[
    { t:'A strong, skill-gated option', req:{technical:40},
      fx:{perf:8, technical:5, stress:3}, res:'What happens if they pick it.' },
    { t:'A mediocre option', fx:{perf:-3}, res:'…' },
    { t:'A bad option',      fx:{perf:-9, stress:4}, res:'…' }
  ]},
```
`fx` keys: `perf`, `technical`, `leadership`, `business`, `communication`,
`stress`, and `money` (in dollars). Positive `perf` is good; positive `stress`
is bad. `req` locks the choice until the player's skill reaches the value.

**Add a rank / change the ladder** — edit `RANKS`. Each rank lists what you need
to be promoted *out* (`req`) and which role(s) you go *into* (`next`). Give a
rank a `forkLabel` to present multiple `next` options as a branch, or an
`ending` id to make reaching it finish the game.

**Add an office scene** — add a builder to `builders` in `scenes.js` and point a
rank's `scene` at it.

After editing, just push to GitHub — the APK rebuilds on its own.
