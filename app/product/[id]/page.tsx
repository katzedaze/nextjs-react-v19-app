import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// 仮の商品データ
const products = [
  {
    id: "1",
    name: "Next.js T-shirt",
    category: "clothing",
    price: 3500,
    description:
      "高品質なコットン100%のNext.jsロゴ入りTシャツ。開発者のための快適な一着。",
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
  },
  {
    id: "2",
    name: "React Hoodie",
    category: "clothing",
    price: 5500,
    description:
      "暖かくて快適なReactロゴ入りパーカー。寒い日のコーディングに最適。",
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
  },
  {
    id: "3",
    name: "TypeScript Mug",
    category: "accessories",
    price: 1500,
    description:
      "TypeScriptロゴ入りのセラミックマグカップ。型安全なコーヒータイムを。",
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop&crop=center",
  },
];

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/nextjs/dynamic-routes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold mt-4">
              ¥{product.price.toLocaleString()}
            </p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">商品情報</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">商品ID</dt>
                  <dd className="font-mono">{product.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">カテゴリ</dt>
                  <dd>{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">在庫</dt>
                  <dd>{product.stock}個</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-4 w-4" />
              カートに追加
            </Button>
            <Button variant="outline" className="w-full">
              お気に入りに追加
            </Button>
          </div>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>動的ルートの実装詳細</CardTitle>
          <CardDescription>
            このページは /product/[id]/page.tsx として実装されています
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// app/product/[id]/page.tsx
export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // パラメータからIDを取得
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound(); // 404ページを表示
  }

  return <div>...</div>;
}

// 静的生成のためのパラメータ
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}`}</code>
          </pre>
          <p className="text-sm text-muted-foreground mt-4">
            現在のURL: /product/{id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
