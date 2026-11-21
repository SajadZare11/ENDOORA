"""Optional CPU reranking bounded to permission-filtered lexical matches."""
from functools import lru_cache
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def load_model(directory):
    # Failure is cached to avoid repeating a failed import or model load per request.
    try:
        from .onnx_encoder import MiniLMEncoder
        return MiniLMEncoder(directory)
    except Exception:
        logger.warning("Local search model unavailable. Using lexical order.")
        return None


def ranked_page(queryset, query, start, end):
    directory = getattr(settings, "ENDOORA_SEARCH_MODEL_DIR", "")
    window = 32
    if not directory or start >= window:
        return list(queryset[start:end])
    model = load_model(directory)
    if model is None:
        return list(queryset[start:end])
    candidates = list(queryset[:window])
    if len(candidates) < 2:
        return candidates[start:end]
    try:
        texts = [query[:240], *(doc.title[:200] + " " + doc.content[:500] for doc in candidates)]
        vectors = model.encode(texts)
        scores = vectors[1:] @ vectors[0]
        # Exact title matches keep priority, stable sort preserves lexical ties.
        ranked = sorted(zip(candidates, scores), key=lambda pair: (
            pair[0].exact_title_match == 100, float(pair[1])), reverse=True)
    except Exception:
        logger.warning("Local reranking failed. Using lexical order.")
        return list(queryset[start:end])
    results = [doc for doc, _ in ranked[start:end]]
    if end > window:
        results.extend(queryset[window:end])
    return results
