# -*- coding: utf-8 -*-
"""
Builds the complete TypeScript file:
apps/web/data/skills/games/writing-clue-curriculum.ts
From modular Python files.
"""

import json
import os
import sys

# Ensure current dir is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from curriculum_a1_a2 import A1_CASES, A2_CASES
from curriculum_b1_b2 import B1_CASES, B2_CASES
from curriculum_c1_c2 import C1_CASES, C2_CASES

def to_ts_val(obj, indent=2):
    return json.dumps(obj, ensure_ascii=False, indent=indent)

def build():
    output_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "apps", "web", "data", "skills", "games", "writing-clue-curriculum.ts"
    )

    lines = []
    lines.append('import type { CefrLevel } from "./types";')
    lines.append('import type {')
    lines.append('  WritingStageCase,')
    lines.append('  DailyBountyMeta,')
    lines.append('  WritingTheme,')
    lines.append('} from "./writing-clue-types";\n')

    lines.append('// ============================================================================')
    lines.append('// A1 CASES: WORD-BOT FACTORY (کارخانه اسباب‌بازی روبات‌ها)')
    lines.append('// ============================================================================')
    lines.append(f'export const A1_WRITING_CASES: WritingStageCase[] = {to_ts_val(A1_CASES)};\n')

    lines.append('// ============================================================================')
    lines.append('// A2 CASES: WORD-BOT FACTORY ADVANCED (کارخانه روبات‌ها - چالش‌های پیشرفته)')
    lines.append('// ============================================================================')
    lines.append(f'export const A2_WRITING_CASES: WritingStageCase[] = {to_ts_val(A2_CASES)};\n')

    lines.append('// ============================================================================')
    lines.append('// B1 CASES: NOIR EVIDENCE BOARD (اتاق مدارک کارآگاه نوآر)')
    lines.append('// ============================================================================')
    lines.append(f'export const B1_WRITING_CASES: WritingStageCase[] = {to_ts_val(B1_CASES)};\n')

    lines.append('// ============================================================================')
    lines.append('// B2 CASES: NOIR EVIDENCE BOARD MASTER (سازمان بازرسی ویژه نوآر)')
    lines.append('// ============================================================================')
    lines.append(f'export const B2_WRITING_CASES: WritingStageCase[] = {to_ts_val(B2_CASES)};\n')

    lines.append('// ============================================================================')
    lines.append('// C1 CASES: PROTOCOL ZERO: CYBER INTEL DOSSIER (اتاق ضداطلاعات و پروتکل سایبری)')
    lines.append('// ============================================================================')
    lines.append(f'export const C1_WRITING_CASES: WritingStageCase[] = {to_ts_val(C1_CASES)};\n')

    lines.append('// ============================================================================')
    lines.append('// C2 CASES: PROTOCOL ZERO: SUPREME STATECRAFT (اتاق فرماندهی عالی و اسناد فوق‌محرمانه)')
    lines.append('// ============================================================================')
    lines.append(f'export const C2_WRITING_CASES: WritingStageCase[] = {to_ts_val(C2_CASES)};\n')

    lines.append('''export const ALL_WRITING_CASES: Record<CefrLevel, WritingStageCase[]> = {
  A1: A1_WRITING_CASES,
  A2: A2_WRITING_CASES,
  B1: B1_WRITING_CASES,
  B2: B2_WRITING_CASES,
  C1: C1_WRITING_CASES,
  C2: C2_WRITING_CASES,
};

export function getWritingStageCasesByCefr(cefr: CefrLevel): WritingStageCase[] {
  return ALL_WRITING_CASES[cefr] || [];
}

export function getWritingStageCase(cefr: CefrLevel, levelNumber: number): WritingStageCase | undefined {
  const cases = getWritingStageCasesByCefr(cefr);
  return cases.find((c) => c.levelNumber === levelNumber);
}

export function getWritingDailyBounty(): DailyBountyMeta {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const tiers: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const selectedCefr = tiers[dayOfYear % tiers.length];
  const selectedLvl = (dayOfYear % 10) + 1;
  const stageCase = getWritingStageCase(selectedCefr, selectedLvl) || A1_WRITING_CASES[0];

  return {
    cefr: selectedCefr,
    levelNumber: selectedLvl,
    caseCode: stageCase.caseCode,
    titleFa: stageCase.stageTitleFa,
    bountyBonusXp: 120,
    taglineFa: "پرونده طلایی امروز: حل مأموریت ویژه با امتیاز ۲ برابر و پین شدن روی تابلوی شهر!",
  };
}
''')

    full_code = "\n".join(lines)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(full_code)

    print(f"Successfully generated {output_path} with all 60 stages!")

if __name__ == "__main__":
    build()
