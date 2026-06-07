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
- **Create your character** — choose skin tone, hair style and colour, glasses
  and facial hair (or hit "Surprise me"). Your avatar appears in every office
  scene and its outfit upgrades as you climb.
- **Each week = one decision, tailored to your job.** A SOC analyst triages
  alerts, contains ransomware and hunts threats; a pen tester scopes engagements,
  handles out-of-scope discoveries and writes findings; a security engineer
  fixes leaked secrets, hardens build pipelines and designs segmentation. As you
  rise you move from hands-on technical work to people management, then budgets,
  then executive and board-level dilemmas. Many scenarios draw on real incidents
  and attacker techniques.
- **Meters:** Performance and Stress, plus four skills — Technical, Leadership,
  Business, Comms. The ★ marks the skill that matters most in your current role.
- **Read the situation.** Every option is selectable, and the game never tells
  you which is "correct." Some scenarios reward a bold, expert move; others
  reward a humble, pragmatic one. If you attempt a bold play your skills aren't
  ready for, it backfires \u2014 so weigh each choice against your own skill meters
  and the situation, not against a label.
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
career stage it appears in (`technical`, `people`, `budget`, `executive`).
Technical scenarios also take a `track` (`blue` = SOC/defence, `red` = offensive,
`build` = engineering, or `any` = cross-cutting) and a `tier` (`1` entry, `2` mid,
`3` senior, `4` architect/principal), so they only reach the right role at the
right level:
```js
{ id:'bl_newthing', cats:['technical'], track:'blue', tier:2, type:'Incident',
  title:'Your title', text:'The situation the player faces…',
  choices:[
    { t:'A bold, expertise-dependent option', req:{technical:42},
      fx:{perf:8, technical:5, stress:3}, res:'What happens if they pull it off.',
      failRes:'What happens if they attempt it without the skill.' },
    { t:'A solid pragmatic option', fx:{perf:4, technical:2}, res:'…' },
    { t:'A poor option', fx:{perf:-9, stress:4}, res:'…' }
  ]},
```
(`people`/`budget`/`executive` scenarios omit `track`/`tier`.)
`fx` keys: `perf`, `technical`, `leadership`, `business`, `communication`,
`stress`, and `money` (in dollars). Positive `perf` is good; positive `stress`
is bad. `req` marks an option as needing expertise: if the player meets it, they
get the `fx`/`res` above; if not, the move backfires (reduced/penalised effects
and an optional `failRes` message). The requirement is never shown in-game, so
players judge readiness from their own skill meters.

**Add a rank / change the ladder** — edit `RANKS`. Each rank lists what you need
to be promoted *out* (`req`) and which role(s) you go *into* (`next`). Give a
rank a `forkLabel` to present multiple `next` options as a branch, or an
`ending` id to make reaching it finish the game.

**Add an office scene** — add a builder to `builders` in `scenes.js` and point a
rank's `scene` at it.

After editing, just push to GitHub — the APK rebuilds on its own.
