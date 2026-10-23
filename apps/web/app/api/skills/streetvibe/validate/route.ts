import { NextResponse } from "next/server";
import { validateMatchSubmission } from "@/lib/skills/street-vibe-engine";
import type { MatchPayload } from "@/data/skills/games/street-vibe-types";

export async function POST(req: Request) {
  try {
    const payload: MatchPayload = await req.json();

    if (!payload || !payload.turns || !Array.isArray(payload.turns)) {
      return NextResponse.json(
        { error: "Invalid match payload format" },
        { status: 400 }
      );
    }

    const validationResult = validateMatchSubmission(payload);

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          flagged: true,
          reason: validationResult.flagReason,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      flagged: false,
      result: validationResult,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error during match validation", details: String(error) },
      { status: 500 }
    );
  }
}
