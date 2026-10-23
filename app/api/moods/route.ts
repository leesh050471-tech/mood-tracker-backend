import { NextResponse } from "next/server";
import { deleteMood, listMoods, upsertMood } from "@/lib/db";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// CORS preflight (헤더는 next.config.ts 에서 붙음)
export function OPTIONS() {
  return new Response(null, { status: 204 });
}

export function GET(req: Request) {
  const limit = Number(new URL(req.url).searchParams.get("limit"));
  return NextResponse.json(listMoods(Number.isInteger(limit) && limit > 0 ? Math.min(limit, 5000) : undefined));
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const date = body?.date;
  const score = Number(body?.score);
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 500) : "";

  if (typeof date !== "string" || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "날짜 형식이 올바르지 않아요." }, { status: 400 });
  }
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return NextResponse.json({ error: "기분은 1~5 사이여야 해요." }, { status: 400 });
  }
  return NextResponse.json(upsertMood(date, score, note));
}

export function DELETE(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? "";
  if (!DATE_RE.test(date)) {
    return NextResponse.json({ error: "날짜 형식이 올바르지 않아요." }, { status: 400 });
  }
  return NextResponse.json({ deleted: deleteMood(date) });
}
