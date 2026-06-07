/* ============================================================
   MADE IT — bootstrap
   Wires the engine + UI together, restores any saved game,
   auto-saves when the app is backgrounded/closed, and unlocks
   the audio context on the first user gesture.
   The Android host (MainActivity) calls:
     window.MadeIt.handleBack()  -> "true" if consumed
     window.MadeIt.save()        -> persist on pause
   ============================================================ */
(function (global) {
  'use strict';

  function start() {
    // 1. restore state from localStorage (if any) and sync mute flag
    MadeIt.init();

    // 2. build the UI and show the title screen
    UI.boot();

    // 3. persist whenever the app is hidden, backgrounded or closed
    function persist() { try { MadeIt.save(); } catch (e) {} }
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') persist();
    });
    global.addEventListener('pagehide', persist);
    global.addEventListener('beforeunload', persist);
    global.addEventListener('blur', persist);

    // 4. unlock / resume the WebAudio context on the very first gesture
    function unlock() {
      if (!Sound.isMuted()) { Sound.tap(); }
      global.removeEventListener('pointerdown', unlock);
      global.removeEventListener('touchstart', unlock);
    }
    global.addEventListener('pointerdown', unlock, { passive: true });
    global.addEventListener('touchstart', unlock, { passive: true });
  }

  // Safety nets so the Android host always finds its hooks, even if
  // something above failed to initialise.
  if (!global.MadeIt) {
    global.MadeIt = { handleBack: function () { return false; }, save: function () {} };
  } else {
    if (typeof global.MadeIt.handleBack !== 'function') global.MadeIt.handleBack = function () { return false; };
    if (typeof global.MadeIt.save !== 'function') global.MadeIt.save = function () {};
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window);
