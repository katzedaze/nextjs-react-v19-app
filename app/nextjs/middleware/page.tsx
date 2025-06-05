import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, ShieldIcon } from "lucide-react";

export default function MiddlewarePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Next.js Middleware</h1>
        <p className="text-muted-foreground">
          Middlewareは、リクエストが完了する前にコードを実行できる強力な機能です。
          認証、リダイレクト、ヘッダーの追加、レート制限など、様々な用途で使用できます。
        </p>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Middlewareの実行タイミング</AlertTitle>
        <AlertDescription>
          MiddlewareはEdge Runtimeで実行され、キャッシュされたコンテンツの前、
          ルートへのマッチングの前に実行されます。
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Middlewareの基本構造</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// middleware.ts (プロジェクトルート)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // リクエストの処理
  return NextResponse.next();
}

// Middlewareを適用するパスの設定
export const config = {
  matcher: [
    // api, _next/static, _next/image, favicon.ico を除外
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="auth">認証チェック</TabsTrigger>
          <TabsTrigger value="redirect">リダイレクト</TabsTrigger>
          <TabsTrigger value="headers">ヘッダー操作</TabsTrigger>
          <TabsTrigger value="ratelimit">レート制限</TabsTrigger>
        </TabsList>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>認証とアクセス制御</CardTitle>
              <CardDescription>
                保護されたルートへのアクセスを制御
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <ShieldIcon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">保護されたルート</p>
                    <p className="text-sm text-muted-foreground">
                      /dashboard, /profile, /admin
                    </p>
                  </div>
                  <Badge variant="secondary">認証必須</Badge>
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/admin"];
const adminRoutes = ["/admin"];
const authRoutes = ["/auth/signin", "/auth/signup"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await auth();

  // 保護されたルートへのアクセスチェック
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 管理者ルートへのアクセスチェック
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 認証ルートへのアクセスチェック
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 認証済みユーザーを認証ページからリダイレクト
  if (isAuthRoute && session) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // 未認証ユーザーをログインページへリダイレクト
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/auth/signin", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 管理者権限のチェック
  if (isAdminRoute && session?.user?.role !== "admin") {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redirect">
          <Card>
            <CardHeader>
              <CardTitle>条件付きリダイレクト</CardTitle>
              <CardDescription>
                地域、言語、デバイスに基づくリダイレクト
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 地域ベースのリダイレクト
  const country = request.geo?.country || 'US';

  if (pathname === '/') {
    if (country === 'JP') {
      return NextResponse.redirect(
        new URL('/ja', request.url)
      );
    }
  }

  // モバイルデバイスの検出
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /mobile/i.test(userAgent);

  if (isMobile && pathname.startsWith('/desktop-only')) {
    return NextResponse.redirect(
      new URL('/mobile', request.url)
    );
  }

  // メンテナンスモード
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode && pathname !== '/maintenance') {
    return NextResponse.redirect(
      new URL('/maintenance', request.url)
    );
  }

  // URLの正規化 (末尾スラッシュの削除)
  if (pathname.endsWith('/') && pathname !== '/') {
    return NextResponse.redirect(
      new URL(pathname.slice(0, -1), request.url)
    );
  }

  return NextResponse.next();
}`}</code>
              </pre>

              <Alert>
                <AlertDescription>
                  リダイレクトは永続的（308）または一時的（307）に設定できます。
                  SEOへの影響を考慮して適切なステータスコードを選択してください。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headers">
          <Card>
            <CardHeader>
              <CardTitle>リクエスト/レスポンスヘッダーの操作</CardTitle>
              <CardDescription>
                セキュリティヘッダーやカスタムヘッダーの追加
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`export function middleware(request: NextRequest) {
  // リクエストヘッダーの読み取り
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-custom-header', 'my-value');

  // IPアドレスの転送
  const ip = request.ip || 'unknown';
  requestHeaders.set('x-forwarded-for', ip);

  // レスポンスの作成
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // セキュリティヘッダーの追加
  response.headers.set(
    'X-Content-Type-Options',
    'nosniff'
  );
  response.headers.set(
    'X-Frame-Options',
    'DENY'
  );
  response.headers.set(
    'X-XSS-Protection',
    '1; mode=block'
  );
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );

  // CORS ヘッダー
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set(
      'Access-Control-Allow-Origin',
      process.env.ALLOWED_ORIGIN || '*'
    );
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
  }

  // カスタムヘッダーでデバッグ情報を追加
  if (process.env.NODE_ENV === 'development') {
    response.headers.set(
      'x-middleware-cache',
      request.headers.get('x-middleware-cache') || 'miss'
    );
    response.headers.set(
      'x-middleware-timestamp',
      Date.now().toString()
    );
  }

  return response;
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratelimit">
          <Card>
            <CardHeader>
              <CardTitle>レート制限の実装</CardTitle>
              <CardDescription>
                APIエンドポイントの保護とDoS攻撃の防止
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// 簡易的なインメモリレート制限の例
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  // APIルートのみに適用
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip = request.ip || 'anonymous';
  const windowMs = 60 * 1000; // 1分間
  const maxRequests = 10; // 1分間に10リクエストまで

  const now = Date.now();
  const userRateLimit = rateLimit.get(ip);

  if (!userRateLimit || now > userRateLimit.resetTime) {
    // 新しいウィンドウを開始
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
  } else if (userRateLimit.count >= maxRequests) {
    // レート制限に達した
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        retryAfter: Math.ceil((userRateLimit.resetTime - now) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': userRateLimit.resetTime.toString(),
        },
      }
    );
  } else {
    // カウントを増やす
    userRateLimit.count++;
  }

  const response = NextResponse.next();
  const remaining = maxRequests - (userRateLimit?.count || 0);

  // レート制限情報をヘッダーに追加
  response.headers.set('X-RateLimit-Limit', maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set(
    'X-RateLimit-Reset',
    (userRateLimit?.resetTime || 0).toString()
  );

  return response;
}

// 定期的なクリーンアップ（メモリリーク防止）
setInterval(() => {
  const now = Date.now();
  for (const [ip, limit] of rateLimit.entries()) {
    if (now > limit.resetTime) {
      rateLimit.delete(ip);
    }
  }
}, 60 * 1000); // 1分ごと`}</code>
              </pre>

              <Alert>
                <AlertDescription>
                  本番環境では、RedisやUpstashなどの永続的なストレージを使用して、
                  分散環境でも動作するレート制限を実装することを推奨します。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Middlewareのベストプラクティス</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge variant="outline">パフォーマンス</Badge>
                軽量に保つ
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                MiddlewareはすべてのリクエストでEdge Runtimeで実行されるため、
                重い処理は避け、必要最小限の処理に留める。
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge variant="outline">matcher設定</Badge>
                適切なパスマッチング
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                静的アセットやAPIルートなど、不要なパスでMiddlewareが
                実行されないようmatcherを適切に設定する。
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge variant="outline">Edge Runtime</Badge>
                制限事項の理解
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Node.js APIの一部は使用できない。Web標準APIを使用し、
                軽量なライブラリを選択する。
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge variant="outline">エラーハンドリング</Badge>
                適切なフォールバック
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Middlewareでエラーが発生してもアプリケーションが
                停止しないよう、try-catchで適切にエラーを処理する。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
