/* ============================================================
   MADE IT — engine
   Owns game state, the weekly turn loop, reviews, promotions,
   warnings/firing, achievements and endings.
   State is auto-saved to localStorage on every mutation and on
   demand via MadeIt.save() (called by the Android host on pause).
   ============================================================ */
(function (global) {
  'use strict';

  var SAVE_KEY = 'madeit_save_v1';
  var REVIEW_EVERY = 8;          // weeks between performance reviews
  var FX_ORDER = ['perf', 'technical', 'leadership', 'business', 'communication', 'stress'];

  /* ---------- small helpers ---------- */
  function clamp(n, lo, hi) { return n < lo ? lo : (n > hi ? hi : n); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }
  function nowSalaryWeekly(s) { return Math.round((s.salary * 1000) / 52); }

  function rerender() { if (global.UI && global.UI.render) global.UI.render(); }
  function toast(icon, text, isAch) { if (global.UI && global.UI.toast) global.UI.toast(icon, text, isAch); }

  /* ---------- the engine object ---------- */
  var MadeIt = {
    state: null,
    ui: { route: 'title', prev: 'title', modal: null, selRole: null, pendingCompany: 0, look: null },

    /* ---- lifecycle ---- */
    init: function () {
      this.load();
      if (this.state) { Sound.setMuted(!!this.state.muted); }
      return this;
    },

    hasSave: function () {
      return !!(this.state && this.state.rank && !this.state.ended);
    },

    newState: function (roleId, name, companyIndex, look) {
      var rank = RANKS[roleId];
      var co = COMPANIES[companyIndex % COMPANIES.length];
      var entry = null;
      for (var i = 0; i < ENTRY_ROLES.length; i++) { if (ENTRY_ROLES[i].id === roleId) entry = ENTRY_ROLES[i]; }
      return {
        name: (name && name.trim()) ? name.trim() : 'You',
        company: co[0],
        sector: co[1],
        track: entry ? entry.track : 'blue',
        look: Scenes.cloneLook(look),
        rank: roleId,
        salary: rank.salary,
        perf: 60,
        stress: 25,
        skills: { technical: 12, leadership: 6, business: 6, communication: 6 },
        money: 0,
        week: 1,
        weeksAtRank: 0,
        strikes: 0,
        seen: {},               // { category: [ids] }
        achievements: [],
        flags: { promoted: false, recoveredFinal: false },
        muted: Sound.isMuted(),
        phase: 'play',
        current: null,          // current scenario id
        outcome: null,          // last outcome view
        review: null,
        promo: null,
        ended: null,
        promoSnoozed: false
      };
    },

    newGame: function (roleId, name, companyIndex, look) {
      this.state = this.newState(roleId, name, companyIndex, look);
      this.award('first_day');
      this.checkMilestones();
      this.drawScenario();
      this.save();
      this.ui.route = 'game';
      rerender();
    },

    /* ---- persistence ---- */
    save: function () {
      try {
        if (this.state) localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
      } catch (e) { /* storage full / disabled — ignore */ }
    },
    load: function () {
      try {
        var raw = localStorage.getItem(SAVE_KEY);
        this.state = raw ? JSON.parse(raw) : null;
      } catch (e) { this.state = null; }
    },
    wipe: function () {
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
      this.state = null;
    },

    /* ---- scenario rotation ---- */
    category: function () {
      var r = RANKS[this.state.rank];
      return r ? r.cat : 'technical';
    },

    TIER_BY_BAND: { entry:1, mid:2, senior:3, architect:4, principal:4 },

    // The eligible scenario pool for the current rank. Technical roles are
    // scoped by the player's track (blue/red/build) and seniority tier so a
    // SOC analyst, a pen tester and a security engineer get different work;
    // management roles draw from their category (people/budget/executive).
    poolFor: function () {
      var st = this.state, cat = this.category();
      var all = SCENARIOS.filter(function (s) { return s.cats.indexOf(cat) !== -1; });
      if (cat !== 'technical') return all;
      var tier = this.TIER_BY_BAND[RANKS[st.rank].band] || 2;
      var track = st.track || 'build';
      function f(pred) { return all.filter(pred); }
      var p = f(function (s) { var t = s.tier || 2; return (s.track === 'any' || s.track === track) && t >= tier - 1 && t <= tier; });
      if (p.length >= 4) return p;
      p = f(function (s) { return s.track === 'any' || s.track === track; });   // relax tier
      if (p.length >= 4) return p;
      return all;                                                               // last resort
    },

    drawScenario: function () {
      var st = this.state, cat = this.category();
      if (!st.seen[cat]) st.seen[cat] = [];
      var base = this.poolFor();
      var pool = base.filter(function (s) { return st.seen[cat].indexOf(s.id) === -1; });
      if (!pool.length) {
        // Pool exhausted. Reshuffle, but keep the most recently seen ones out of
        // rotation so nothing reappears soon after it was shown.
        var keep = Math.min(st.seen[cat].length, Math.max(3, Math.floor(base.length / 3)));
        st.seen[cat] = st.seen[cat].slice(-keep);
        pool = base.filter(function (s) { return st.seen[cat].indexOf(s.id) === -1; });
        if (!pool.length) { st.seen[cat] = st.current ? [st.current] : []; pool = base.filter(function (s) { return s.id !== st.current; }); }
      }
      var s = pick(pool);
      st.current = s.id;
      st.seen[cat].push(s.id);
      st.phase = 'play';
      st.outcome = null;
    },

    scenario: function () {
      var id = this.state.current, i;
      for (i = 0; i < SCENARIOS.length; i++) if (SCENARIOS[i].id === id) return SCENARIOS[i];
      return null;
    },

    meetsReq: function (choice) {
      if (!choice.req) return true;
      var sk = this.state.skills;
      for (var k in choice.req) { if (choice.req.hasOwnProperty(k)) { if ((sk[k] || 0) < choice.req[k]) return false; } }
      return true;
    },
    choiceLocked: function () { return false; },

    botchMessages: [
      'You reach for a move beyond your current experience, and it shows. The execution is shaky, the situation gets messier, and people notice.',
      'It is the right instinct but the wrong hands — you have not done this enough to pull it off cleanly. It backfires and costs you some credibility.',
      'Ambitious, but you are out of your depth here. The approach unravels halfway through and you spend the rest of the week cleaning it up.',
      'You bite off more than you can chew. Without the experience to land it, the bold play stumbles and leaves things worse than before.'
    ],

    /* ---- apply a choice ---- */
    choose: function (idx) {
      var st = this.state, sc = this.scenario();
      if (!sc || st.phase !== 'play') return;
      var c = sc.choices[idx];
      if (!c) return;

      var met = this.meetsReq(c);
      var fx = c.fx || {}, eff = {}, res, k;

      if (met) {
        for (k in fx) if (fx.hasOwnProperty(k)) eff[k] = fx[k];
        res = c.res;
      } else {
        eff.perf = (typeof fx.perf === 'number' && fx.perf > 0) ? -(Math.round(fx.perf * 0.6) + 2)
                 : ((fx.perf || 0) - 2);
        eff.stress = Math.max(4, (fx.stress || 0)) + 4;
        SKILLS.forEach(function (sk) {
          if (typeof fx[sk] === 'number') eff[sk] = fx[sk] > 0 ? 1 : fx[sk];
        });
        if (typeof fx.money === 'number' && fx.money < 0) eff.money = fx.money;
        res = c.failRes || this.botchMessages[(Math.random() * this.botchMessages.length) | 0];
      }

      var deltas = [], hadGoodPerf = false, hadBadPerf = false, gotCash = 0;
      if (typeof eff.perf === 'number' && eff.perf !== 0) {
        st.perf = clamp(st.perf + eff.perf, 0, 100);
        deltas.push({ label: 'Performance', n: eff.perf, kind: eff.perf >= 0 ? 'up' : 'down' });
        if (eff.perf > 0) hadGoodPerf = true; if (eff.perf < 0) hadBadPerf = true;
      }
      SKILLS.forEach(function (sk) {
        if (typeof eff[sk] === 'number' && eff[sk] !== 0) {
          st.skills[sk] = clamp((st.skills[sk] || 0) + eff[sk], 0, 100);
          deltas.push({ label: SKILL_LABEL[sk], n: eff[sk], kind: eff[sk] >= 0 ? 'up' : 'down' });
        }
      });
      if (typeof eff.stress === 'number' && eff.stress !== 0) {
        st.stress = clamp(st.stress + eff.stress, 0, 100);
        deltas.push({ label: 'Stress', n: eff.stress, kind: eff.stress > 0 ? 'down' : 'up' });
      }
      if (typeof eff.money === 'number' && eff.money !== 0) {
        gotCash = eff.money; st.money += eff.money;
        deltas.push({ label: 'money', n: eff.money, kind: 'cash' });
      }

      st.outcome = { res: res, deltas: deltas, botched: !met };
      st.phase = 'outcome';

      if (hadBadPerf && !hadGoodPerf) Sound.bad(); else if (hadGoodPerf) Sound.good(); else Sound.tap();
      if (gotCash > 0) Sound.cash();

      this.checkMilestones();
      this.save();
      rerender();
    },

    /* ---- advance one week after viewing an outcome ---- */
    next: function () {
      var st = this.state;
      if (st.phase !== 'outcome') return;

      st.week += 1;
      st.weeksAtRank += 1;
      st.money += nowSalaryWeekly(st);
      if (st.stress >= 90) st.perf = clamp(st.perf - 1, 0, 100); // burnout drag

      this.checkMilestones();

      if (st.week % REVIEW_EVERY === 0) {
        this.runReview();          // may set phase 'review' or 'ending'
      } else {
        this.afterReview();        // promotion or next scenario
      }
      this.save();
      rerender();
    },

    /* ---- performance review ---- */
    runReview: function () {
      var st = this.state, p = st.perf, bonusRate = 0, warned = false, title, icon, body, parts = [];

      if (p >= 70) bonusRate = 0.15;
      else if (p >= 55) bonusRate = 0.08;
      else if (p >= 45) bonusRate = 0.03;

      var bonus = Math.round(st.salary * 1000 * bonusRate);
      if (bonus > 0) { st.money += bonus; }

      if (p < 40) {
        warned = true;
        var jump = (p < 25) ? 2 : 1;
        st.strikes = clamp(st.strikes + jump, 0, 3);
        if (st.strikes >= 3) { this.fire(); return; }
        if (st.strikes >= 2) {
          icon = '🚨'; title = 'HR Final Warning';
          parts.push('HR has issued a formal final warning. One more weak quarter and you are out. This is the last off-ramp.');
        } else {
          icon = '⚠️'; title = 'Manager Warning';
          parts.push('Your manager pulls you aside: performance is below the bar. Consider this a verbal warning — turn it around next quarter.');
        }
      } else {
        // recovery: a solid quarter walks back a strike
        if (st.strikes > 0 && p >= 60) {
          var hadFinal = st.strikes >= 2;
          st.strikes -= 1;
          parts.push('You clawed back from the warning zone — a strike is wiped from your record.');
          if (hadFinal) { st.flags.recoveredFinal = true; this.award('survivor'); }
        }
        if (p >= 70) { icon = '📈'; title = 'Strong Review'; parts.push('Leadership is impressed. You are exceeding expectations.'); }
        else if (p >= 55) { icon = '📊'; title = 'Solid Review'; parts.push('A dependable quarter. You are meeting the bar comfortably.'); }
        else { icon = '🟡'; title = 'Mixed Review'; parts.push('You held the line, but there is clearly more in the tank.'); }
      }

      if (bonus > 0) parts.push('Performance bonus paid: $' + bonus.toLocaleString() + '.');
      else parts.push('No bonus this cycle.');

      // achievements tied to reviews
      if (!warned && st.stress < 20) this.award('zen');
      if (st.stress >= 95) this.award('workaholic');

      st.review = { icon: icon, title: title, body: parts.join(' '), bonus: bonus };
      st.phase = 'review';
      if (warned) Sound.warn(); else if (bonus > 0) Sound.cash(); else Sound.tap();
      this.checkMilestones();
    },

    ackReview: function () {
      if (this.state.phase !== 'review') return;
      this.state.review = null;
      this.state.promoSnoozed = false;   // a fresh review re-opens any snoozed promotion
      this.afterReview();
      this.save();
      rerender();
    },

    /* ---- decide what happens after a (possible) review ---- */
    afterReview: function () {
      if (this.promotionReady()) {
        var r = RANKS[this.state.rank];
        this.state.promo = { options: r.next.slice(), fork: r.forkLabel || null };
        this.state.phase = 'promotion';
      } else {
        this.drawScenario();
      }
    },

    promotionReady: function () {
      var st = this.state, r = RANKS[st.rank];
      if (!r || !r.req || !r.next || !r.next.length) return false;
      if (st.promoSnoozed) return false;
      return st.weeksAtRank >= r.req.weeks &&
             st.perf >= r.req.perf &&
             (st.skills[r.req.skill] || 0) >= r.req.val;
    },

    promote: function (toId) {
      var st = this.state, target = RANKS[toId];
      if (!target || st.phase !== 'promotion') return;
      var cleanSweep = st.perf >= 90;

      st.rank = toId;
      st.salary = target.salary;
      st.weeksAtRank = 0;
      st.promo = null;
      st.flags.promoted = true;

      // Onboarding boost: a promotion comes with training/experience in the
      // new discipline, so you arrive equipped to engage (but still below the
      // bar you must clear to advance again). Keeps each career transition fair.
      if (target.req) {
        var floor = Math.max(0, target.req.val - 8);
        st.skills[target.req.skill] = clamp(Math.max(st.skills[target.req.skill] || 0, floor), 0, 100);
        if (target.focus && target.focus !== target.req.skill) {
          st.skills[target.focus] = clamp(Math.max(st.skills[target.focus] || 0, floor - 6), 0, 100);
        }
      }
      this.award('first_promo');
      if (cleanSweep) this.award('clean_sweep');
      this.checkMilestones();

      if (target.ending) {
        st.ended = target.ending;
        st.phase = 'ending';
        Sound.win();
      } else {
        Sound.promo();
        this.drawScenario();
      }
      this.save();
      rerender();
    },

    declinePromotion: function () {
      if (this.state.phase !== 'promotion') return;
      this.state.promo = null;
      this.state.promoSnoozed = true;     // re-offered at the next review
      this.drawScenario();
      this.save();
      rerender();
    },

    /* ---- firing / endings ---- */
    fire: function () {
      var st = this.state;
      st.ended = 'fired';
      st.phase = 'ending';
      st.review = null;
      this.award('escorted');
      Sound.fired();
      this.checkMilestones();
    },

    /* ---- achievements ---- */
    award: function (id) {
      var st = this.state;
      if (!st || st.achievements.indexOf(id) !== -1) return;
      st.achievements.push(id);
      var a = null;
      for (var i = 0; i < ACHIEVEMENTS.length; i++) if (ACHIEVEMENTS[i].id === id) a = ACHIEVEMENTS[i];
      if (a) toast(a.icon, 'Achievement: ' + a.name, true);
    },

    checkMilestones: function () {
      var st = this.state; if (!st) return;
      if (st.salary >= 100) this.award('six_figures');
      if (st.money >= 1000000) this.award('millionaire');
      var r = st.rank;
      if (['lead', 'manager', 'smanager', 'director', 'vp', 'ciso', 'board'].indexOf(r) !== -1) this.award('people_person');
      if (['smanager', 'director', 'vp', 'ciso', 'board'].indexOf(r) !== -1) this.award('bean_counter');
      if (r === 'fellow') this.award('ic_legend');
      if (r === 'ciso') this.award('c_suite');
      if (r === 'board') this.award('made_it');
    },

    hasAch: function (id) { return this.state && this.state.achievements.indexOf(id) !== -1; },

    /* ---- Android hardware Back button ---- */
    handleBack: function () {
      // Returns a real boolean: evaluateJavascript serialises true -> "true",
      // which is exactly what MainActivity checks for. true = consumed.
      var ui = this.ui;
      if (ui.modal) { ui.modal = null; rerender(); return true; }
      if (ui.route === 'achievements' || ui.route === 'profile') { ui.route = ui.prev || 'title'; rerender(); return true; }
      if (this.state && (this.state.phase === 'review' || this.state.phase === 'promotion' || this.state.phase === 'ending')) {
        return true;             // block back during blocking screens
      }
      if (ui.route === 'role' || ui.route === 'customize' || ui.route === 'name') { ui.route = 'title'; rerender(); return true; }
      return false;              // title / game → let Android minimise the app
    }
  };

  global.MadeIt = MadeIt;
})(window);
