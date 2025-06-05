"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CookieIcon, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CookiesPage() {
  const [cookieData, setCookieData] = useState<{
    message: string;
    timestamp?: string;
    cookies: Record<string, string>;
    action?: string;
  } | null>(null);
  const [cookieName, setCookieName] = useState("");
  const [cookieValue, setCookieValue] = useState("");

  const fetchCookies = async () => {
    try {
      const response = await fetch("/api/cookies-demo");
      const data = await response.json();
      setCookieData(data);
    } catch {
      console.error("Error fetching cookies");
    }
  };

  useEffect(() => {
    fetchCookies();
  }, []);

  const setCookieDemo = async () => {
    try {
      const response = await fetch("/api/cookies-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set",
          theme: "dark",
        }),
      });
      const data = await response.json();
      setCookieData(data);
      toast.success("Cookieを設定しました");
    } catch {
      toast.error("Cookieの設定に失敗しました");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Next.js Cookies</h1>
        <p className="text-muted-foreground">
          Next.jsでのCookie操作は、サーバーコンポーネントとRoute Handlersで
          <code>cookies()</code>関数を使用して行います。
          セキュアで型安全なCookie管理が可能です。
        </p>
      </div>

      <Alert>
        <CookieIcon className="h-4 w-4" />
        <AlertTitle>Cookie操作の制限</AlertTitle>
        <AlertDescription>
          サーバーコンポーネントではCookieの読み取りのみ可能です。
          設定や削除はRoute HandlersまたはServer Actionsで行います。
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Cookieの基本操作</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { cookies } from "next/headers";

// サーバーコンポーネントでの読み取り
export default async function Page() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');

  return <div>Theme: {theme?.value}</div>;
}

// Route Handlerでの設定
export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set('name', 'value', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1日
    path: '/',
  });
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="server" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="server">サーバー操作</TabsTrigger>
          <TabsTrigger value="client">クライアント操作</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
          <TabsTrigger value="demo">デモ</TabsTrigger>
        </TabsList>

        <TabsContent value="server">
          <Card>
            <CardHeader>
              <CardTitle>サーバーサイドでのCookie操作</CardTitle>
              <CardDescription>
                サーバーコンポーネントとRoute Handlers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">読み取り操作</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`// 単一のCookieを取得
const theme = cookieStore.get('theme');
console.log(theme); // { name: 'theme', value: 'dark' }

// すべてのCookieを取得
const allCookies = cookieStore.getAll();

// 存在確認
const hasSession = cookieStore.has('session');`}</code>
                  </pre>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">
                    設定・削除操作（Route Handler）
                  </h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`// Cookie設定
cookieStore.set('user-id', '12345', {
  httpOnly: true,    // JavaScriptからアクセス不可
  secure: true,      // HTTPS必須
  sameSite: 'lax',   // CSRF保護
  maxAge: 60 * 60,   // 1時間
  path: '/',         // パス指定
  domain: '.example.com', // サブドメイン共有
});

// Cookie削除
cookieStore.delete('user-id');

