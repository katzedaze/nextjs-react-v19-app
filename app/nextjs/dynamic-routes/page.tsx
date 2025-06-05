import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function DynamicRoutesPage() {
  const products = [
    { id: "1", name: "Next.js T-shirt", category: "clothing" },
    { id: "2", name: "React Hoodie", category: "clothing" },
    { id: "3", name: "TypeScript Mug", category: "accessories" },
  ];

  const posts = [
    {
      slug: "intro-to-nextjs",
      title: "Next.js入門",
      tags: ["nextjs", "react"],
    },
    {
      slug: "typescript-tips",
      title: "TypeScriptのTips",
      tags: ["typescript"],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">動的ルーティング</h1>
        <p className="text-muted-foreground">
          動的セグメントを使用して、動的なルートを作成できます。 角括弧{" "}
          <code>[param]</code> を使用してパラメータを定義します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>動的セグメントの種類</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <code className="font-mono font-bold">[id]</code>
              <p className="text-sm text-muted-foreground mt-1">
                単一の動的セグメント → /product/123
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <code className="font-mono font-bold">[...slug]</code>
              <p className="text-sm text-muted-foreground mt-1">
                キャッチオールセグメント → /blog/2024/01/title
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <code className="font-mono font-bold">[[...slug]]</code>
              <p className="text-sm text-muted-foreground mt-1">
                オプショナルキャッチオール → /blog または /blog/2024/01
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">単一パラメータ</TabsTrigger>
          <TabsTrigger value="multiple">複数パラメータ</TabsTrigger>
          <TabsTrigger value="catchall">キャッチオール</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>単一の動的セグメント</CardTitle>
              <CardDescription>
                商品詳細ページなどでよく使用されるパターン
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">商品リスト</h4>
                <div className="grid gap-2">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="p-3 border rounded-lg hover:bg-muted transition-colors flex justify-between items-center"
                    >
                      <span>{product.name}</span>
                      <Badge variant="secondary">{product.category}</Badge>
                    </Link>
                  ))}
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/product/[id]/page.tsx
export default function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  return <h1>商品ID: {params.id}</h1>;
}

// 静的生成のためのパラメータ生成
export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    id: product.id,
  }));
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multiple">
          <Card>
            <CardHeader>
              <CardTitle>複数の動的セグメント</CardTitle>
              <CardDescription>
                カテゴリと商品IDなど、複数のパラメータを組み合わせる
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">カテゴリ別商品</h4>
                <div className="grid gap-2">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.category}/${product.id}`}
                      className="p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="text-sm text-muted-foreground">
                        /shop/{product.category}/{product.id}
                      </span>
                      <p className="font-medium mt-1">{product.name}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/shop/[category]/[id]/page.tsx
export default function ProductPage({
  params,
}: {
  params: { category: string; id: string }
}) {
  return (
    <div>
      <p>カテゴリ: {params.category}</p>
      <p>商品ID: {params.id}</p>
    </div>
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catchall">
          <Card>
            <CardHeader>
              <CardTitle>キャッチオールルート</CardTitle>
              <CardDescription>
                可変長のパスセグメントをキャプチャ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">ブログ記事</h4>
                <div className="grid gap-2">
                  {posts.map((post) => (
                    <div key={post.slug} className="space-y-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="p-3 border rounded-lg hover:bg-muted transition-colors block"
                      >
                        <p className="font-medium">{post.title}</p>
                        <div className="flex gap-1 mt-2">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </Link>
                      <div className="ml-4 space-y-1">
                        <Link
                          href={`/blog/2024/${post.slug}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          → /blog/2024/{post.slug}
                        </Link>
                        <Link
                          href={`/blog/2024/01/${post.slug}`}
                          className="text-sm text-muted-foreground hover:text-foreground block"
                        >
                          → /blog/2024/01/{post.slug}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// app/blog/[...slug]/page.tsx
export default function BlogPost({
  params,
}: {
  params: { slug: string[] }
}) {
  // slug は配列として渡される
  // /blog/2024/01/my-post → ["2024", "01", "my-post"]

  return (
    <article>
      <h1>{params.slug.join(' / ')}</h1>
    </article>
  );
}

// オプショナルキャッチオール [[...slug]]
// /blog → slug は undefined
// /blog/post → slug は ["post"]`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>動的ルートのベストプラクティス</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <code>generateStaticParams</code> を使用して、ビルド時に静的生成
            </li>
            <li>型安全性のために、パラメータの型を明示的に定義</li>
            <li>動的インポートと組み合わせて、コード分割を最適化</li>
            <li>
              <code>notFound()</code> 関数で、無効なパラメータを適切に処理
            </li>
            <li>SEOのために、動的なメタデータを生成</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
