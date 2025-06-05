import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// 仮の商品データ（カテゴリ別）
const productsByCategory = {
  clothing: [
    {
      id: "1",
      name: "Next.js T-shirt",
      category: "clothing",
      price: 3500,
      description: "高品質なコットン100%のNext.jsロゴ入りTシャツ。",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Navy"],
    },
    {
      id: "2",
      name: "React Hoodie",
      category: "clothing",
      price: 5500,
      description: "暖かくて快適なReactロゴ入りパーカー。",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Gray"],
    },
  ],
  accessories: [
    {
      id: "3",
      name: "TypeScript Mug",
      category: "accessories",
      price: 1500,
      description: "TypeScriptロゴ入りのセラミックマグカップ。",
      capacity: "350ml",
      material: "セラミック",
    },
  ],
};

export async function generateStaticParams() {
  const paths = [];

  for (const [category, products] of Object.entries(productsByCategory)) {
    for (const product of products) {
      paths.push({
        category,
        id: product.id,
      });
    }
  }

  return paths;
}

export default function ShopProductPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const { category, id } = params;

  // カテゴリの存在確認
  if (!productsByCategory[category as keyof typeof productsByCategory]) {
    notFound();
  }

  const products =
    productsByCategory[category as keyof typeof productsByCategory];
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="ghost">
          <Link href="/nextjs/dynamic-routes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        <Badge variant="outline">{category}</Badge>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-muted-foreground">{id}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          <Package className="h-24 w-24 text-muted-foreground" />
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

          {/* カテゴリ固有の属性 */}
          {category === "clothing" && "sizes" in product && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">サイズ・カラー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">サイズ</p>
                    <div className="flex gap-2">
                      {product.sizes.map((size) => (
                        <Button key={size} variant="outline" size="sm">
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">カラー</p>
                    <div className="flex gap-2">
                      {product.colors.map((color) => (
                        <Button key={color} variant="outline" size="sm">
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {category === "accessories" && "capacity" in product && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">商品仕様</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">容量</dt>
                    <dd>{product.capacity}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">素材</dt>
                    <dd>{product.material}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}

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
          <CardTitle>複数動的セグメントの実装</CardTitle>
          <CardDescription>
            このページは /shop/[category]/[id]/page.tsx として実装されています
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// app/shop/[category]/[id]/page.tsx
export default function ShopProductPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const { category, id } = params;

  // 両方のパラメータを使用してデータを取得
  const products = productsByCategory[category];
  const product = products?.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <div>...</div>;
}

// 静的生成のため全組み合わせを生成
export async function generateStaticParams() {
  const paths = [];

  for (const [category, products] of Object.entries(productsByCategory)) {
    for (const product of products) {
      paths.push({ category, id: product.id });
    }
  }

  return paths;
}`}</code>
          </pre>
          <p className="text-sm text-muted-foreground mt-4">
            現在のURL: /shop/{params.category}/{params.id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
