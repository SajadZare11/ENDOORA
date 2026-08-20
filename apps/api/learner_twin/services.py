def build_twin_summary(evidence_events):
    return {
        "skills": {},
        "known_vocabulary": [],
        "learning_vocabulary": [],
        "grammar_patterns": [],
        "preferences": {},
        "evidence_count": len(evidence_events),
        "claims": [],
    }


def reset_twin(twin):
    twin.summary = {}
    twin.evidence_count = 0
    twin.save(update_fields=["summary", "evidence_count"])