// 複数のCookieを一度に設定
cookieStore.set({
  name: 'session',
  value: sessionId,
  httpOnly: true,
  secure: true,
});`}</code>
                  </pre>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  サーバーコンポーネントは静的にレンダリングされる可能性があるため、
                  動的な値（リクエスト時の値）が必要な場合は
                  <code>dynamic = {`'force-dynamic'`}</code>を設定してください。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="client">
          <Card>
            <CardHeader>
              <CardTitle>クライアントサイドでのCookie操作</CardTitle>
              <CardDescription>
                Server ActionsとクライアントJavaScript
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// Server Action
'use server';

import { cookies } from 'next/headers';

export async function updateTheme(theme: string) {
  const cookieStore = await cookies();

  cookieStore.set('theme', theme, {
    maxAge: 60 * 60 * 24 * 30, // 30日
  });

  // 必要に応じてrevalidatePathやredirect
  revalidatePath('/');
}

// クライアントコンポーネント
'use client';

import { updateTheme } from './actions';

export function ThemeToggle() {
  return (
    <button onClick={() => updateTheme('dark')}>
      ダークモードに切り替え
    </button>
  );
}

// クライアントJavaScript（非推奨）
// document.cookieは直接使用可能だが、
// httpOnly Cookieにはアクセスできない
document.cookie = 'client-cookie=value; path=/';`}</code>
              </pre>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  セキュリティのため、重要な情報はhttpOnly Cookieに保存し、
                  クライアントサイドからは直接アクセスできないようにしてください。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Cookieセキュリティのベストプラクティス</CardTitle>
              <CardDescription>安全なCookie管理のための設定</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">httpOnly</h4>
                    <Badge variant="destructive">必須</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    JavaScriptからのアクセスを防ぎ、XSS攻撃を軽減
                  </p>
                  <pre className="bg-muted p-2 rounded text-sm mt-2">
                    <code>{`cookieStore.set('session', value, { httpOnly: true });`}</code>
                  </pre>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">secure</h4>
                    <Badge variant="destructive">本番環境で必須</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    HTTPS接続でのみCookieを送信
                  </p>
                  <pre className="bg-muted p-2 rounded text-sm mt-2">
                    <code>{`cookieStore.set('auth', token, { secure: true });`}</code>
                  </pre>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">sameSite</h4>
                    <Badge>推奨</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    CSRF攻撃を防ぐための設定
                  </p>
                  <div className="space-y-2 mt-2">
                    <div className="text-sm">
                      <code className="bg-muted px-1 rounded">strict</code>:
                      同一サイトからのみ送信
                    </div>
                    <div className="text-sm">
                      <code className="bg-muted px-1 rounded">lax</code>:
                      トップレベルナビゲーションでも送信
                    </div>
                    <div className="text-sm">
                      <code className="bg-muted px-1 rounded">none</code>:
                      常に送信（secure必須）
                    </div>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">暗号化</h4>
                  <p className="text-sm text-muted-foreground">
                    機密情報は暗号化してから保存
                  </p>
                  <pre className="bg-muted p-2 rounded text-sm mt-2">
                    <code>{`import { SignJWT, jwtVerify } from 'jose';

// 暗号化
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const token = await new SignJWT({ userId: '123' })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('1h')
  .sign(secret);

cookieStore.set('session', token, { httpOnly: true });`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo">
          <Card>
            <CardHeader>
              <CardTitle>Cookie操作のデモ</CardTitle>
              <CardDescription>
                実際にCookieを操作してみましょう
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Button onClick={fetchCookies} variant="outline">
                  現在のCookieを取得
                </Button>

                <Button onClick={setCookieDemo}>デモCookieを設定</Button>

                {cookieData && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">現在のCookie:</h4>
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(cookieData.cookies, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="cookie-name">Cookie名</Label>
                  <Input
                    id="cookie-name"
                    value={cookieName}
                    onChange={(e) => setCookieName(e.target.value)}
                    placeholder="my-cookie"
                  />
                  <Label htmlFor="cookie-value">値</Label>
                  <Input
                    id="cookie-value"
                    value={cookieValue}
                    onChange={(e) => setCookieValue(e.target.value)}
                    placeholder="cookie-value"
                  />
                  <Button
                    onClick={async () => {
                      // Server Actionを呼び出すか、
                      // Route Handlerにリクエストを送信
                      toast.info("実装例をご確認ください");
                    }}
                    disabled={!cookieName || !cookieValue}
                  >
                    カスタムCookieを設定
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Cookieの使用例</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">セッション管理</h4>
              <p className="text-sm text-muted-foreground">
                認証トークンやセッションIDの保存（httpOnly必須）
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">ユーザー設定</h4>
              <p className="text-sm text-muted-foreground">
                テーマ、言語、表示設定などの保存
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">分析・追跡</h4>
              <p className="text-sm text-muted-foreground">
                ユーザーIDや訪問回数の記録（GDPR準拠に注意）
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">一時的なデータ</h4>
              <p className="text-sm text-muted-foreground">
                フォームの一時保存、ショッピングカートなど
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
