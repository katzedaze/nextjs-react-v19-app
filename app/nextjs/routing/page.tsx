import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function RoutingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">App Router ルーティング</h1>
        <p className="text-muted-foreground">
          Next.js App
          Routerは、ファイルベースのルーティングシステムを使用します。
          フォルダ構造がそのままURLの構造となり、直感的なルーティングが可能です。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的なルーティング</CardTitle>
          <CardDescription>
            アプリケーションディレクトリ内のフォルダがルートになります
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`app/
├── page.tsx          → /
├── about/
│   └── page.tsx      → /about
├── blog/
│   ├── page.tsx      → /blog
│   └── [slug]/
│       └── page.tsx  → /blog/[slug]
└── dashboard/
    ├── page.tsx      → /dashboard
    └── settings/
        └── page.tsx  → /dashboard/settings`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="navigation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="navigation">ナビゲーション</TabsTrigger>
          <TabsTrigger value="segments">ルートセグメント</TabsTrigger>
          <TabsTrigger value="layouts">レイアウト</TabsTrigger>
          <TabsTrigger value="loading">Loading UI</TabsTrigger>
        </TabsList>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>Linkコンポーネント</CardTitle>
              <CardDescription>
                クライアントサイドナビゲーションを実現
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <Button asChild>
                  <Link href="/">ホーム</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard">ダッシュボード</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/profile">プロフィール</Link>
                </Button>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`import Link from "next/link";

// 基本的な使い方
<Link href="/about">About</Link>

// 動的ルート
<Link href={\`/blog/\${post.slug}\`}>
  {post.title}
</Link>

// クエリパラメータ付き
<Link
  href={{
    pathname: '/search',
    query: { q: 'nextjs' }
  }}
>
  検索
</Link>`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>特殊なファイル名</CardTitle>
              <CardDescription>
                App Routerで使用される特別なファイル
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <code className="font-mono font-bold">page.tsx</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    ルートのUIを定義。このファイルが存在するとルートがアクセス可能になる
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <code className="font-mono font-bold">layout.tsx</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    共有UIを定義。子ルートをラップし、状態を保持
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <code className="font-mono font-bold">loading.tsx</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    読み込み中のUIを定義。自動的にサスペンス境界を作成
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <code className="font-mono font-bold">error.tsx</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    エラー処理UIを定義。エラー境界として機能
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <code className="font-mono font-bold">not-found.tsx</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    404エラーページをカスタマイズ
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layouts">
          <Card>
            <CardHeader>
              <CardTitle>レイアウトの入れ子</CardTitle>
              <CardDescription>
                レイアウトは自動的に入れ子になります
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <nav>グローバルナビゲーション</nav>
        {children}
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside>サイドバー</aside>
      <main>{children}</main>
    </div>
  );
}`}</code>
              </pre>
              <p className="text-sm text-muted-foreground">
                各レベルのレイアウトは自動的に組み合わされ、
                ページコンポーネントをラップします。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loading">
          <Card>
            <CardHeader>
              <CardTitle>ローディング状態</CardTitle>
              <CardDescription>
                loading.tsxで即座にローディングUIを表示
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    </div>
  );
}

// loading.tsxは自動的にSuspenseでラップされます
// <Suspense fallback={<Loading />}>
//   <Page />
// </Suspense>`}</code>
              </pre>
              <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>App Routerの利点</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>サーバーコンポーネントがデフォルト - パフォーマンスの向上</li>
            <li>入れ子のレイアウト - 共通UIの効率的な管理</li>
            <li>並列ルート - 同じレイアウト内で複数のページを表示</li>
            <li>インターセプトルート - モーダルなどの高度なルーティング</li>
            <li>ストリーミング - 段階的なレンダリングでUXを向上</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
