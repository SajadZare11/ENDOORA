"""
Generate Authentic Native Reference Audio for Spectrogram Neural GOP Lab
Uses edge-tts to produce studio-grade neural voice samples (en-US-JennyNeural)
and saves them to apps/web/public/audio/reference/
"""

import os
import sys
import asyncio
from pathlib import Path

# Fix Windows console UTF-8 output
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import edge_tts

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "apps" / "web" / "public" / "audio" / "reference"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

VOICE = "en-US-JennyNeural"

REFERENCE_ITEMS = [
    # AEF Utterances
    ("aef_hotel_checkin.mp3", "Good evening. I have a reservation for a single room with a bath."),
    ("aef_cafe_order.mp3", "Can I have a double espresso and a bottle of mineral water, please?"),
    ("aef_street_directions.mp3", "Excuse me, could you tell me where the nearest subway station is?"),
    
    # Speakout Utterances
    ("speakout_city_life.mp3", "Living in a bustling capital gives you endless cultural opportunities and events."),
    ("speakout_technology_interview.mp3", "I think modern technology will reshape how future generations work and communicate."),
    
    # IELTS Speaking Utterances
    ("ielts_part1_hometown.mp3", "My hometown is famous for its warm weather and friendly hospitable people."),
    ("ielts_part2_challenge.mp3", "That experience taught me how to stay calm and solve unexpected problems under pressure."),
    ("ielts_part3_environment.mp3", "Governments should invest heavily in renewable energy to protect our vulnerable planet."),
    
    # Persian L1 Contrasts
    ("p_th_voiceless.mp3", "Think carefully about the three thin paths through the forest."),
    ("p_dh_voiced.mp3", "This smooth leather is better than that other coat over there."),
    ("p_wv_contrast.mp3", "Be very wary of cold winter winds when visiting the west valley."),
    ("p_clusters_sp_st.mp3", "Students start to speak Spanish and study special sport skills."),
    ("p_ng_nasal.mp3", "The young singer is singing a charming English song this morning."),
    
    # Minimal Pairs
    ("min_sheep_ship.mp3", "The ship carries twenty white sheep."),
    ("min_thick_sick.mp3", "I think that thick cloth makes me feel sick."),
    ("min_think_sink.mp3", "Think before you sink in deep water.")
]

async def generate_item(filename: str, text: str):
    target_path = OUTPUT_DIR / filename
    print(f"Synthesizing: {filename} -> '{text[:40]}...'")
    communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
    await communicate.save(str(target_path))
    size_kb = target_path.stat().st_size / 1024
    print(f"  [OK] Saved {filename} ({size_kb:.1f} KB)")

async def main():
    print(f"Target Directory: {OUTPUT_DIR}")
    print(f"Voice: {VOICE}")
    print(f"Total items to generate: {len(REFERENCE_ITEMS)}")
    
    for filename, text in REFERENCE_ITEMS:
        try:
            await generate_item(filename, text)
        except Exception as e:
            print(f"  [WARN] Failed to generate {filename}: {e}")
            
    print("\nReference audio dataset generation complete!")

if __name__ == "__main__":
    asyncio.run(main())
