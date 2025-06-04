import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const headersList = await headers();

  // リクエストヘッダーの情報を収集
  const headersInfo = {
    userAgent: headersList.get("user-agent"),
    accept: headersList.get("accept"),
    acceptLanguage: headersList.get("accept-language"),
    referer: headersList.get("referer"),
    customHeader: headersList.get("custom-header"),
    clientInfo: headersList.get("x-client-info"),
    all: Object.fromEntries(headersList.entries()),
  };

  return NextResponse.json({
    message: "Headers demonstration",
    timestamp: new Date().toISOString(),
    headers: headersInfo,
  });
}

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const body = await request.json();

  return NextResponse.json({
    message: "POST request received",
    headers: {
      contentType: headersList.get("content-type"),
      authorization: headersList.get("authorization"),
      customHeader: headersList.get("custom-header"),
    },
    body,
  });
}
