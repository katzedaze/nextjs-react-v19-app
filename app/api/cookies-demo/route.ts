import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  // 既存のCookieを読み取り
  const existingCookies = {
    theme: cookieStore.get("theme")?.value,
    session: cookieStore.get("session")?.value,
    preferences: cookieStore.get("preferences")?.value,
    all: Object.fromEntries(
      cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])
    ),
  };

  return NextResponse.json({
    message: "Cookies demonstration",
    timestamp: new Date().toISOString(),
    cookies: existingCookies,
  });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const body = await request.json();

  if (body.action === "set") {
    // Cookieを設定
    cookieStore.set("demo-cookie", "demo-value", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    cookieStore.set("theme", body.theme || "light", {
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  // 現在のCookieを返す
  const currentCookies = Object.fromEntries(
    cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])
  );

  return NextResponse.json({
    message: "Cookies updated",
    action: body.action,
    cookies: currentCookies,
  });
}
