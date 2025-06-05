import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// 仮のブログデータ
const blogPosts = [
  {
    slug: "intro-to-nextjs",
    title: "Next.js入門",
    content: `
Next.jsは、Reactベースのフルスタックフレームワークです。

## 主な特徴

- **サーバーサイドレンダリング (SSR)**
- **静的サイト生成 (SSG)**
- **ファイルベースルーティング**
- **API Routes**
- **画像最適化**

## 始め方

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

これでNext.jsアプリケーションの開発を始めることができます。
    `,
    tags: ["nextjs", "react"],
    author: "開発者太郎",
    publishedAt: "2024-01-15",
    readTime: "5分",
  },
  {
    slug: "typescript-tips",
    title: "TypeScriptのTips",
    content: `
TypeScriptを使う上で便利なTipsをご紹介します。

## 型定義のコツ

### Union Types
\`\`\`typescript
type Status = 'loading' | 'success' | 'error';
\`\`\`

### Generic Types
\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
}
\`\`\`

## 実用的なユーティリティ型

- **Partial<T>**: すべてのプロパティをオプショナルに
- **Required<T>**: すべてのプロパティを必須に
- **Pick<T, K>**: 特定のプロパティのみを選択
- **Omit<T, K>**: 特定のプロパティを除外

これらの型を使いこなすことで、より安全なコードが書けます。
    `,
    tags: ["typescript"],
    author: "型安全太郎",
    publishedAt: "2024-01-20",
    readTime: "8分",
  },
];

// 年月ベースの記事マッピング
const getPostBySlug = (slugArray: string[]) => {
  if (slugArray.length === 1) {
    // /blog/intro-to-nextjs のような形式
    return blogPosts.find((post) => post.slug === slugArray[0]);
  } else if (slugArray.length === 3) {
    // /blog/2024/01/intro-to-nextjs のような形式
    const [year, month, slug] = slugArray;
    const post = blogPosts.find((p) => p.slug === slug);

    // 日付の検証
    if (post) {
      const [postYear, postMonth] = post.publishedAt.split("-");
      if (postYear === year && postMonth === month) {
        return post;
      }
    }
  }

  return null;
};

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const paths: { slug: string[] }[] = [];

  // 基本パス
  blogPosts.forEach((post) => {
    paths.push({ slug: [post.slug] });
  });

  // 年月パス
  blogPosts.forEach((post) => {
    const [year, month] = post.publishedAt.split("-");
    paths.push({ slug: [year, month, post.slug] });
  });

  return paths;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/nextjs/dynamic-routes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Link>
      </Button>

      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl font-bold">{post.title}</h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          {post.content.split("\n").map((line, index) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                  {line.replace("## ", "")}
                </h2>
              );
            } else if (line.startsWith("### ")) {
              return (
                <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
                  {line.replace("### ", "")}
                </h3>
              );
            } else if (line.startsWith("```")) {
              const nextLines = post.content.split("\n").slice(index + 1);
              const endIndex = nextLines.findIndex((l) => l.startsWith("```"));
              const codeLines = nextLines.slice(0, endIndex);

              return (
                <pre
                  key={index}
                  className="bg-muted p-4 rounded-lg overflow-x-auto my-4"
                >
                  <code>{codeLines.join("\n")}</code>
                </pre>
              );
            } else if (line.startsWith("- **")) {
              return (
                <li key={index} className="mb-2">
                  <strong>{line.substring(4, line.indexOf("**", 4))}</strong>
                  {line.substring(line.indexOf("**", 4) + 2)}
                </li>
              );
            } else if (line.trim()) {
              return (
                <p key={index} className="mb-4 leading-relaxed">
                  {line}
                </p>
              );
            }
            return null;
          })}
        </div>
      </article>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>キャッチオールルートの実装</CardTitle>
          <CardDescription>
            このページは /blog/[...slug]/page.tsx として実装されています
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">現在のURL構造:</p>
              <code className="bg-muted px-2 py-1 rounded text-sm">
                /blog/{slug.join("/")}
              </code>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">slugパラメータの値:</p>
              <pre className="bg-muted p-3 rounded text-sm">
                {JSON.stringify(slug, null, 2)}
              </pre>
            </div>

            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`// app/blog/[...slug]/page.tsx
export default function BlogPostPage({
  params,
}: {
  params: { slug: string[] };
}) {
  // slug は配列として受け取る
  // /blog/intro-to-nextjs → ["intro-to-nextjs"]
  // /blog/2024/01/intro-to-nextjs → ["2024", "01", "intro-to-nextjs"]

  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <article>...</article>;
}

// 可能なパスの組み合わせを生成
export async function generateStaticParams() {
  const paths = [];

  blogPosts.forEach(post => {
    // 基本パス
    paths.push({ slug: [post.slug] });

    // 年月パス
    const [year, month] = post.publishedAt.split('-');
    paths.push({ slug: [year, month, post.slug] });
  });

  return paths;
}`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>サポートされるURL形式</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-muted rounded">
              <code>/blog/intro-to-nextjs</code> - 基本形式
            </div>
            <div className="p-2 bg-muted rounded">
              <code>/blog/2024/01/intro-to-nextjs</code> - 年月付き形式
            </div>
            <div className="p-2 bg-muted rounded">
              <code>/blog/typescript-tips</code> - その他の記事
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
