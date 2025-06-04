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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

// サンプルコンポーネント：Server Component風の例
function ServerComponentExample() {
  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <h3 className="font-semibold mb-2">Server Component 例</h3>
      <p className="text-sm text-muted-foreground mb-2">
        このコンポーネントは通常サーバーで実行されます（デモのためクライアントで表示）
      </p>
      <ul className="text-sm space-y-1">
        <li>• サーバーサイドでのデータフェッチ</li>
        <li>• SEOに最適化</li>
        <li>• バンドルサイズに含まれない</li>
        <li>• データベースへの直接アクセス可能</li>
      </ul>
    </div>
  );
}

// サンプルコンポーネント：Client Component
function ClientComponentExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3 className="font-semibold mb-2">Client Component 例</h3>
      <p className="text-sm text-muted-foreground mb-4">
        &quot;use
        client&quot;ディレクティブでクライアントコンポーネントとして動作
      </p>
      <div className="space-y-4">
        <div>
          <Label htmlFor="client-input">インタラクティブな入力</Label>
          <Input
            id="client-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="何か入力してください..."
          />
          <p className="text-sm mt-1">入力された文字: {text}</p>
        </div>
        <div>
          <p className="text-sm mb-2">カウンター: {count}</p>
          <div className="space-x-2">
            <Button size="sm" onClick={() => setCount(count - 1)}>
              -
            </Button>
            <Button size="sm" onClick={() => setCount(count + 1)}>
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading コンポーネントの例
function LoadingExample() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
}

// Error Boundary の例
function ErrorExample() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <h3 className="font-semibold text-red-800 mb-2">
          エラーが発生しました
        </h3>
        <p className="text-sm text-red-600 mb-4">
          何らかの問題が発生しました。ページをリロードしてください。
        </p>
        <Button size="sm" variant="outline" onClick={() => setHasError(false)}>
          再試行
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Error Boundary テスト</h3>
      <p className="text-sm text-muted-foreground mb-4">
        エラーをシミュレートしてError Boundaryの動作を確認できます
      </p>
      <Button size="sm" variant="destructive" onClick={() => setHasError(true)}>
        エラーを発生させる
      </Button>
    </div>
  );
}

