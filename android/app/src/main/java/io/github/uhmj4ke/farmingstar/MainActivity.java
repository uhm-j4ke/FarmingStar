package io.github.uhmj4ke.farmingstar;

import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.RenderProcessGoneDetail;
import org.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

public final class MainActivity extends ComponentActivity {
    private static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final int IMPORT = 1, EXPORT = 2;
    private WebView web;
    private PersistentStore store;
    private String exportText;
    private boolean foreground;
    private long lifecycleEpoch;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        store = new PersistentStore(getFilesDir());
        web = new WebView(this);
        web.setBackgroundColor(0xff233f38);
        setContentView(web);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setBlockNetworkLoads(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setBuiltInZoomControls(false);
        settings.setSupportMultipleWindows(false);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        web.addJavascriptInterface(new Host(), "FarmingStarHost");
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                Log.e("FarmingStar", "WebView renderer stopped; crashed=" + detail.didCrash() + "; app-private saves retained");
                if (web == view) web = null;
                destroyWebView(view);
                new AlertDialog.Builder(MainActivity.this).setTitle("Android WebView stopped")
                    .setMessage("Your existing saved farms have been preserved. You can retry, or close the app.")
                    .setNegativeButton("Close", (d,w) -> finish()).setPositiveButton("Retry", (d,w) -> recreate()).setCancelable(false).show();
                return true;
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                return !req.getUrl().toString().equals(ORIGIN + "/index.html");
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
                if (req.getUrl().toString().equals(ORIGIN + "/index.html")) {
                    try { return new WebResourceResponse("text/html", "UTF-8", getAssets().open("web/index.html")); }
                    catch (Exception e) { Log.e("FarmingStar", "Bundled HTML missing", e); }
                }
                return new WebResourceResponse("text/plain", "UTF-8", 403, "Offline app", Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onConsoleMessage(ConsoleMessage message) {
                Log.d("FarmingStarJS", message.messageLevel()+": "+message.message()); return true;
            }
        });
        web.setOnApplyWindowInsetsListener((view, insets) -> {
            if (android.os.Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(android.view.WindowInsets.Type.systemBars() | android.view.WindowInsets.Type.displayCutout());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            } else view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        immersive();
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() { handleBack(); }
        });
        web.loadUrl(ORIGIN + "/index.html");
    }
    private void immersive() {
        if (android.os.Build.VERSION.SDK_INT >= 30) {
            if (getWindow().getInsetsController() == null) return;
            getWindow().getInsetsController().hide(android.view.WindowInsets.Type.systemBars());
            getWindow().getInsetsController().setSystemBarsBehavior(android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        } else getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }
    private void javascript(String source) { if (web != null) web.evaluateJavascript(source, null); }
    @Override protected void onPause() {
        foreground = false; final long epoch = ++lifecycleEpoch; final WebView current = web;
        if (current != null) current.evaluateJavascript("window.FarmingStarLifecycle&&window.FarmingStarLifecycle.suspend()", ignored -> { if (web == current && !foreground && epoch == lifecycleEpoch) current.onPause(); });
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume(); foreground = true; lifecycleEpoch++;
        if (web != null) { web.onResume(); immersive(); javascript("window.FarmingStarLifecycle&&window.FarmingStarLifecycle.resume()"); }
    }
    private void handleBack() {
        final WebView current = web;
        if (current == null) return;
        current.evaluateJavascript("window.FarmingStarLifecycle?window.FarmingStarLifecycle.back():false", handled -> {
            if (web != current || isFinishing() || isDestroyed()) return;
            if (!"true".equals(handled)) new AlertDialog.Builder(this).setTitle("Close FarmingStar?").setMessage("Your saved farms stay on this device.").setNegativeButton("Keep playing", null).setPositiveButton("Close", (d,w) -> {
                current.evaluateJavascript("window.FarmingStarLifecycle?window.FarmingStarLifecycle.suspend():true", saved -> {
                    if (web != current || isFinishing() || isDestroyed()) return;
                    if ("true".equals(saved)) finish();
                    else {
                        javascript("window.FarmingStarLifecycle&&window.FarmingStarLifecycle.resume()");
                        new AlertDialog.Builder(this).setTitle("Progress could not be saved").setMessage("Keep the app open to retain your current progress. Free some device storage, then try saving again.").setPositiveButton("Keep playing", null).show();
                    }
                });
            }).show();
        });
    }
    @Override protected void onDestroy() {
        WebView current = web; web = null;
        if (current != null) destroyWebView(current);
        super.onDestroy();
    }
    private void destroyWebView(WebView view) {
        if (view.getParent() instanceof ViewGroup) ((ViewGroup) view.getParent()).removeView(view);
        view.removeJavascriptInterface("FarmingStarHost"); view.stopLoading(); view.destroy();
    }
    public final class Host {
        @JavascriptInterface public String getPlatform() { return "android"; }
        @JavascriptInterface public String getItem(String key) { return store.get(key); }
        @JavascriptInterface public boolean setItem(String key, String value) { return store.put(key, value); }
        @JavascriptInterface public boolean removeItem(String key) { return store.put(key, null); }
        @JavascriptInterface public boolean batch(String json) {
            if (json == null || json.length() > 32 * 1024 * 1024) return false;
            try { return store.batch(new JSONObject(json)); } catch (Exception invalid) { return false; }
        }
        @JavascriptInterface public boolean pickImport() {
            openFilePicker(new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json"), IMPORT); return true;
        }
        @JavascriptInterface public boolean exportSave(String name, String json) {
            if (json == null || json.length() > 4 * 1024 * 1024) return false;
            exportText = json;
            openFilePicker(new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json").putExtra(Intent.EXTRA_TITLE, name.replaceAll("[^A-Za-z0-9._-]", "_")), EXPORT); return true;
        }
    }
    private void openFilePicker(Intent intent, int request) {
        runOnUiThread(() -> {
            if (isFinishing() || isDestroyed()) return;
            try { startActivityForResult(intent, request); }
            catch (android.content.ActivityNotFoundException | SecurityException unavailable) {
                exportText = null;
                javascript("window.FarmingStarFiles&&window.FarmingStarFiles.error('The Android document picker is unavailable. Your farm has not been changed.')");
            }
        });
    }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != IMPORT && request != EXPORT) return;
        if (result != RESULT_OK || data == null || data.getData() == null) { exportText = null; javascript("window.FarmingStarFiles&&window.FarmingStarFiles.cancel()"); return; }
        Uri uri = data.getData();
        try {
            if (request == IMPORT) {
                byte[] bytes;
                try (InputStream input = getContentResolver().openInputStream(uri); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
                    byte[] chunk = new byte[8192]; int count;
                    while ((count = input.read(chunk)) != -1) { buffer.write(chunk, 0, count); if (buffer.size() > 4 * 1024 * 1024) throw new Exception("Save file is too large"); }
                    bytes = buffer.toByteArray();
                }
                if (bytes.length > 4 * 1024 * 1024) throw new Exception("Save file is too large");
                javascript("window.FarmingStarFiles.receiveImport(" + JSONObject.quote(new String(bytes, StandardCharsets.UTF_8)) + ")");
            } else {
                try (OutputStream out = getContentResolver().openOutputStream(uri, "wt")) { out.write(exportText.getBytes(StandardCharsets.UTF_8)); }
                exportText = null; javascript("window.FarmingStarFiles.exportResult(true)");
            }
        } catch (Exception error) { exportText = null; javascript("window.FarmingStarFiles.error(" + JSONObject.quote("File operation failed: " + error.getMessage()) + ")"); }
    }
}
