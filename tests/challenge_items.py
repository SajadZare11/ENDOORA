import json
import os
import sys
import math
from collections import Counter, defaultdict

def run_checks():
    filepath = "data/placement/core-items.json"
    print(f"=== Adversarial Item Bank Audit: {filepath} ===")

    # 1. Loading & BOM checks
    raw_bytes = open(filepath, "rb").read()
    has_bom = raw_bytes.startswith(b"\xef\xbb\xbf")
    print(f"File size: {len(raw_bytes)} bytes")
    print(f"UTF-8 BOM present: {has_bom}")

    # Test load with standard utf-8
    try:
        data_utf8 = json.loads(raw_bytes.decode("utf-8"))
        print("[PASS] Decoded with standard utf-8 and parsed JSON successfully")
        # Check first key of first item if it's a dict or list
        if isinstance(data_utf8, list) and len(data_utf8) > 0:
            first_keys = list(data_utf8[0].keys())
            if any(k.startswith("\ufeff") for k in first_keys):
                print("[WARN] First key contains BOM character in utf-8 decode!")
            else:
                print("[PASS] No BOM artifact in parsed keys")
    except Exception as e:
        print(f"[FAIL] json.loads failed with standard utf-8: {e}")

    # Test load with utf-8-sig
    try:
        data = json.loads(raw_bytes.decode("utf-8-sig"))
        print("[PASS] Decoded with utf-8-sig successfully")
    except Exception as e:
        print(f"[FAIL] json.loads with utf-8-sig failed: {e}")
        return

    print(f"Total items loaded: {len(data)}")

    failures = []
    warnings = []

    # 2. Check IDs & Duplicates
    ids = [item.get("id") for item in data]
    id_counts = Counter(ids)
    dup_ids = [k for k, v in id_counts.items() if v > 1]
    if dup_ids:
        failures.append(f"Duplicate IDs found: {dup_ids}")
    else:
        print(f"[PASS] All {len(ids)} item IDs are strictly unique")

    # Check ID conventions
    invalid_id_format = []
    for it in data:
        item_id = it.get("id", "")
        parts = item_id.split("-")
        if len(parts) < 3:
            invalid_id_format.append(item_id)
        else:
            sec_prefix = parts[0]
            lvl_prefix = parts[1].upper()
            if sec_prefix != it.get("section") or lvl_prefix != it.get("cefr_level"):
                invalid_id_format.append((item_id, it.get("section"), it.get("cefr_level")))
    if invalid_id_format:
        failures.append(f"Mismatched ID naming convention: {invalid_id_format[:5]}")
    else:
        print("[PASS] All item IDs match section and CEFR level prefixes")

    # Check Question Texts
    questions = [it.get("question", "").strip() for it in data]
    q_counts = Counter(questions)
    dup_questions = [k for k, v in q_counts.items() if v > 1]
    if dup_questions:
        failures.append(f"Duplicate question texts found ({len(dup_questions)} duplicates): {dup_questions[:3]}")
    else:
        print("[PASS] All question texts are unique across the entire item pool")

    # 3. Check Section Breakdown
    section_counts = Counter(it.get("section") for it in data)
    print("Section distribution:", dict(section_counts))
    expected_sections = {"grammar": 90, "vocabulary": 90, "reading": 42, "listening": 42, "speaking": 42, "writing": 42}
    for sec, expected_cnt in expected_sections.items():
        if section_counts.get(sec) != expected_cnt:
            failures.append(f"Section {sec} count is {section_counts.get(sec)}, expected {expected_cnt}")

    # Check CEFR Breakdown
    cefr_counts = Counter(it.get("cefr_level") for it in data)
    print("CEFR distribution:", dict(cefr_counts))
    expected_cefr = {"A1": 58, "A2": 58, "B1": 58, "B2": 58, "C1": 58, "C2": 58}
    for lvl, expected_cnt in expected_cefr.items():
        if cefr_counts.get(lvl) != expected_cnt:
            failures.append(f"CEFR level {lvl} count is {cefr_counts.get(lvl)}, expected {expected_cnt}")

    # 4. MCQ Options and Correct Option Verification
    mcq_sections = {"grammar", "vocabulary", "reading", "listening"}
    mcq_count = 0
    option_pos_dist = Counter()

    for it in data:
        sec = it.get("section")
        item_id = it.get("id")
        if sec in mcq_sections:
            mcq_count += 1
            opts = it.get("options")
            corr = it.get("correct_option")

            if not isinstance(opts, list):
                failures.append(f"{item_id}: options is not a list")
                continue
            if len(opts) != 4:
                failures.append(f"{item_id}: options has length {len(opts)}, expected exactly 4")
                continue
            for i, o in enumerate(opts):
                if not isinstance(o, str) or not o.strip():
                    failures.append(f"{item_id}: option {i} is empty or non-string: {repr(o)}")
            
            # Check for duplicate options within the same item
            opt_set = set(o.strip() for o in opts)
            if len(opt_set) != 4:
                failures.append(f"{item_id}: duplicate options within item: {opts}")

            # Check correct_option
            if not isinstance(corr, str) or not corr.strip():
                failures.append(f"{item_id}: correct_option is empty or non-string: {repr(corr)}")
                continue

            if corr not in opts:
                # Check if it matches with strip()
                if corr.strip() in [o.strip() for o in opts]:
                    failures.append(f"{item_id}: correct_option has whitespace mismatch with options: {repr(corr)} vs {opts}")
                else:
                    failures.append(f"{item_id}: correct_option '{corr}' not found in options: {opts}")
            else:
                idx = opts.index(corr)
                option_pos_dist[idx] += 1

    print(f"[PASS] Checked {mcq_count} MCQ items.")
    print("Answer key position distribution (0=A, 1=B, 2=C, 3=D):", dict(option_pos_dist))

    # Check key distribution balance
    for pos, cnt in option_pos_dist.items():
        ratio = cnt / mcq_count
        if ratio < 0.15 or ratio > 0.35:
            warnings.append(f"Answer position {pos} has skewed frequency: {cnt}/{mcq_count} ({ratio:.1%})")

    # 5. Non-MCQ Items (Speaking, Writing)
    non_mcq_sections = {"speaking", "writing"}
    for it in data:
        sec = it.get("section")
        item_id = it.get("id")
        if sec in non_mcq_sections:
            if "rubric" not in it or not isinstance(it["rubric"], dict) or len(it["rubric"]) == 0:
                failures.append(f"{item_id}: missing or empty rubric dict")
            if "target_keywords" not in it or not isinstance(it["target_keywords"], list) or len(it["target_keywords"]) == 0:
                failures.append(f"{item_id}: missing or empty target_keywords")
            if sec == "speaking":
                if "time_limit_sec" not in it or it["time_limit_sec"] <= 0:
                    failures.append(f"{item_id}: missing or invalid time_limit_sec")
                if "min_words" not in it or it["min_words"] <= 0:
                    failures.append(f"{item_id}: missing or invalid min_words")
            if sec == "writing":
                if "min_words" not in it or it["min_words"] <= 0:
                    failures.append(f"{item_id}: missing or invalid min_words")
                if "max_words" not in it or it["max_words"] <= 0:
                    failures.append(f"{item_id}: missing or invalid max_words")
                if it.get("min_words", 0) > it.get("max_words", 0):
                    failures.append(f"{item_id}: min_words > max_words ({it.get('min_words')} > {it.get('max_words')})")

    # 6. Reading and Listening items
    for it in data:
        sec = it.get("section")
        item_id = it.get("id")
        if sec == "reading":
            if "passage" not in it or not isinstance(it["passage"], str) or not it["passage"].strip():
                failures.append(f"{item_id}: missing or empty passage")
        elif sec == "listening":
            if "audio_url" not in it or not isinstance(it["audio_url"], str) or not it["audio_url"].strip():
                failures.append(f"{item_id}: missing or empty audio_url")
            if "transcript" not in it or not isinstance(it["transcript"], str) or not it["transcript"].strip():
                failures.append(f"{item_id}: missing or empty transcript")
            if it.get("play_limit") != 2:
                failures.append(f"{item_id}: play_limit is {it.get('play_limit')}, expected 2")

    # 7. Psychometric Parameters: Difficulty b_i and Discrimination a_i
    tier_order = ["A1", "A2", "B1", "B2", "C1", "C2"]
    tier_b_values = defaultdict(list)
    tier_a_values = defaultdict(list)
    sec_tier_b = defaultdict(lambda: defaultdict(list))

    for it in data:
        item_id = it.get("id")
        b = it.get("difficulty_b")
        a = it.get("discrimination_a")
        lvl = it.get("cefr_level")
        sec = it.get("section")

        if not isinstance(b, (int, float)) or math.isnan(b) or math.isinf(b):
            failures.append(f"{item_id}: invalid difficulty_b: {b}")
        else:
            if b < -3.0 or b > 3.0:
                failures.append(f"{item_id}: difficulty_b {b} out of range [-3.0, 3.0]")
            tier_b_values[lvl].append(b)
            sec_tier_b[sec][lvl].append(b)

        if not isinstance(a, (int, float)) or math.isnan(a) or math.isinf(a):
            failures.append(f"{item_id}: invalid discrimination_a: {a}")
        else:
            if a < 0.8 or a > 1.8:
                failures.append(f"{item_id}: discrimination_a {a} out of range [0.8, 1.8]")
            tier_a_values[lvl].append(a)

    print("\n--- Psychometric Difficulty b_i Summary by CEFR Level ---")
    prev_mean = -999.0
    for lvl in tier_order:
        vals = tier_b_values[lvl]
        mean_b = sum(vals) / len(vals)
        min_b = min(vals)
        max_b = max(vals)
        print(f"  {lvl} (n={len(vals)}): mean={mean_b:.4f}, min={min_b:.4f}, max={max_b:.4f}")
        if mean_b <= prev_mean:
            failures.append(f"Mean difficulty for {lvl} ({mean_b:.4f}) is not strictly greater than previous tier ({prev_mean:.4f})")
        prev_mean = mean_b

    print("\n--- Psychometric Discrimination a_i Summary by CEFR Level ---")
    for lvl in tier_order:
        vals = tier_a_values[lvl]
        mean_a = sum(vals) / len(vals)
        min_a = min(vals)
        max_a = max(vals)
        print(f"  {lvl} (n={len(vals)}): mean={mean_a:.4f}, min={min_a:.4f}, max={max_a:.4f}")

    # Monotonicity check across sections
    print("\n--- Mean Difficulty b_i per Section x CEFR Level ---")
    for sec in expected_sections:
        print(f"  Section: {sec}")
        prev_sec_mean = -999.0
        for lvl in tier_order:
            vals = sec_tier_b[sec][lvl]
            sec_mean = sum(vals) / len(vals) if vals else 0
            sec_min = min(vals) if vals else 0
            sec_max = max(vals) if vals else 0
            print(f"    {lvl}: mean={sec_mean:.4f} [min={sec_min:.4f}, max={sec_max:.4f}]")
            if sec_mean <= prev_sec_mean:
                failures.append(f"Section {sec} tier {lvl} mean ({sec_mean:.4f}) <= previous ({prev_sec_mean:.4f})")
            prev_sec_mean = sec_mean

    # Check for severe inversions: e.g. A1 item with b > B1/B2/C1/C2 item
    print("\n--- Inversion Check ---")
    for i, lvl1 in enumerate(tier_order):
        for j, lvl2 in enumerate(tier_order):
            if i < j:
                # lvl1 should be easier than lvl2
                # Check if any item in lvl1 has b > max or min in lvl2
                # Non-adjacent inversion: if j >= i + 2 (e.g. A1 vs B1, A2 vs B2, etc.)
                vals1 = tier_b_values[lvl1]
                vals2 = tier_b_values[lvl2]
                max_v1 = max(vals1)
                min_v2 = min(vals2)
                overlap = max_v1 - min_v2
                if j >= i + 2 and max_v1 > min_v2:
                    failures.append(f"Severe inversion between {lvl1} and {lvl2}: max({lvl1})={max_v1:.4f} > min({lvl2})={min_v2:.4f}")
                elif max_v1 > min_v2:
                    print(f"  Adjacent overlap between {lvl1} and {lvl2}: max({lvl1})={max_v1:.4f}, min({lvl2})={min_v2:.4f} (diff={overlap:.4f})")
                else:
                    print(f"  Strict separation between {lvl1} and {lvl2}: max({lvl1})={max_v1:.4f} <= min({lvl2})={min_v2:.4f}")

    # 8. Check for Placeholder Text or Suspicious Strings
    print("\n--- Content Quality & Placeholders ---")
    suspicious_patterns = ["todo", "placeholder", "tbd", "lorem ipsum", "asdf", "test test", "xxx"]
    for it in data:
        item_id = it.get("id")
        text_to_check = [
            it.get("question", ""),
            it.get("prompt_fa", ""),
            it.get("passage", ""),
            it.get("transcript", "")
        ] + (it.get("options", []) or [])
        full_text = " ".join(t.lower() for t in text_to_check if isinstance(t, str))
        for p in suspicious_patterns:
            if p in full_text:
                failures.append(f"{item_id}: contains suspicious placeholder '{p}' in content")

    print("\n=== Summary ===")
    print(f"Failures: {len(failures)}")
    print(f"Warnings: {len(warnings)}")
    for f in failures:
        print(f"  [FAIL] {f}")
    for w in warnings:
        print(f"  [WARN] {w}")

    if not failures:
        print("\nALL ADVERSARIAL INTEGRITY CHECKS PASSED!")
    else:
        print("\nADVERSARIAL CHECKS DETECTED ISSUES!")

if __name__ == "__main__":
    run_checks()
