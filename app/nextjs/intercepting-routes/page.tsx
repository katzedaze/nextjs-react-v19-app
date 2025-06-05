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
import { InfoIcon } from "lucide-react";

export default function InterceptingRoutesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">インターセプトルート</h1>
        <p className="text-muted-foreground">
          インターセプトルートを使用すると、現在のレイアウトを維持しながら、
          別のルートのコンテンツを表示できます。モーダルやプレビューの実装に最適です。
        </p>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>インターセプトルートの利点</AlertTitle>
        <AlertDescription>
          URLは変更されるため、共有可能でSEOフレンドリーな状態を保ちながら、
          優れたユーザー体験を提供できます。
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>インターセプトルートの構文</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <code className="font-mono font-bold">(.) </code>
              <Badge variant="secondary" className="ml-2">
                同じレベル
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                同じディレクトリレベルのセグメントをインターセプト
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <code className="font-mono font-bold">(..) </code>
              <Badge variant="secondary" className="ml-2">
                1つ上のレベル
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                1つ上のディレクトリレベルのセグメントをインターセプト
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <code className="font-mono font-bold">(...) </code>
              <Badge variant="secondary" className="ml-2">
                ルートから
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                ルートディレクトリからのセグメントをインターセプト
              </p>
            </div>
          </div>

          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`app/
├── feed/
│   ├── page.tsx              # フィード一覧
│   └── (.)photo/[id]/        # インターセプト
│       └── page.tsx          # モーダル表示
├── photo/[id]/
│   └── page.tsx              # 直接アクセス時の詳細ページ
└── layout.tsx`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="photo-modal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="photo-modal">フォトギャラリー</TabsTrigger>
          <TabsTrigger value="product-preview">商品プレビュー</TabsTrigger>
          <TabsTrigger value="login-modal">ログインモーダル</TabsTrigger>
        </TabsList>

        <TabsContent value="photo-modal">
          <Card>
            <CardHeader>
              <CardTitle>フォトギャラリーのモーダル実装</CardTitle>
              <CardDescription>
                ギャラリーからクリックでモーダル、URLで直接アクセス可能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/gallery/page.tsx
import Link from 'next/link';

export default function Gallery() {
  const photos = getPhotos();

  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map((photo) => (
        <Link
          key={photo.id}
          href={\`/photo/\${photo.id}\`}
          className="hover:opacity-80 transition"
        >
          <img src={photo.thumbnail} alt={photo.alt} />
        </Link>
      ))}
    </div>
  );
}

// app/gallery/(.)photo/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function PhotoModal({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={() => router.back()}
    >
      <div
        className="relative max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={\`/photos/\${params.id}/full.jpg\`}
          className="max-w-full max-h-full"
        />
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// app/photo/[id]/page.tsx
export default function PhotoPage({
  params,
}: {
  params: { id: string };
}) {
  const photo = getPhoto(params.id);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <img src={photo.url} alt={photo.alt} />
      <h1 className="text-2xl font-bold mt-4">{photo.title}</h1>
      <p className="text-muted-foreground">{photo.description}</p>
    </div>
  );
}`}</code>
              </pre>

              <div className="grid grid-cols-3 gap-2 p-4 bg-muted rounded-lg">
                <div className="aspect-square bg-gray-300 rounded cursor-pointer hover:opacity-80 transition" />
                <div className="aspect-square bg-gray-300 rounded cursor-pointer hover:opacity-80 transition" />
                <div className="aspect-square bg-gray-300 rounded cursor-pointer hover:opacity-80 transition" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product-preview">
          <Card>
            <CardHeader>
              <CardTitle>商品クイックビュー</CardTitle>
              <CardDescription>
                商品一覧から素早くプレビュー、購入はフルページで
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/shop/(.)product/[id]/page.tsx
export default function ProductQuickView({
  params,
}: {
  params: { id: string };
}) {
  const product = getProduct(params.id);

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-2xl font-bold mt-2">¥{product.price}</p>

          <div className="mt-4 space-y-2">
            <Button className="w-full">カートに追加</Button>
            <Link
              href={\`/product/\${params.id}\`}
              className="block text-center text-sm"
            >
              詳細を見る →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}`}</code>
              </pre>

              <Alert>
                <AlertDescription>
                  インターセプトルートでは簡易情報のみ表示し、
                  詳細な情報や購入プロセスは通常のページで処理します。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login-modal">
          <Card>
            <CardHeader>
              <CardTitle>条件付きログインモーダル</CardTitle>
              <CardDescription>
                保護されたルートへのアクセス時にログインを促す
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/(auth)/(.)login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">ログイン</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // ログイン処理
            const result = await signIn('credentials', {
              redirect: false,
              // ...
            });

            if (result?.ok) {
              router.refresh();
              router.back();
            }
          }}
        >
          <Input type="email" placeholder="メールアドレス" />
          <Input type="password" placeholder="パスワード" />
          <Button type="submit" className="w-full">
            ログイン
          </Button>
        </form>

        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-muted-foreground"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}

// middleware.ts でログインが必要なルートを保護
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>インターセプトルートのベストプラクティス</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">並列ルートとの組み合わせ</h4>
              <p className="text-sm text-muted-foreground mt-1">
                @modalスロットと組み合わせることで、レイアウトを維持したままモーダルを表示
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">フォールバックの実装</h4>
              <p className="text-sm text-muted-foreground mt-1">
                JavaScriptが無効な環境でも、通常のページとして機能するよう設計
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">パフォーマンスの考慮</h4>
              <p className="text-sm text-muted-foreground mt-1">
                インターセプトルートでは軽量なコンテンツのみ表示し、詳細は通常ページで
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">アクセシビリティ</h4>
              <p className="text-sm text-muted-foreground mt-1">
                適切なフォーカス管理とキーボードナビゲーションを実装
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
