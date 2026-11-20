import assert from "node:assert/strict";
import {
  getActiveUserId,
  setActiveUserId,
  clearActiveUser,
  getScopedStorageKey,
  scopedLocalStorage,
  clearGuestData,
} from "../../apps/web/lib/client-storage.ts";
import {
  createNewAttempt,
  loadAttemptFromStorage,
  listAttemptsFromStorage,
  saveAttemptToStorage,
} from "../../apps/web/lib/ielts-state.ts";
import {
  saveLocalDraft,
  getLocalDraft,
  listLocalDrafts,
  deleteLocalDraft,
} from "../../apps/web/lib/offline-drafts.ts";
import {
  getActiveCefrLevel,
  setActiveCefrLevel,
  getLevelDeck,
} from "../../apps/web/lib/cefr-leitner-storage.ts";

console.log("Running Account Storage Isolation & Browser Security Unit Tests (F22)...");

// Test 1: Account-scoped keys isolation
{
  setActiveUserId("user_alice");
  const keyAlice = getScopedStorageKey("ielts_attempt_101");
  assert.equal(keyAlice, "endoora_u_user_alice__ielts_attempt_101");

  setActiveUserId("user_bob");
  const keyBob = getScopedStorageKey("ielts_attempt_101");
  assert.equal(keyBob, "endoora_u_user_bob__ielts_attempt_101");

  clearActiveUser();
  const keyGuest = getScopedStorageKey("ielts_attempt_101");
  assert.equal(keyGuest, "endoora_guest__ielts_attempt_101");

  assert.notEqual(keyAlice, keyBob);
  assert.notEqual(keyAlice, keyGuest);
  console.log("✓ Storage keys are strictly scoped per authenticated user or guest");
}

// Test 2: IELTS Exam attempts isolation across accounts
{
  // User Alice logs in and starts an exam attempt
  setActiveUserId("user_alice");
  const examMock = {
    id: "cambridge-18-test-1",
    title: "Cambridge IELTS 18 Academic Test 1",
    category: "academic",
  };
  const aliceAttempt = createNewAttempt(examMock, "reading", "user_alice");
  aliceAttempt.user_answers = { q1: "True", q2: "False", q3: "Not Given" };
  saveAttemptToStorage(aliceAttempt, "user_alice");

  const aliceList = listAttemptsFromStorage("user_alice");
  assert.equal(aliceList.length, 1);
  assert.equal(aliceList[0].user_answers.q1, "True");

  // User Bob logs in on the same browser
  setActiveUserId("user_bob");
  const bobList = listAttemptsFromStorage("user_bob");
  assert.equal(bobList.length, 0, "Bob must NOT see Alice's IELTS attempts");

  const loadedByBob = loadAttemptFromStorage(aliceAttempt.id, "user_bob");
  assert.equal(loadedByBob, null, "Bob cannot load Alice's exam attempt directly");

  // Guest (unauthenticated) on the same browser
  clearActiveUser();
  const guestList = listAttemptsFromStorage();
  assert.equal(guestList.length, 0, "Guest must NOT see authenticated user's attempts");

  // Alice logs back in: her attempt is preserved and intact
  setActiveUserId("user_alice");
  const aliceReload = listAttemptsFromStorage("user_alice");
  assert.equal(aliceReload.length, 1);
  assert.equal(aliceReload[0].user_answers.q1, "True");
  console.log("✓ IELTS exam attempts and answers cannot be read across accounts or by guests");
}

// Test 3: Offline draft synchronization state isolation
{
  // User Alice writes an offline essay draft
  setActiveUserId("user_alice");
  const aliceDraft = saveLocalDraft(
    {
      id: "essay_draft_alice_01",
      draft_type: "writing_submission",
      title: "Alice's Private Task 2 Essay",
      content_json: { body: "In my opinion, renewable energy is essential." },
    },
    "user_alice"
  );
  assert.equal(aliceDraft.title, "Alice's Private Task 2 Essay");

  // User Bob logs in
  setActiveUserId("user_bob");
  const bobDrafts = listLocalDrafts("user_bob");
  assert.equal(bobDrafts.length, 0, "Bob must NOT see Alice's offline drafts");

  const bobAttemptToRead = getLocalDraft("essay_draft_alice_01", "user_bob");
  assert.equal(bobAttemptToRead, null, "Bob cannot fetch Alice's draft by ID");

  // Bob saves his own draft
  saveLocalDraft(
    {
      id: "essay_draft_bob_01",
      draft_type: "writing_submission",
      title: "Bob's Unrelated Essay",
      content_json: { body: "Technology in education." },
    },
    "user_bob"
  );
  assert.equal(listLocalDrafts("user_bob").length, 1);

  // Switch back to Alice: Bob's draft does not pollute Alice's list
  setActiveUserId("user_alice");
  const aliceCurrentDrafts = listLocalDrafts("user_alice");
  assert.equal(aliceCurrentDrafts.length, 1);
  assert.equal(aliceCurrentDrafts[0].title, "Alice's Private Task 2 Essay");
  console.log("✓ Offline drafts are isolated and immune to cross-account pollution");
}

// Test 4: CEFR Leitner deck isolation
{
  setActiveUserId("learner_fast");
  setActiveCefrLevel("B2");
  assert.equal(getActiveCefrLevel(), "B2");

  // Switch to another learner
  setActiveUserId("learner_beginner");
  assert.equal(getActiveCefrLevel(), "A1", "Beginner learner starts with isolated default level A1");
  setActiveCefrLevel("A2");
  assert.equal(getActiveCefrLevel(), "A2");

  // Switch back to fast learner
  setActiveUserId("learner_fast");
  assert.equal(getActiveCefrLevel(), "B2", "Learner fast retains their B2 level without overwriting");
  console.log("✓ Leitner learning state and CEFR level are scoped per account");
}

console.log("ALL Account Storage Isolation tests PASSED!");