// Navigation の例
function NavigationExample() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Link コンポーネント</h3>
        <div className="space-x-2">
          <Link href="/" className="text-blue-600 hover:underline">
            ホーム
          </Link>
          <Link
            href="/forms/react-hook-form"
            className="text-blue-600 hover:underline"
          >
            React Hook Form
          </Link>
          <Link href="/forms/conform" className="text-blue-600 hover:underline">
            Conform
          </Link>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">useRouter Hook</h3>
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={() => router.push("/")}>
            ホームに移動
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.back()}>
            戻る
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.refresh()}>
            リフレッシュ
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NextJSComponentsPage() {
  const [showLoading, setShowLoading] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Next.js Components</h1>
        <p className="text-muted-foreground">
          Next.js
          15で提供される組み込みコンポーネントとパターンのサンプルコード集です。
          Server ComponentsとClient
          Componentsの違いや、最適化されたコンポーネントの使用方法を紹介します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next.js Components 概要</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">組み込みコンポーネント</h3>
              <ul className="space-y-1 text-sm">
                <li>• Image - 最適化された画像コンポーネント</li>
                <li>• Link - クライアントサイドナビゲーション</li>
                <li>• Script - スクリプト読み込み最適化</li>
                <li>• Suspense - 非同期コンポーネントのローディング</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">特別なファイル</h3>
              <ul className="space-y-1 text-sm">
                <li>• loading.tsx - ローディングUI</li>
                <li>• error.tsx - エラーハンドリング</li>
                <li>• not-found.tsx - 404ページ</li>
                <li>• layout.tsx - レイアウトコンポーネント</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="components">基本コンポーネント</TabsTrigger>
          <TabsTrigger value="patterns">デザインパターン</TabsTrigger>
          <TabsTrigger value="optimization">最適化</TabsTrigger>
          <TabsTrigger value="examples">実装例</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Server vs Client Components
                  <Badge variant="default">React 18+</Badge>
                </CardTitle>
                <CardDescription>
                  Server ComponentsとClient Componentsの違いを理解する
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <ServerComponentExample />
                  <ClientComponentExample />
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Server Component 実装例</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm">
                    <code>{`// app/posts/page.tsx (Server Component - デフォルト)
import { getPosts } from '@/lib/api';

export default async function PostsPage() {
  // サーバーサイドでデータフェッチ
  const posts = await getPosts();

  return (
    <div>
      <h1>投稿一覧</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}`}</code>
                  </pre>

                  <h4 className="font-semibold">Client Component 実装例</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm">
                    <code>{`// components/SearchForm.tsx
"use client";

import { useState } from 'react';

export default function SearchForm({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="検索..."
      />
      <button type="submit">検索</button>
    </form>
  );
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image コンポーネント</CardTitle>
                <CardDescription>
                  自動最適化される画像コンポーネント
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">最適化された画像</h4>
                    <Image
                      src="/next.svg"
                      alt="Next.js Logo"
                      width={180}
                      height={37}
                      priority
                      className="dark:invert"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      自動でWebP/AVIF変換、遅延読み込み、レスポンシブ対応
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">通常のimg要素</h4>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/vercel.svg"
                      alt="Vercel Logo"
                      width={100}
                      height={24}
                      className="dark:invert"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      最適化なし、手動でのレスポンシブ対応が必要
                    </p>
                  </div>
                </div>

                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// 基本的な使用法
import Image from 'next/image';

export default function MyComponent() {
  return (
    <div>
      {/* 静的画像 */}
      <Image
        src="/hero.jpg"
        alt="Hero Image"
        width={1200}
        height={600}
        priority // LCP対象の場合は priority を設定
      />

      {/* 動的画像 */}
      <Image
        src={user.avatar}
        alt="User Avatar"
        width={100}
        height={100}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
      />

      {/* fill を使用した場合 */}
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Link コンポーネント</CardTitle>
                <CardDescription>
                  高速なクライアントサイドナビゲーション
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NavigationExample />

                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      {/* 基本的なリンク */}
      <Link href="/about">About</Link>

      {/* 動的ルート */}
      <Link href={\`/posts/\${post.slug}\`}>
        {post.title}
      </Link>

      {/* 外部リンク */}
      <Link href="https://nextjs.org" target="_blank">
        Next.js
      </Link>

      {/* prefetch無効化 */}
      <Link href="/heavy-page" prefetch={false}>
        Heavy Page
      </Link>

      {/* カスタムコンポーネントとの組み合わせ */}
      <Link href="/dashboard" className="button">
        <Button>Dashboard</Button>
      </Link>

      {/* スクロール無効化 */}
      <Link href="/page#section" scroll={false}>
        Section Link
      </Link>
    </nav>
  );
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loading UI</CardTitle>
                <CardDescription>
                  非同期処理中のローディング表示パターン
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-x-2">
                  <Button
                    onClick={() => setShowLoading(!showLoading)}
                    variant="outline"
                  >
                    {showLoading ? "ローディングを隠す" : "ローディングを表示"}
                  </Button>
                </div>

                {showLoading && (
                  <Suspense fallback={<LoadingExample />}>
                    <div className="p-4 border rounded-lg">
                      <p>コンテンツが読み込まれました</p>
                    </div>
                  </Suspense>
                )}

                <div className="space-y-4">
                  <h4 className="font-semibold">loading.tsx の例</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm">
                    <code>{`// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  );
}

// Suspense と組み合わせた使用例
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Loading />}>
        <AsyncDataComponent />
      </Suspense>
    </div>
  );
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Handling</CardTitle>
                <CardDescription>
                  エラーハンドリングとError Boundaryパターン
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ErrorExample />

                <div className="space-y-4">
                  <h4 className="font-semibold">error.tsx の例</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm">
                    <code>{`// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>
        Try again
      </button>
    </div>
  );
}

// global-error.tsx (ルートレベルのエラー)
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layout パターン</CardTitle>
                <CardDescription>共通レイアウトの設計パターン</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// app/layout.tsx (Root Layout)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head />
      <body>
        <header>
          <Navigation />
        </header>
        <main>{children}</main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx (Nested Layout)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <aside>
        <DashboardNav />
      </aside>
      <main>
        {children}
      </main>
    </div>
  );
}

// app/dashboard/analytics/layout.tsx (Multiple Layouts)
export default function AnalyticsLayout({
  children,
  chart,
  kpis,
}: {
  children: React.ReactNode;
  chart: React.ReactNode;
  kpis: React.ReactNode;
}) {
  return (
    <div className="analytics-layout">
      <div className="main-content">{children}</div>
      <div className="sidebar">
        <div className="kpis">{kpis}</div>
        <div className="chart">{chart}</div>
      </div>
    </div>
  );
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dynamic Import</CardTitle>
                <CardDescription>
                  コンポーネントの動的インポートとコード分割
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// 動的インポートの例
import dynamic from 'next/dynamic';

// SSRを無効にしたコンポーネント
const Chart = dynamic(() => import('../components/Chart'), {
  ssr: false,
  loading: () => <p>チャートを読み込み中...</p>
});

// 条件付きで読み込むコンポーネント
const AdminPanel = dynamic(() => import('../components/AdminPanel'), {
  loading: () => <div>管理パネルを読み込み中...</div>
});

// 名前付きエクスポートの場合
const SpecificComponent = dynamic(
  () => import('../components/Dashboard').then(mod => ({ default: mod.SpecificComponent }))
);

export default function Page() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div>
      <Chart data={data} />

      {showAdmin && <AdminPanel />}

      <button onClick={() => setShowAdmin(true)}>
        管理パネルを表示
      </button>
    </div>
  );
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Script 最適化</CardTitle>
                <CardDescription>
                  外部スクリプトの最適化された読み込み
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`import Script from 'next/script';

export default function MyApp() {
  return (
    <>
      {/* 最優先で読み込み */}
      <Script
        src="https://example.com/critical-script.js"
        strategy="beforeInteractive"
      />

      {/* ページ読み込み後に非同期で読み込み */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        strategy="afterInteractive"
      />

      {/* アイドル時に読み込み */}
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
      />

      {/* インラインスクリプト */}
      <Script id="google-analytics" strategy="afterInteractive">
        {\`
          window.gtag('config', 'GA_MEASUREMENT_ID');
        \`}
      </Script>

      {/* 読み込み完了時のコールバック */}
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('Script loaded successfully');
        }}
        onError={(e) => {
          console.error('Script failed to load', e);
        }}
      />
    </>
  );
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Font 最適化</CardTitle>
                <CardDescription>
                  Google Fontsの最適化された読み込み
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={inter.className}>
      <body>
        <div className={robotoMono.className}>
          <code>This will be in Roboto Mono</code>
        </div>
        {children}
      </body>
    </html>
  );
}

// ローカルフォントの場合
import localFont from 'next/font/local';

const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
});

export default function MyComponent() {
  return (
    <div className={myFont.className}>
      <p>Local font text</p>
    </div>
  );
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
                <CardTitle>複合的な実装例</CardTitle>
                <CardDescription>
                  実際のプロジェクトで使用される複合的なパターン
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// app/blog/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  featuredImage: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

async function getPost(slug: string): Promise<Post | null> {
  // データベースからの取得をシミュレート
  const res = await fetch(\`https://api.example.com/posts/\${slug}\`, {
    next: { revalidate: 3600 } // 1時間キャッシュ
  });

  if (!res.ok) return null;
  return res.json();
}

async function getRelatedPosts(postId: string) {
  const res = await fetch(\`https://api.example.com/posts/\${postId}/related\`);
  return res.json();
}

// メタデータの動的生成
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      images: [post.featuredImage],
    },
  };
}

// 静的パラメータ生成
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());

  return posts.map((post: Post) => ({
    slug: post.id,
  }));
}

// 関連記事コンポーネント
async function RelatedPosts({ postId }: { postId: string }) {
  const relatedPosts = await getRelatedPosts(postId);

  return (
    <div className="related-posts">
      <h2>関連記事</h2>
      <div className="grid grid-cols-2 gap-4">
        {relatedPosts.map((post: Post) => (
          <Link key={post.id} href={\`/blog/\${post.id}\`}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={300}
                height={200}
                className="rounded"
              />
              <h3 className="mt-2 font-semibold">{post.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// メインコンポーネント
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 mb-6">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <time className="text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
            </time>
          </div>
        </div>

        <Image
          src={post.featuredImage}
          alt={post.title}
          width={800}
          height={400}
          className="rounded-lg"
          priority
        />
      </header>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="mt-12">
        <Suspense fallback={<div>関連記事を読み込み中...</div>}>
          <RelatedPosts postId={post.id} />
        </Suspense>
      </footer>
    </article>
  );
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Next.js Components の主な特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Server Components</strong>:
              サーバーサイドレンダリングによる高いパフォーマンス
            </li>
            <li>
              <strong>自動最適化</strong>:
              画像、フォント、スクリプトの自動最適化
            </li>
            <li>
              <strong>コード分割</strong>: 自動的なコード分割とバンドル最適化
            </li>
            <li>
              <strong>SEO対応</strong>: 検索エンジン最適化された構造
            </li>
            <li>
              <strong>型安全性</strong>: TypeScriptによる完全な型サポート
            </li>
            <li>
              <strong>Web標準準拠</strong>: 標準のWeb APIとの互換性
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
