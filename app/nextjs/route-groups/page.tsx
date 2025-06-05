import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RouteGroupsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">ルートグループ</h1>
        <p className="text-muted-foreground">
          ルートグループを使用すると、URLパスに影響を与えずにルートを整理できます。
          フォルダ名を括弧 <code>(folder)</code> で囲むことで作成します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ルートグループの用途</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>関連するルートを論理的にグループ化</li>
            <li>異なるレイアウトを適用</li>
            <li>認証状態による分岐</li>
            <li>機能別の整理</li>
            <li>チーム別のコード管理</li>
          </ul>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">基本構造</TabsTrigger>
          <TabsTrigger value="auth">認証パターン</TabsTrigger>
          <TabsTrigger value="marketing">マーケティングサイト</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>基本的なルートグループ</CardTitle>
              <CardDescription>
                URLに影響を与えない論理的なグループ化
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`app/
├── (marketing)/
│   ├── layout.tsx      # マーケティング用レイアウト
│   ├── page.tsx        → /
│   ├── about/
│   │   └── page.tsx    → /about
│   └── pricing/
│       └── page.tsx    → /pricing
├── (shop)/
│   ├── layout.tsx      # ショップ用レイアウト
│   ├── products/
│   │   └── page.tsx    → /products
│   └── cart/
│       └── page.tsx    → /cart
└── (admin)/
    ├── layout.tsx      # 管理画面用レイアウト
    ├── dashboard/
    │   └── page.tsx    → /dashboard
    └── users/
        └── page.tsx    → /users`}</code>
              </pre>

              <Alert>
                <AlertDescription>
                  括弧で囲まれたフォルダ名はURLパスに含まれません。
                  これにより、異なるレイアウトや機能を持つセクションを作成できます。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>認証ベースのグループ化</CardTitle>
              <CardDescription>
                認証状態に応じて異なるレイアウトを適用
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/(authenticated)/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100">
        <nav>
          {/* 認証済みユーザー用のナビゲーション */}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

// app/(public)/layout.tsx
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>
        {/* 公開ページ用のヘッダー */}
      </header>
      {children}
    </div>
  );
}`}</code>
              </pre>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">フォルダ構造</h4>
                <pre className="text-sm">
                  <code>{`app/
├── (authenticated)/
│   ├── layout.tsx
│   ├── dashboard/
│   ├── profile/
│   └── settings/
└── (public)/
    ├── layout.tsx
    ├── page.tsx
    ├── auth/
    └── about/`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <CardTitle>マルチサイト構成</CardTitle>
              <CardDescription>
                複数のサイトを1つのコードベースで管理
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// 異なるドメインやサブドメインで異なるグループを表示
app/
├── (marketing)/
│   ├── layout.tsx    # マーケティングサイトのデザイン
│   ├── page.tsx      # ランディングページ
│   ├── features/
│   ├── pricing/
│   └── blog/
├── (app)/
│   ├── layout.tsx    # アプリケーションUI
│   ├── dashboard/
│   ├── projects/
│   └── settings/
└── (docs)/
    ├── layout.tsx    # ドキュメントサイトのデザイン
    ├── getting-started/
    ├── api-reference/
    └── guides/

// 各グループで異なるスタイルやナビゲーションを適用
// middleware.tsでドメインに基づいてルーティング`}</code>
              </pre>

              <div className="grid gap-4 mt-4">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">marketing.example.com</p>
                  <p className="text-sm text-muted-foreground">
                    (marketing)グループのルートを表示
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">app.example.com</p>
                  <p className="text-sm text-muted-foreground">
                    (app)グループのルートを表示
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">docs.example.com</p>
                  <p className="text-sm text-muted-foreground">
                    (docs)グループのルートを表示
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>ルートグループのベストプラクティス</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">明確な命名規則</h4>
              <p className="text-sm text-muted-foreground mt-1">
                グループの目的が一目でわかる名前を使用（例：(auth)、(public)、(admin)）
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">レイアウトの活用</h4>
              <p className="text-sm text-muted-foreground mt-1">
                各グループに専用のlayout.tsxを作成し、共通UIを効率的に管理
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">ミドルウェアとの連携</h4>
              <p className="text-sm text-muted-foreground mt-1">
                middleware.tsと組み合わせて、認証やリダイレクトを制御
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">過度な入れ子を避ける</h4>
              <p className="text-sm text-muted-foreground mt-1">
                グループの入れ子は最小限に抑え、シンプルな構造を維持
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
