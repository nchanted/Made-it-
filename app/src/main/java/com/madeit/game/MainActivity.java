package com.madeit.game;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Made It — career-ladder cybersecurity management sim.
 *
 * The whole game lives in assets/ (HTML/CSS/JS) and runs inside a WebView.
 * This Activity is just a thin, robust shell: it enables DOM storage (so the
 * game's auto-save survives app restarts), keeps the WebView alive across
 * rotations, and routes the hardware Back button into the game.
 */
public class MainActivity extends Activity {

    private WebView webView;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Draw behind system bars for an immersive, edge-to-edge feel.
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);            // localStorage = our save system
        s.setDatabaseEnabled(true);
        s.setLoadWithOverviewMode(false);
        s.setUseWideViewPort(false);
        s.setBuiltInZoomControls(false);
        s.setSupportZoom(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setBackgroundColor(0xFF0B1020);

        webView.setWebViewClient(new WebViewClient());
        webView.addJavascriptInterface(new Bridge(), "AndroidHost");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            getWindow().setNavigationBarColor(0xFF0B1020);
            getWindow().setStatusBarColor(0xFF0B1020);
        }

        webView.loadUrl("file:///android_asset/index.html");
    }

    /** Routes the hardware Back button into the game (close modals / go to menu). */
    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript(
                "(function(){ return (window.MadeIt && MadeIt.handleBack) ? MadeIt.handleBack() : false; })();",
                value -> {
                    if (!"true".equals(value)) {
                        // Nothing in-game consumed Back -> send app to background.
                        moveTaskToBack(true);
                    }
                });
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Nudge the game to persist immediately when leaving the app.
        if (webView != null) {
            webView.evaluateJavascript(
                "window.MadeIt && MadeIt.save && MadeIt.save();", null);
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    /** Small bridge so the game can leave fullscreen / exit cleanly. */
    public class Bridge {
        @JavascriptInterface
        public void minimize() {
            runOnUiThread(() -> moveTaskToBack(true));
        }
    }
}
