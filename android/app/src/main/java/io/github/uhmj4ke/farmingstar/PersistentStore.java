package io.github.uhmj4ke.farmingstar;

import android.util.AtomicFile;
import org.json.JSONObject;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

/** Synchronous, per-key atomic persistence in app-private files, not a WebView cache. */
final class PersistentStore {
    private final AtomicFile file;
    private JSONObject values;
    private boolean damaged;
    PersistentStore(File directory) {
        file = new AtomicFile(new File(directory, "farmingstar-storage.json"));
        try { values = new JSONObject(new String(file.readFully(), StandardCharsets.UTF_8)); }
        catch (java.io.FileNotFoundException absent) { values = new JSONObject(); }
        catch (Exception corrupt) { values = new JSONObject(); damaged = true; }
    }
    static boolean allowed(String key) {
        return key != null && key.matches("farmingstar\\.moss-ember\\.(preferences|migrated\\.v2|v1|slot\\.[123](\\.(history|before-restore)(\\.unreadable)?|\\.import-backup)?)");
    }
    synchronized String get(String key) {
        if (!allowed(key)) return null;
        if (damaged) throw new IllegalStateException("Native save file is unreadable; preserved for recovery");
        return values.has(key) ? values.optString(key, null) : null;
    }
    synchronized boolean put(String key, String value) {
        if (damaged || !allowed(key) || value != null && value.length() > 4 * 1024 * 1024) return false;
        JSONObject changes = new JSONObject();
        try { changes.put(key, value == null ? JSONObject.NULL : value); }
        catch (Exception failure) { return false; }
        return batch(changes);
    }
    synchronized boolean batch(JSONObject changes) {
        if (damaged || changes == null || changes.length() == 0 || changes.length() > 8) return false;
        FileOutputStream output = null;
        try {
            JSONObject next = new JSONObject(values.toString());
            java.util.Iterator<String> keys = changes.keys();
            while (keys.hasNext()) {
                String key = keys.next(); Object value = changes.get(key);
                if (!allowed(key) || value != JSONObject.NULL && (!(value instanceof String) || ((String) value).length() > 4 * 1024 * 1024)) return false;
                if (value == JSONObject.NULL) next.remove(key); else next.put(key, value);
            }
            byte[] bytes = next.toString().getBytes(StandardCharsets.UTF_8);
            if (bytes.length > 32 * 1024 * 1024) return false;
            output = file.startWrite();
            output.write(bytes);
            file.finishWrite(output);
            values = next;
            return true;
        } catch (Exception failure) {
            if (output != null) file.failWrite(output);
            return false;
        }
    }
}
