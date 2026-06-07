# Default ProGuard rules. Minification is disabled for the release build,
# so this file is intentionally minimal.
-keepattributes *Annotation*
-keepclassmembers class com.madeit.game.** {
    @android.webkit.JavascriptInterface <methods>;
}
