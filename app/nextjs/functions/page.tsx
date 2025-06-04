"use client";

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
import { useState } from "react";

export default function NextJSFunctionsPage() {
  const [urlResult, setUrlResult] = useState<string>("");
  const [headersResult, setHeadersResult] = useState<string>("");
  const [redirectResult, setRedirectResult] = useState<string>("");
  const [cookiesResult, setCookiesResult] = useState<string>("");

  // Next.jsのURLの例
  const demonstrateURL = () => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const result = {
        href: url.href,
        origin: url.origin,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        protocol: url.protocol,
      };
      setUrlResult(JSON.stringify(result, null, 2));
    }
  };

  // Headers API のデモ
  const demonstrateHeaders = async () => {
    try {
      const response = await fetch("/api/headers-demo", {
        headers: {
          "Custom-Header": "demo-value",
          "X-Client-Info": "next-js-demo",
        },
      });
      const data = await response.json();
      setHeadersResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setHeadersResult(`Error: ${error}`);
    }
  };

  // Redirect のデモ
  const demonstrateRedirect = () => {
    setRedirectResult(
      "Redirect would happen in a Server Component or API Route"
    );
  };

  // Cookies のデモ
  const demonstrateCookies = async () => {
    try {
      const response = await fetch("/api/cookies-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "get" }),
      });
      const data = await response.json();
      setCookiesResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setCookiesResult(`Error: ${error}`);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Next.js Functions</h1>
        <p className="text-muted-foreground">
          Next.js 15で提供されるWeb
          API互換の関数とユーティリティ関数のサンプルコード集です。 Server
          ComponentsやAPI Routesで使用できる様々な機能を紹介します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next.js Functions 概要</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Web API 互換関数</h3>
              <ul className="space-y-1 text-sm">
                <li>• headers() - リクエストヘッダーの読み取り</li>
                <li>• cookies() - Cookieの読み書き</li>
                <li>• redirect() - リダイレクトの実行</li>
                <li>• notFound() - 404ページの表示</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">ユーティリティ関数</h3>
              <ul className="space-y-1 text-sm">
                <li>• generateMetadata() - 動的メタデータ</li>
                <li>• generateStaticParams() - 静的パラメータ</li>
                <li>• revalidatePath() - キャッシュ再検証</li>
                <li>• unstable_cache() - データキャッシュ</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="web-apis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="web-apis">Web APIs</TabsTrigger>
          <TabsTrigger value="caching">キャッシング</TabsTrigger>
          <TabsTrigger value="metadata">メタデータ</TabsTrigger>
          <TabsTrigger value="examples">実例</TabsTrigger>
        </TabsList>

        <TabsContent value="web-apis">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  headers()
                  <Badge variant="secondary">Server Only</Badge>
                </CardTitle>
                <CardDescription>
                  リクエストヘッダーを読み取るWeb API互換関数
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={demonstrateHeaders}>
                  Headers APIをテスト
                </Button>
                {headersResult && (
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {headersResult}
                    </pre>
                  </div>
                )}
                <div className="space-y-4">
                  <pre className="bg-muted p-4 rounded-lg text-sm">
                    <code>{`// Server Component or API Route
import { headers } from 'next/headers';

export default async function Page() {
  const headersList = headers();
  const userAgent = headersList.get('user-agent');
  const authorization = headersList.get('authorization');

  return (
    <div>
      <p>User Agent: {userAgent}</p>
      <p>Authorization: {authorization}</p>
    </div>
  );
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  cookies()
                  <Badge variant="secondary">Server Only</Badge>
                </CardTitle>
                <CardDescription>
                  Cookieの読み書きを行うWeb API互換関数
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={demonstrateCookies}>
                  Cookies APIをテスト
                </Button>
                {cookiesResult && (
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {cookiesResult}
                    </pre>
                  </div>
                )}
                <div className="space-y-4">
                  <pre className="bg-muted p-4 rounded-lg text-sm">
                    <code>{`// Server Component
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme');
  const sessionId = cookieStore.get('session');

  return (
    <div>
      <p>Theme: {theme?.value}</p>
      <p>Session: {sessionId?.value}</p>
    </div>
  );
}

// API Route
export async function POST() {
  const cookieStore = cookies();

  // Cookieの設定
  cookieStore.set('theme', 'dark', {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  return Response.json({ success: true });
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  redirect()
                  <Badge variant="secondary">Server Only</Badge>
                </CardTitle>
                <CardDescription>
                  プログラム的にリダイレクトを実行する関数
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={demonstrateRedirect}>Redirect例を表示</Button>
                {redirectResult && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{redirectResult}</p>
                  </div>
                )}
                <div className="space-y-4">
                  <pre className="bg-muted p-4 rounded-lg text-sm">
                    <code>{`// Server Component
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = cookies();
  const user = cookieStore.get('user');

  if (!user) {
    redirect('/login');
  }

  return <div>Welcome back!</div>;
}

// Server Action
export async function createPost(formData: FormData) {
  // フォーム処理
  const post = await savePost(formData);

  // リダイレクト
  redirect(\`/posts/\${post.id}\`);
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  URL Constructor
                  <Badge variant="default">Client & Server</Badge>
                </CardTitle>
                <CardDescription>
                  URL解析と操作のためのWeb標準API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={demonstrateURL}>現在のURLを解析</Button>
                {urlResult && (
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm overflow-x-auto">{urlResult}</pre>
                  </div>
                )}
                <div className="space-y-4">
                  <pre className="bg-muted p-4 rounded-lg text-sm">
                    <code>{`// URLの解析と操作
const url = new URL('https://example.com/path?param=value#section');

console.log(url.hostname); // 'example.com'
console.log(url.pathname); // '/path'
console.log(url.search);   // '?param=value'
console.log(url.hash);     // '#section'

// URLSearchParamsの使用
const params = new URLSearchParams(url.search);
params.set('newParam', 'newValue');
params.delete('param');

// 新しいURLの構築
const newUrl = new URL(url);
newUrl.search = params.toString();
console.log(newUrl.href);`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="caching">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>revalidatePath()</CardTitle>
                <CardDescription>
                  特定のパスのキャッシュを再検証する関数
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// Server Action
import { revalidatePath } from 'next/cache';

export async function updateUser(formData: FormData) {
  // ユーザー情報の更新
  await updateUserInDatabase(formData);

  // 特定のパスのキャッシュを無効化
  revalidatePath('/users');
  revalidatePath('/profile');

  // 動的ルートの場合
  revalidatePath('/users/[id]', 'page');

  // レイアウトを含む場合
  revalidatePath('/dashboard', 'layout');
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>revalidateTag()</CardTitle>
                <CardDescription>
                  タグでグループ化されたキャッシュを再検証する関数
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// Server Action
import { revalidateTag } from 'next/cache';

export async function updatePost(id: string, formData: FormData) {
  // 投稿の更新
  await updatePostInDatabase(id, formData);

  // タグベースのキャッシュ無効化
  revalidateTag('posts');
  revalidateTag(\`post-\${id}\`);
}

// データフェッチ時のタグ付け
async function getPosts() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  });
  return posts.json();
}

async function getPost(id: string) {
  const post = await fetch(\`https://api.example.com/posts/\${id}\`, {
    next: { tags: ['posts', \`post-\${id}\`] }
  });
  return post.json();
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>unstable_cache()</CardTitle>
                <CardDescription>
                  関数の結果をキャッシュするユーティリティ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`import { unstable_cache } from 'next/cache';

// 重い計算をキャッシュ
const getCachedData = unstable_cache(
  async (userId: string) => {
    const data = await expensiveDataFetch(userId);
    return data;
  },
  ['user-data'], // キーの配列
  {
    tags: ['user'],
    revalidate: 3600, // 1時間後に再検証
  }
);

// 使用例
export default async function UserProfile({ userId }: { userId: string }) {
  const userData = await getCachedData(userId);

  return (
    <div>
      <h1>{userData.name}</h1>
      <p>{userData.email}</p>
    </div>
  );
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metadata">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>generateMetadata()</CardTitle>
                <CardDescription>
                  動的にメタデータを生成する関数
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`import type { Metadata } from 'next';

// 静的メタデータ
export const metadata: Metadata = {
  title: 'My App',
  description: 'This is my app',
};

// 動的メタデータ
export async function generateMetadata(
  { params, searchParams }: {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
  }
): Promise<Metadata> {
  // データの取得
  const post = await getPost(params.id);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>generateStaticParams()</CardTitle>
                <CardDescription>
                  静的生成のためのパラメータを生成する関数
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// 複数のパラメータの場合
// app/categories/[category]/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const categories = await getCategories();

  const params = [];

  for (const category of categories) {
    const posts = await getPostsByCategory(category.slug);

    for (const post of posts) {
      params.push({
        category: category.slug,
        slug: post.slug,
      });
    }
  }

  return params;
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Route の例</CardTitle>
                <CardDescription>
                  Next.js 15のAPI Routesの実装例
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const headersList = headers();
  const cookieStore = cookies();

  // URLパラメータの取得
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  // 認証チェック
  const authorization = headersList.get('authorization');
  if (!authorization) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // データの取得
  const users = await getUsers(parseInt(page));

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // バリデーション
  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: 'Name and email are required' },
      { status: 400 }
    );
  }

  // ユーザーの作成
  const user = await createUser(body);

  // Cookieの設定
  const response = NextResponse.json(user, { status: 201 });
  response.cookies.set('lastCreated', user.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Server Action の例</CardTitle>
                <CardDescription>
                  フォーム処理のためのServer Action実装例
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// app/actions.ts
"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function createPost(formData: FormData) {
  // 認証チェック
  const cookieStore = cookies();
  const session = cookieStore.get('session');

  if (!session) {
    redirect('/login');
  }

  // フォームデータの取得
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // バリデーション
  if (!title || !content) {
    return { error: 'Title and content are required' };
  }

  try {
    // 投稿の作成
    const post = await savePost({
      title,
      content,
      userId: session.value,
    });

    // キャッシュの無効化
    revalidatePath('/posts');
    revalidatePath('/dashboard');

    // 成功時のリダイレクト
    redirect(\`/posts/\${post.id}\`);
  } catch (error) {
    return { error: 'Failed to create post' };
  }
}

export async function deletePost(postId: string) {
  const cookieStore = cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    await removePost(postId);
    revalidatePath('/posts');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete post' };
  }
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Middleware の例</CardTitle>
                <CardDescription>
                  リクエストの前処理を行うMiddleware実装例
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // パスに基づく処理
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 管理者認証のチェック
    const token = request.cookies.get('admin-token');

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // APIレート制限
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || 'unknown';
    const rateLimitKey = \`rate-limit-\${ip}\`;

    // レート制限の実装（実際にはRedisなどを使用）
    const requestCount = getRequestCount(rateLimitKey);

    if (requestCount > 100) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
  }

  // 地域に基づくリダイレクト
  const country = request.geo?.country || 'US';

  if (country === 'CN' && !request.nextUrl.pathname.startsWith('/cn')) {
    return NextResponse.redirect(new URL('/cn', request.url));
  }

  // レスポンスヘッダーの設定
  const response = NextResponse.next();

  response.headers.set('X-Country', country);
  response.headers.set('X-Pathname', request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Next.js Functions の主な特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Web API互換</strong>: 標準のWeb APIに準拠した設計
            </li>
            <li>
              <strong>型安全性</strong>: TypeScriptで完全に型付けされた関数
            </li>
            <li>
              <strong>Server Components対応</strong>: React Server
              Componentsで使用可能
            </li>
            <li>
              <strong>キャッシュ制御</strong>: 柔軟なキャッシュ戦略をサポート
            </li>
            <li>
              <strong>エッジランタイム</strong>: Vercel Edgeでも動作
            </li>
            <li>
              <strong>プログレッシブエンハンスメント</strong>:
              JavaScriptなしでも基本機能が動作
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
