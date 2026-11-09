package io.github.uhmj4ke.farmingstar;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class PersistentStoreTest {
    private File folder(String name) {
        File result = new File(InstrumentationRegistry.getInstrumentation().getTargetContext().getFilesDir(), "qa-" + name + "-" + System.nanoTime());
        assertTrue(result.mkdirs()); return result;
    }
    @Test public void writesSurviveStoreRecreation() {
        File directory = folder("restart"); String key = "farmingstar.moss-ember.slot.1";
        PersistentStore first = new PersistentStore(directory);
        assertTrue(first.put(key, "{\"coins\":321,\"profile\":\"Aster\"}"));
        PersistentStore restarted = new PersistentStore(directory);
        assertEquals(first.get(key), restarted.get(key));
        assertTrue(restarted.put(key, null));
        assertNull(new PersistentStore(directory).get(key));
    }
    @Test public void rejectsArbitraryPathsAndUnknownKeys() {
        PersistentStore store = new PersistentStore(folder("keys"));
        for (String key : new String[]{"../../private", "file:///etc/passwd", "farmingstar.moss-ember.slot.9", "other-app-token"}) {
            assertFalse(store.put(key, "test")); assertNull(store.get(key));
        }
    }
    @Test public void rejectedOversizeWriteRetainsPreviousBytes() {
        File directory = folder("capacity"); String key = "farmingstar.moss-ember.slot.1";
        PersistentStore store = new PersistentStore(directory); assertTrue(store.put(key, "previous"));
        char[] large = new char[4 * 1024 * 1024 + 1]; java.util.Arrays.fill(large, 'x');
        assertFalse(store.put(key, new String(large)));
        assertEquals("previous", new PersistentStore(directory).get(key));
    }
    @Test public void damagedStoreIsPreservedRatherThanReset() throws Exception {
        File directory = folder("corrupt"),file = new File(directory, "farmingstar-storage.json");
        byte[] broken = "{broken native store".getBytes(StandardCharsets.UTF_8);
        try (FileOutputStream output = new FileOutputStream(file)) { output.write(broken); }
        PersistentStore store = new PersistentStore(directory); assertFalse(store.put("farmingstar.moss-ember.slot.1", "replacement"));
        try { store.get("farmingstar.moss-ember.slot.1"); fail("Damaged native data was silently treated as empty"); } catch (IllegalStateException expected) { }
        assertEquals(broken.length, file.length());
    }
    @Test public void relatedImportRecordsCommitTogetherAndSurviveRestart() throws Exception {
        File directory = folder("batch"); String key = "farmingstar.moss-ember.slot.1";
        PersistentStore store = new PersistentStore(directory); assertTrue(store.put(key, "old"));
        org.json.JSONObject changes = new org.json.JSONObject();
        changes.put(key, "new"); changes.put(key + ".history", "four points"); changes.put(key + ".import-backup", "old backup");
        assertTrue(store.batch(changes)); PersistentStore reopened = new PersistentStore(directory);
        assertEquals("new", reopened.get(key)); assertEquals("four points", reopened.get(key + ".history")); assertEquals("old backup", reopened.get(key + ".import-backup"));
    }
    @Test public void invalidMemberRejectsTheWholeImportBatch() throws Exception {
        File directory = folder("invalid-batch"); String key = "farmingstar.moss-ember.slot.1";
        PersistentStore store = new PersistentStore(directory); assertTrue(store.put(key, "previous"));
        org.json.JSONObject changes = new org.json.JSONObject(); changes.put(key, "replacement"); changes.put("../../outside", "invalid");
        assertFalse(store.batch(changes)); assertEquals("previous", store.get(key)); assertEquals("previous", new PersistentStore(directory).get(key));
    }
    @Test public void filesystemFailureRetainsAllPreviousImportRecords() throws Exception {
        File directory = folder("failed-batch"); String key = "farmingstar.moss-ember.slot.1";
        PersistentStore store = new PersistentStore(directory); assertTrue(store.put(key, "previous")); assertTrue(store.put(key + ".history", "old history"));
        File blocked = new File(directory, "farmingstar-storage.json.new"); assertTrue(blocked.mkdir());
        try (FileOutputStream output = new FileOutputStream(new File(blocked, "blocker"))) { output.write(1); }
        org.json.JSONObject changes = new org.json.JSONObject(); changes.put(key, "replacement"); changes.put(key + ".history", "new history");
        assertFalse(store.batch(changes)); assertEquals("previous", store.get(key)); assertEquals("old history", store.get(key + ".history"));
        PersistentStore reopened = new PersistentStore(directory); assertEquals("previous", reopened.get(key)); assertEquals("old history", reopened.get(key + ".history"));
    }
}
