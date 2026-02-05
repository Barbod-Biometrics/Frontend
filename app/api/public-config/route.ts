import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const recaptchaSiteKey =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ??
    process.env.RECAPTCHA_SITE_KEY ??
    "6LftZzgsAAAAAJCibzAS3IeBypdOKJvHOBva5oWa";

  return NextResponse.json(
    { recaptchaSiteKey },
    { headers: { "Cache-Control": "no-store" } }
  );
}
