import { auth } from "@/auth";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";

export default async function NextAuthPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">NextAuth.js (Auth.js)</h1>
        <p className="text-muted-foreground">
          NextAuth.jsは、Next.jsアプリケーションに認証機能を簡単に追加できる
          完全なソリューションです。OAuth、メール/パスワード、マジックリンクなど
          様々な認証方法をサポートしています。
        </p>
      </div>

      <Alert>
        <ShieldIcon className="h-4 w-4" />
        <AlertTitle>現在のセッション状態</AlertTitle>
        <AlertDescription>
          {session ? (
            <div className="mt-2">
              <p>ログイン中: {session.user?.email}</p>
              <p>ロール: {session.user?.role || "user"}</p>
            </div>
          ) : (
            <div className="mt-2">
              <p>未ログイン</p>
              <Button asChild size="sm" className="mt-2">
                <Link href="/auth/signin">ログインページへ</Link>
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>NextAuthの基本設定</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 認証ロジック
        const user = await validateUser(credentials);
        return user;
      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="providers">プロバイダー</TabsTrigger>
          <TabsTrigger value="session">セッション管理</TabsTrigger>
          <TabsTrigger value="protection">ルート保護</TabsTrigger>
          <TabsTrigger value="callbacks">コールバック</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>認証プロバイダー</CardTitle>
              <CardDescription>様々な認証方法をサポート</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <KeyIcon className="h-5 w-5" />
                    <h4 className="font-semibold">資格情報プロバイダー</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    メールアドレスとパスワードによる従来の認証
                  </p>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`Credentials({
  async authorize(credentials) {
    const user = await db.user.findUnique({
      where: { email: credentials.email }
    });

    if (user && await bcrypt.compare(
      credentials.password,
      user.hashedPassword
    )) {
      return user;
    }

    return null;
  }
})`}</code>
                  </pre>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">OAuthプロバイダー</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted rounded flex items-center gap-2">
                      <Badge variant="outline">GitHub</Badge>
                      <span className="text-sm">開発者向け</span>
                    </div>
                    <div className="p-2 bg-muted rounded flex items-center gap-2">
                      <Badge variant="outline">Google</Badge>
                      <span className="text-sm">汎用的</span>
                    </div>
                    <div className="p-2 bg-muted rounded flex items-center gap-2">
                      <Badge variant="outline">Discord</Badge>
                      <span className="text-sm">コミュニティ</span>
                    </div>
                    <div className="p-2 bg-muted rounded flex items-center gap-2">
                      <Badge variant="outline">Slack</Badge>
                      <span className="text-sm">企業向け</span>
                    </div>
                  </div>
                  <pre className="bg-muted p-3 rounded text-sm mt-3">
                    <code>{`// 複数のプロバイダーを組み合わせ
providers: [
  GitHub({ clientId, clientSecret }),
  Google({ clientId, clientSecret }),
  Discord({ clientId, clientSecret }),
]`}</code>
                  </pre>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">マジックリンク</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    パスワードレス認証（メールリンク）
                  </p>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`Email({
  server: process.env.EMAIL_SERVER,
  from: process.env.EMAIL_FROM,
  maxAge: 24 * 60 * 60, // 24時間
})`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session">
          <Card>
            <CardHeader>
              <CardTitle>セッション管理</CardTitle>
              <CardDescription>JWTとデータベースセッション</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">
                    サーバーコンポーネントでの使用
                  </h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <div>ログインしてください</div>;
  }

  return (
    <div>
      <h1>ようこそ、{session.user?.name}さん</h1>
      <p>メール: {session.user?.email}</p>
      <p>ロール: {session.user?.role}</p>
    </div>
  );
}`}</code>
                  </pre>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">
                    クライアントコンポーネントでの使用
                  </h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`'use client';

import { useSession } from "next-auth/react";

export function UserAvatar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>読み込み中...</div>;
  }

  if (status === "unauthenticated") {
    return <div>未ログイン</div>;
  }

  return (
    <div>
      <img src={session?.user?.image} />
      <span>{session?.user?.name}</span>
    </div>
  );
}`}</code>
                  </pre>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">セッション戦略</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="font-medium">JWT</span>
                      <span className="text-sm text-muted-foreground">
                        ステートレス、スケーラブル
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="font-medium">Database</span>
                      <span className="text-sm text-muted-foreground">
                        セッション無効化が容易
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protection">
          <Card>
            <CardHeader>
              <CardTitle>ルート保護とアクセス制御</CardTitle>
              <CardDescription>認証・認可によるアクセス制限</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">Middlewareでの保護</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`// middleware.ts
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // 保護されたルート
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(
        new URL("/auth/signin", request.url)
      );
    }
  }

  // 管理者のみ
  if (pathname.startsWith("/admin")) {
    if (session?.user?.role !== "admin") {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }
  }

  return NextResponse.next();
}`}</code>
                  </pre>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">Server Actionsでの保護</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`'use server';

import { auth } from "@/auth";

export async function deletePost(postId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("認証が必要です");
  }

  if (session.user.role !== "admin") {
    throw new Error("権限がありません");
  }

  // 削除処理
  await db.post.delete({ where: { id: postId } });
}`}</code>
                  </pre>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold mb-2">APIルートの保護</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
                    <code>{`// app/api/admin/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 管理者のみアクセス可能なデータ
  return NextResponse.json({ data: "secret" });
}`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="callbacks">
          <Card>
            <CardHeader>
              <CardTitle>コールバック関数</CardTitle>
              <CardDescription>認証フローのカスタマイズ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`callbacks: {
  // サインイン時の処理
  async signIn({ user, account, profile }) {
    // 特定のメールドメインのみ許可
    if (user.email?.endsWith("@company.com")) {
      return true;
    }
    return false;
  },

  // JWTトークンのカスタマイズ
  async jwt({ token, user, account, trigger }) {
    // 初回サインイン時
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }

    // トークン更新時
    if (trigger === "update") {
      // 最新のユーザー情報を取得
      const updatedUser = await getUser(token.id);
      token.role = updatedUser.role;
    }

    return token;
  },

  // セッションのカスタマイズ
  async session({ session, token }) {
    session.user.id = token.id;
    session.user.role = token.role;

    // 追加情報を含める
    session.accessToken = token.accessToken;

    return session;
  },

  // リダイレクト処理
  async redirect({ url, baseUrl }) {
    // 同一オリジンのみ許可
    if (url.startsWith(baseUrl)) {
      return url;
    }

    // それ以外はホームへ
    return baseUrl;
  }
}`}</code>
              </pre>

              <Alert>
                <AlertDescription>
                  コールバックは認証フローの各段階で実行され、
                  カスタムロジックを追加できます。
                  セキュリティを考慮して慎重に実装してください。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>デモアカウント</CardTitle>
          <CardDescription>
            このアプリケーションで使用できるテストアカウント
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">管理者アカウント</h4>
                <Badge>admin</Badge>
              </div>
              <p className="text-sm font-mono">メール: admin@example.com</p>
              <p className="text-sm font-mono">パスワード: password123</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">一般ユーザー</h4>
                <Badge variant="secondary">user</Badge>
              </div>
              <p className="text-sm font-mono">メール: user@example.com</p>
              <p className="text-sm font-mono">パスワード: password123</p>
            </div>
          </div>
          <Button asChild className="mt-4">
            <Link href="/auth/signin">ログインページへ移動</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
