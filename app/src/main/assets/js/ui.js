/* ============================================================
   MADE IT — UI
   Pure rendering layer. Reads MadeIt.state, writes to #screen,
   #modal-root and #toasts. All buttons route back into the engine.
   ============================================================ */
(function (global) {
  'use strict';

  var screenEl, modalEl, toastEl;

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) {
    var neg = n < 0; n = Math.abs(Math.round(n));
    return (neg ? '-$' : '$') + n.toLocaleString();
  }
  function signed(n) { return (n >= 0 ? '+' : '\u2212') + Math.abs(n); }

  var UI = {
    boot: function () {
      screenEl = $('screen'); modalEl = $('modal-root'); toastEl = $('toasts');
      document.addEventListener('click', this.onClick.bind(this));
      document.addEventListener('input', this.onInput.bind(this));
      this.render();
    },

    show: function (route) {
      MadeIt.ui.prev = MadeIt.ui.route;
      MadeIt.ui.route = route;
      this.render();
    },

    /* ---------------- master render ---------------- */
    render: function () {
      if (!screenEl) return;
      var route = MadeIt.ui.route;
      if (route === 'title') screenEl.innerHTML = this.title();
      else if (route === 'role') screenEl.innerHTML = this.rolePicker();
      else if (route === 'customize') screenEl.innerHTML = this.customizer();
      else if (route === 'name') screenEl.innerHTML = this.nameScreen();
      else if (route === 'achievements') screenEl.innerHTML = this.achievements();
      else if (route === 'profile') screenEl.innerHTML = this.profile();
      else if (route === 'game') screenEl.innerHTML = this.game();
      else screenEl.innerHTML = this.title();
      this.renderModal();
    },

    /* ---------------- title ---------------- */
    title: function () {
      var cont = MadeIt.hasSave();
      var muted = Sound.isMuted();
      var sub = '';
      if (cont) {
        var st = MadeIt.state;
        sub = '<div class="tagline" style="margin-top:18px">Resume as ' + esc(st.name) +
              ' \u2022 ' + esc(RANKS[st.rank].title) + '</div>';
      }
      return '' +
        '<div class="title-wrap">' +
          '<div class="logo">Made<span class="it"> It</span></div>' +
          '<div class="tagline">Climb the Cybersecurity Ladder</div>' +
          sub +
          '<div class="title-menu">' +
            (cont ? '<button class="btn" data-act="continue-game">Continue Career</button>' : '') +
            '<button class="btn ' + (cont ? 'ghost' : '') + '" data-act="go-role">New Career</button>' +
            '<button class="btn ghost" data-act="go-achievements">Achievements</button>' +
            '<button class="btn ghost" data-act="toggle-mute">Sound: ' + (muted ? 'Off' : 'On') + '</button>' +
          '</div>' +
          '<div class="version">v1.0</div>' +
        '</div>';
    },

    /* ---------------- role picker ---------------- */
    rolePicker: function () {
      var sel = MadeIt.ui.selRole;
      var cards = ENTRY_ROLES.map(function (r) {
        var on = sel === r.id ? ' sel' : '';
        return '<div class="pick panel' + on + '" data-role="' + r.id + '">' +
                 '<div class="meta">' + esc(r.track.toUpperCase()) + ' TEAM</div>' +
                 '<h3>' + esc(r.name) + '</h3>' +
                 '<p>' + esc(r.blurb) + '</p>' +
                 '<p class="pay">Starting salary $' + RANKS[r.id].salary + 'k</p>' +
               '</div>';
      }).join('');
      return '' +
        '<div class="deck-wrap col grow">' +
          '<div class="sect">Choose your entry role</div>' +
          '<div class="grow scroll"><div class="deck">' + cards + '</div></div>' +
          '<div class="row gap8 mt12">' +
            '<button class="btn ghost" style="width:auto" data-act="go-title">Back</button>' +
            '<button class="btn grow" data-act="role-next"' + (sel ? '' : ' disabled') + '>Continue</button>' +
          '</div>' +
        '</div>';
    },

    /* ---------------- character customizer ---------------- */
    customizer: function () {
      var look = MadeIt.ui.look || (MadeIt.ui.look = Scenes.cloneLook(Scenes.DEFAULT_LOOK));
      var LK = Scenes.LOOKS;

      var skinSw = LK.skins.map(function (pair, i) {
        var on = look.skin[0] === pair[0] ? ' sel' : '';
        return '<button class="sw' + on + '" data-skin="' + i + '" title="' + LK.skinNames[i] +
               '" style="background:' + pair[0] + '"></button>';
      }).join('');

      var hairSw = LK.hairColors.map(function (c, i) {
        var on = look.hair === c ? ' sel' : '';
        return '<button class="sw' + on + '" data-haircolor="' + i + '" title="' + LK.hairColorNames[i] +
               '" style="background:' + c + '"></button>';
      }).join('');

      var styleBtns = LK.hairStyles.map(function (st, i) {
        var on = look.hairStyle === st ? ' sel' : '';
        return '<button class="optbtn' + on + '" data-hairstyle="' + st + '">' + LK.hairStyleNames[i] + '</button>';
      }).join('');

      var glassBtns = LK.glasses.map(function (g, i) {
        var on = look.glasses === g ? ' sel' : '';
        return '<button class="optbtn' + on + '" data-glasses="' + g + '">' + LK.glassesNames[i] + '</button>';
      }).join('');

      var beardBtns =
        '<button class="optbtn' + (!look.beard ? ' sel' : '') + '" data-beard="0">Clean</button>' +
        '<button class="optbtn' + (look.beard ? ' sel' : '') + '" data-beard="1">Beard</button>';

      return '' +
        '<div class="deck-wrap col grow">' +
          '<div class="sect">Create your character</div>' +
          '<div class="grow scroll">' +
            '<div class="preview">' + Scenes.avatarSVG(look) + '</div>' +
            '<div class="optrow"><div class="sect">Skin</div><div class="swatches">' + skinSw + '</div></div>' +
            '<div class="optrow"><div class="sect">Hair style</div><div class="optset">' + styleBtns + '</div></div>' +
            '<div class="optrow"><div class="sect">Hair colour</div><div class="swatches">' + hairSw + '</div></div>' +
            '<div class="optrow"><div class="sect">Glasses</div><div class="optset">' + glassBtns + '</div></div>' +
            '<div class="optrow"><div class="sect">Facial hair</div><div class="optset">' + beardBtns + '</div></div>' +
            '<button class="btn ghost mt12" data-act="randomize-look">\uD83C\uDFB2 Surprise me</button>' +
          '</div>' +
          '<div class="row gap8 mt12">' +
            '<button class="btn ghost" style="width:auto" data-act="go-role">Back</button>' +
            '<button class="btn grow" data-act="customize-next">Continue</button>' +
          '</div>' +
        '</div>';
    },

    /* ---------------- name + employer ---------------- */
    nameScreen: function () {
      var co = COMPANIES[MadeIt.ui.pendingCompany % COMPANIES.length];
      var role = null, i;
      for (i = 0; i < ENTRY_ROLES.length; i++) if (ENTRY_ROLES[i].id === MadeIt.ui.selRole) role = ENTRY_ROLES[i];
      var look = MadeIt.ui.look || Scenes.DEFAULT_LOOK;
      return '' +
        '<div class="deck-wrap col grow center" style="justify-content:center">' +
          '<div class="panel pad" style="width:min(460px,94vw)">' +
            '<div class="preview" style="width:120px;margin:0 auto 8px">' + Scenes.avatarSVG(look) + '</div>' +
            '<div class="sect">Your offer letter</div>' +
            '<h2 style="margin:6px 0 2px">' + esc(co[0]) + '</h2>' +
            '<p class="soft" style="margin:0 0 4px">' + esc(co[1]) + ' is hiring you as a</p>' +
            '<p class="pay" style="font-family:var(--mono);color:var(--cyan);font-weight:700;margin:0 0 14px">' +
              esc(role ? role.name : '') + '</p>' +
            '<div class="sect">What should they call you?</div>' +
            '<input id="nameInput" type="text" maxlength="22" placeholder="Your name" value="" ' +
              'style="width:100%;margin-top:6px;padding:13px 14px;border-radius:12px;border:1px solid var(--line);' +
              'background:var(--panel-2);color:var(--ink);font-size:16px;font-family:var(--sans);' +
              '-webkit-user-select:text;user-select:text;" />' +
            '<div class="row gap8 mt16">' +
              '<button class="btn ghost" style="width:auto" data-act="go-customize">Back</button>' +
              '<button class="btn grow gold" data-act="start-game">Sign &amp; Start</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    },

    /* ---------------- main game ---------------- */
    game: function () {
      var st = MadeIt.state;
      if (!st) { return this.title(); }
      var rank = RANKS[st.rank];
      var scene = Scenes.render(st);

      var hud = '' +
        '<div class="hud panel">' +
          '<button class="iconbtn" data-act="open-menu" aria-label="menu">\u2630</button>' +
          '<div class="who">' +
            '<div class="role">' + esc(rank.title) + '</div>' +
            '<div class="org">' + esc(st.company) + ' \u2022 Week ' + st.week + '</div>' +
          '</div>' +
          '<div class="money">' +
            '<div class="big">' + money(st.money) + '</div>' +
            '<div class="sub">$' + st.salary + 'k / yr</div>' +
          '</div>' +
          '<button class="iconbtn" data-act="toggle-mute">' + (Sound.isMuted() ? '\uD83D\uDD07' : '\uD83D\uDD0A') + '</button>' +
        '</div>';

      var meters = this.meters(st);
      var sceneBox = '<div class="scene">' + scene.svg + '<div class="scene-label">' + esc(scene.label) + '</div></div>';

      var main = (st.phase === 'outcome') ? this.outcome(st) : this.event(st, rank);

      var reqWeeks = rank.req ? rank.req.weeks : 0;
      var weekTxt = rank.req ? ('Time in role: ' + st.weeksAtRank + ' / ' + reqWeeks + ' wks') : 'Top of the ladder';
      var strikes = '';
      for (var i = 0; i < 3; i++) strikes += '<span class="s' + (i < st.strikes ? ' on' : '') + '"></span>';
      var weekrow = '<div class="weekrow"><span>' + weekTxt + '</span><div class="strikes" title="strikes">' + strikes + '</div></div>';

      return '' +
        '<div class="play">' +
          hud +
          '<div class="stage">' +
            sceneBox +
            '<div class="play-right">' +
              meters +
              main +
              weekrow +
            '</div>' +
          '</div>' +
        '</div>';
    },

    meters: function (st) {
      var rows = [];
      var pcls = st.perf < 30 ? ' crit' : (st.perf < 40 ? ' warn' : '');
      rows.push(this.meter('Performance', st.perf, 'perf' + pcls));
      rows.push(this.meter('Stress', st.stress, 'stress'));
      var focus = RANKS[st.rank].focus;
      // focus skill first, then the rest, so the relevant one leads
      var order = [focus].concat(SKILLS.filter(function (s) { return s !== focus; }));
      order.forEach(function (s) {
        rows.push(UI.meter(SKILL_LABEL[s] + (s === focus ? ' \u2605' : ''), st.skills[s], 'skill'));
      });
      return '<div class="meters panel">' + rows.join('') + '</div>';
    },

    meter: function (label, val, cls) {
      val = Math.round(val);
      return '<div class="meter">' +
               '<div class="lab"><span>' + esc(label) + '</span><b>' + val + '</b></div>' +
               '<div class="bar ' + cls + '"><i style="width:' + val + '%"></i></div>' +
             '</div>';
    },

    event: function (st, rank) {
      var sc = MadeIt.scenario();
      if (!sc) return '<div class="event panel"><div class="body">Loading...</div></div>';
      var choices = sc.choices.map(function (c, i) {
        return '<button class="choice" data-choice="' + i + '">' + esc(c.t) + '</button>';
      }).join('');
      return '' +
        '<div class="event panel grow">' +
          '<div class="etype ' + rank.cat + '">' + esc(sc.type) + ' \u2022 Week ' + st.week + '</div>' +
          '<h2>' + esc(sc.title) + '</h2>' +
          '<div class="body grow">' + esc(sc.text) + '</div>' +
          '<div class="choices">' + choices + '</div>' +
        '</div>';
    },

    outcome: function (st) {
      var o = st.outcome;
      var chips = o.deltas.map(function (d) {
        if (d.kind === 'cash') {
          return '<span class="delta cash">' + (d.n >= 0 ? '+' : '\u2212') + money(Math.abs(d.n)).replace('$', '$') + '</span>';
        }
        var arrow = d.kind === 'up' ? '\u25B2' : '\u25BC';
        return '<span class="delta ' + d.kind + '">' + arrow + ' ' + esc(d.label) + ' ' + signed(d.n) + '</span>';
      }).join('');
      return '' +
        '<div class="outcome panel grow">' +
          '<div class="res grow">' + esc(o.res) + '</div>' +
          '<div class="deltas">' + chips + '</div>' +
          '<button class="btn" data-act="next-week">Continue \u2192</button>' +
        '</div>';
    },

    /* ---------------- achievements ---------------- */
    achievements: function () {
      var got = (MadeIt.state && MadeIt.state.achievements) || [];
      var items = ACHIEVEMENTS.map(function (a) {
        var on = got.indexOf(a.id) !== -1;
        return '<div class="litem' + (on ? '' : ' off') + '">' +
                 '<div class="t">' + a.icon + '  ' + esc(a.name) + '</div>' +
                 '<div class="d">' + esc(on ? a.desc : '\uD83D\uDD12 Locked') + '</div>' +
               '</div>';
      }).join('');
      return '' +
        '<div class="col grow">' +
          '<div class="row gap8" style="margin-bottom:8px">' +
            '<button class="iconbtn" data-act="back">\u2190</button>' +
            '<div class="sect" style="margin:0">Achievements \u2022 ' + got.length + ' / ' + ACHIEVEMENTS.length + '</div>' +
          '</div>' +
          '<div class="grow scroll"><div class="list">' + items + '</div></div>' +
        '</div>';
    },

    /* ---------------- profile / stats ---------------- */
    profile: function () {
      var st = MadeIt.state;
      if (!st) return this.title();
      var r = RANKS[st.rank];
      function box(k, v) { return '<div class="statbox"><div class="k">' + k + '</div><div class="v">' + v + '</div></div>'; }
      var grid = box('Role', esc(r.title)) + box('Employer', esc(st.company)) +
                 box('Total earned', money(st.money)) + box('Salary', '$' + st.salary + 'k') +
                 box('Performance', Math.round(st.perf)) + box('Stress', Math.round(st.stress)) +
                 box('Week', st.week) + box('Achievements', st.achievements.length + ' / ' + ACHIEVEMENTS.length);
      var skills = SKILLS.map(function (s) {
        return '<div class="statbox"><div class="k">' + SKILL_LABEL[s] + '</div><div class="v">' + Math.round(st.skills[s]) + '</div></div>';
      }).join('');
      return '' +
        '<div class="col grow">' +
          '<div class="row gap8" style="margin-bottom:8px">' +
            '<button class="iconbtn" data-act="back">\u2190</button>' +
            '<div class="sect" style="margin:0">' + esc(st.name) + ' \u2022 Career File</div>' +
          '</div>' +
          '<div class="grow scroll">' +
            '<div class="statgrid">' + grid + '</div>' +
            '<div class="sect mt16">Skills</div>' +
            '<div class="statgrid">' + skills + '</div>' +
          '</div>' +
        '</div>';
    },

    /* ---------------- modals ---------------- */
    renderModal: function () {
      if (!modalEl) return;
      var st = MadeIt.state, html = '';
      if (st && st.phase === 'ending') html = this.endingModal(st);
      else if (st && st.phase === 'promotion') html = this.promoModal(st);
      else if (st && st.phase === 'review') html = this.reviewModal(st);
      else if (MadeIt.ui.modal === 'menu') html = this.menuModal();
      else if (MadeIt.ui.modal === 'confirm-new') html = this.confirmNewModal();
      modalEl.innerHTML = html;
    },

    reviewModal: function (st) {
      var r = st.review;
      return wrap(
        '<div class="big-emoji">' + r.icon + '</div>' +
        '<h2 class="tcenter">' + esc(r.title) + '</h2>' +
        '<div class="sub tcenter">' + esc(r.body) + '</div>' +
        '<button class="btn" data-act="ack-review">Continue</button>'
      );
    },

    promoModal: function (st) {
      var r = RANKS[st.rank];
      var opts = st.promo.options.map(function (id) {
        var t = RANKS[id];
        return '<button class="btn gold mt8" data-promote="' + id + '">' +
                 esc(t.title) + '  \u2022  $' + t.salary + 'k' +
               '</button>';
      }).join('');
      var sub = st.promo.fork
        ? esc(st.promo.fork)
        : 'You have earned a promotion to ' + esc(RANKS[st.promo.options[0]].title) + '. Take it?';
      var stat = '<div class="statgrid mt8">' +
                   '<div class="statbox"><div class="k">CURRENT</div><div class="v" style="font-size:14px">' + esc(r.title) + '</div></div>' +
                   '<div class="statbox"><div class="k">PERFORMANCE</div><div class="v">' + Math.round(st.perf) + '</div></div>' +
                 '</div>';
      return wrap(
        '<div class="big-emoji">\u2B06\uFE0F</div>' +
        '<h2 class="tcenter">Promotion Offer</h2>' +
        '<div class="sub tcenter">' + sub + '</div>' +
        stat +
        opts +
        '<button class="btn ghost mt12" data-act="decline-promo">Stay in current role for now</button>'
      );
    },

    endingModal: function (st) {
      var e = ENDINGS[st.ended];
      return wrap(
        '<div class="big-emoji">' + e.icon + '</div>' +
        '<h2 class="tcenter">' + esc(e.title) + '</h2>' +
        '<div class="sub tcenter">' + esc(e.body) + '</div>' +
        '<div class="statgrid">' +
          '<div class="statbox"><div class="k">FINAL ROLE</div><div class="v" style="font-size:14px">' + esc(RANKS[st.rank].title) + '</div></div>' +
          '<div class="statbox"><div class="k">TOTAL EARNED</div><div class="v">' + money(st.money) + '</div></div>' +
        '</div>' +
        '<button class="btn gold mt12" data-act="ending-new">Start a New Career</button>' +
        '<button class="btn ghost mt8" data-act="ending-ach">View Achievements</button>'
      );
    },

    menuModal: function () {
      var muted = Sound.isMuted();
      return wrap(
        '<h2 class="tcenter">Paused</h2>' +
        '<div class="sub tcenter">Your progress saves automatically.</div>' +
        '<button class="btn" data-act="close-menu">Resume</button>' +
        '<button class="btn ghost mt8" data-act="go-profile">Career File</button>' +
        '<button class="btn ghost mt8" data-act="go-achievements">Achievements</button>' +
        '<button class="btn ghost mt8" data-act="toggle-mute">Sound: ' + (muted ? 'Off' : 'On') + '</button>' +
        '<button class="btn ghost mt8" data-act="to-title">Quit to Title</button>'
      );
    },

    confirmNewModal: function () {
      return wrap(
        '<h2 class="tcenter">Start over?</h2>' +
        '<div class="sub tcenter">You have a career in progress. Starting a new one will erase it for good.</div>' +
        '<button class="btn danger" data-act="confirm-new-yes">Erase &amp; start new</button>' +
        '<button class="btn ghost mt8" data-act="close-menu">Keep my career</button>'
      );
    },

    /* ---------------- toasts ---------------- */
    toast: function (icon, text, isAch) {
      if (!toastEl) toastEl = $('toasts');
      var el = document.createElement('div');
      el.className = 'toast' + (isAch ? ' ach' : '');
      el.innerHTML = '<span class="ico">' + icon + '</span><span>' + esc(text) + '</span>';
      toastEl.appendChild(el);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3000);
    },

    /* ---------------- input ---------------- */
    onInput: function (e) {
      if (e.target && e.target.id === 'nameInput') { this._name = e.target.value; }
    },

    /* ---------------- click router ---------------- */
    onClick: function (e) {
      var t = e.target.closest('[data-act],[data-role],[data-choice],[data-promote],[data-skin],[data-haircolor],[data-hairstyle],[data-glasses],[data-beard]');
      if (!t) return;

      // ---- character customizer controls ----
      var look = MadeIt.ui.look;
      if (t.hasAttribute('data-skin')) { Sound.tap(); look.skin = Scenes.LOOKS.skins[+t.getAttribute('data-skin')].slice(); this.render(); return; }
      if (t.hasAttribute('data-haircolor')) { Sound.tap(); look.hair = Scenes.LOOKS.hairColors[+t.getAttribute('data-haircolor')]; this.render(); return; }
      if (t.hasAttribute('data-hairstyle')) { Sound.tap(); look.hairStyle = t.getAttribute('data-hairstyle'); this.render(); return; }
      if (t.hasAttribute('data-glasses')) { Sound.tap(); look.glasses = t.getAttribute('data-glasses'); this.render(); return; }
      if (t.hasAttribute('data-beard')) { Sound.tap(); look.beard = t.getAttribute('data-beard') === '1'; this.render(); return; }

      if (t.hasAttribute('data-role')) {
        Sound.select(); MadeIt.ui.selRole = t.getAttribute('data-role'); this.render(); return;
      }
      if (t.hasAttribute('data-choice')) {
        MadeIt.choose(parseInt(t.getAttribute('data-choice'), 10)); return;
      }
      if (t.hasAttribute('data-promote')) {
        MadeIt.promote(t.getAttribute('data-promote')); return;
      }

      var act = t.getAttribute('data-act');
      switch (act) {
        case 'go-role':
          Sound.tap();
          if (MadeIt.hasSave()) { MadeIt.ui.modal = 'confirm-new'; this.renderModal(); }
          else { MadeIt.ui.selRole = null; this.show('role'); }
          break;
        case 'confirm-new-yes':
          MadeIt.wipe(); MadeIt.ui.modal = null; MadeIt.ui.selRole = null; this.show('role'); break;
        case 'go-title': case 'to-title':
          Sound.tap(); MadeIt.ui.modal = null; MadeIt.save(); this.show('title'); break;
        case 'continue-game':
          Sound.tap(); this.show('game'); break;
        case 'role-next':
          if (MadeIt.ui.selRole) { Sound.tap(); MadeIt.ui.look = Scenes.cloneLook(Scenes.DEFAULT_LOOK); this.show('customize'); }
          break;
        case 'randomize-look':
          Sound.select(); MadeIt.ui.look = Scenes.randomLook(); this.render(); break;
        case 'go-customize':
          Sound.tap(); this.show('customize'); break;
        case 'customize-next':
          Sound.tap(); MadeIt.ui.pendingCompany = (Math.random() * COMPANIES.length) | 0; this._name = ''; this.show('name'); break;
        case 'start-game':
          Sound.select();
          MadeIt.newGame(MadeIt.ui.selRole, this._name || '', MadeIt.ui.pendingCompany, MadeIt.ui.look);
          break;
        case 'next-week': MadeIt.next(); break;
        case 'ack-review': MadeIt.ackReview(); break;
        case 'decline-promo': Sound.tap(); MadeIt.declinePromotion(); break;
        case 'ending-new':
          Sound.tap(); MadeIt.wipe(); MadeIt.ui.selRole = null; this.show('role'); break;
        case 'ending-ach':
          MadeIt.ui.prev = 'title'; this.show('achievements'); break;
        case 'go-achievements':
          Sound.tap(); MadeIt.ui.modal = null; MadeIt.ui.prev = MadeIt.ui.route; this.show('achievements'); break;
        case 'go-profile':
          Sound.tap(); MadeIt.ui.modal = null; MadeIt.ui.prev = 'game'; this.show('profile'); break;
        case 'back':
          Sound.tap(); this.show(MadeIt.ui.prev || 'title'); break;
        case 'open-menu':
          Sound.tap(); MadeIt.ui.modal = 'menu'; this.renderModal(); break;
        case 'close-menu':
          Sound.tap(); MadeIt.ui.modal = null; this.renderModal(); break;
        case 'toggle-mute':
          var m = !Sound.isMuted(); Sound.setMuted(m);
          if (MadeIt.state) { MadeIt.state.muted = m; MadeIt.save(); }
          if (!m) Sound.tap();
          this.render(); break;
      }
    }
  };

  function wrap(inner) {
    return '<div class="modal-bg"><div class="modal panel">' + inner + '</div></div>';
  }

  global.UI = UI;
})(window);
