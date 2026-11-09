package io.github.uhmj4ke.farmingstar.probe;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
public class ProbeActivity extends Activity {
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        WebView view = new WebView(this);setContentView(view);
        WebView.setWebContentsDebuggingEnabled(true);
        view.getSettings().setJavaScriptEnabled(true);
        view.loadDataWithBaseURL("https://appassets.androidplatform.net", "<!doctype html><title>WebView Control</title><h1>Local WebView control</h1><script>document.body.dataset.result='javascript-ran'</script>", "text/html", "UTF-8", null);
    }
}
