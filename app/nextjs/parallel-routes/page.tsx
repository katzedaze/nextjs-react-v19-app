import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon } from "lucide-react";

export default function ParallelRoutesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">並列ルート</h1>
        <p className="text-muted-foreground">
          並列ルートを使用すると、同じレイアウト内で複数のページを同時にレンダリングできます。
          <code>@folder</code>{" "}
          構文を使用して定義し、条件付きレンダリングやモーダルの実装に最適です。
        </p>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>並列ルートの特徴</AlertTitle>
        <AlertDescription>
          並列ルートは独立したエラーとローディング状態を持ち、
          個別にストリーミングされるため、優れたユーザー体験を提供します。
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>並列ルートの構文</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`app/
├── layout.tsx
├── @analytics/
│   ├── page.tsx
│   └── loading.tsx
├── @team/
│   ├── page.tsx
│   └── error.tsx
└── page.tsx

// layout.tsxで並列ルートを受け取る
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2 gap-4">
        {analytics}
        {team}
      </div>
    </div>
  );
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">ダッシュボード</TabsTrigger>
          <TabsTrigger value="modal">モーダル実装</TabsTrigger>
          <TabsTrigger value="conditional">条件付き表示</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>ダッシュボードレイアウト</CardTitle>
              <CardDescription>複数のウィジェットを並列で表示</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">@metrics</h3>
                  <div className="h-32 bg-muted rounded flex items-center justify-center">
                    <p className="text-muted-foreground">売上メトリクス</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">@notifications</h3>
                  <div className="h-32 bg-muted rounded flex items-center justify-center">
                    <p className="text-muted-foreground">通知パネル</p>
                  </div>
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  metrics,
  notifications,
}: {
  children: React.ReactNode;
  metrics: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <h1>ダッシュボード</h1>
      {children}
      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<MetricsSkeleton />}>
          {metrics}
        </Suspense>
        <Suspense fallback={<NotificationsSkeleton />}>
          {notifications}
        </Suspense>
      </div>
    </div>
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modal">
          <Card>
            <CardHeader>
              <CardTitle>インターセプトルートと組み合わせたモーダル</CardTitle>
              <CardDescription>URLベースのモーダル実装パターン</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`app/
├── layout.tsx
├── @modal/
│   ├── (.)photo/[id]/
│   │   └── page.tsx    # モーダルとして表示
│   └── default.tsx     # デフォルト（空）
├── photo/[id]/
│   └── page.tsx        # 直接アクセス時のページ
└── page.tsx            # ギャラリー一覧

// app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}

// app/@modal/(.)photo/[id]/page.tsx
export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl">
        <Image src={\`/photos/\${params.id}.jpg\`} />
        <Link href="/">✕ 閉じる</Link>
      </div>
    </div>
  );
}`}</code>
              </pre>

              <Alert>
                <AlertDescription>
                  ギャラリーからクリックするとモーダルとして開き、
                  直接URLにアクセスすると通常のページとして表示されます。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditional">
          <Card>
            <CardHeader>
              <CardTitle>条件付き並列ルート</CardTitle>
              <CardDescription>
                認証状態やユーザー権限に基づく表示制御
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/dashboard/@admin/page.tsx
import { currentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function AdminPanel() {
  const user = await currentUser();

  if (!user?.isAdmin) {
    notFound(); // default.tsxが表示される
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>管理者パネル</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 管理者向けコンテンツ */}
      </CardContent>
    </Card>
  );
}

// app/dashboard/@admin/default.tsx
export default function Default() {
  return null; // 管理者以外には何も表示しない
}

// app/dashboard/layout.tsx
export default function Layout({
  children,
  admin,
  user,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  user: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">{children}</div>
      <div className="space-y-4">
        {user}
        {admin} {/* 条件を満たさない場合は空 */}
      </div>
    </div>
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>並列ルートの重要な概念</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">default.tsx</h4>
              <p className="text-sm text-muted-foreground mt-1">
                並列ルートがマッチしない場合のフォールバック。
                ソフトナビゲーション時に重要。
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">独立したエラー境界</h4>
              <p className="text-sm text-muted-foreground mt-1">
                各並列ルートは独自のerror.tsxを持ち、
                エラーが他の部分に影響しない。
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">ストリーミング</h4>
              <p className="text-sm text-muted-foreground mt-1">
                各スロットは独立してストリーミングされ、
                段階的なレンダリングが可能。
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">URLの独立性</h4>
              <p className="text-sm text-muted-foreground mt-1">
                並列ルートはURLパスに影響を与えず、
                レイアウト内での表示制御に使用。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
