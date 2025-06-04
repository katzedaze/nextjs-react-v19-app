import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">
          React v19 Hooks デモンストレーション
        </h1>
        <p className="text-lg text-muted-foreground">
          React
          v19で新しく追加されたHooksと既存のHooksのサンプルコードを提供します。
          左のナビゲーションから各Hookのページにアクセスしてください。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              新しいHooks
              <Badge variant="default">v19</Badge>
            </CardTitle>
            <CardDescription>React v19で新しく追加されたHooks</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                  use
                </code>
                - リソースの読み取りとサスペンド
              </li>
              <li>
                <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                  useActionState
                </code>
                - アクションの状態管理
              </li>
              <li>
                <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                  useOptimistic
                </code>
                - 楽観的UI更新
              </li>
              <li>
                <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                  useFormStatus
                </code>
                - フォームの状態取得
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>既存のHooks</CardTitle>
            <CardDescription>
              React v19でも利用可能な主要なHooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                  useState
                </code>
                - コンポーネントの状態管理
              </li>
              <li>
                <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                  useEffect
                </code>
                - 副作用の実行
              </li>
              <li>
                <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                  useTransition
                </code>
                - 非同期トランジション
              </li>
              <li>
                <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                  useDeferredValue
                </code>
                - 値の遅延更新
              </li>
              <li>その他多数...</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>フォームライブラリ</CardTitle>
            <CardDescription>
              React v19と組み合わせて使用できるフォームライブラリ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                  React Hook Form
                </code>
                - 高パフォーマンスなフォームライブラリ
              </li>
              <li>
                <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                  Conform
                </code>
                - Web標準に基づくプログレッシブエンハンスメント
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使い方</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              左のナビゲーションメニューから各Hookやフォームライブラリのページにアクセスし、サンプルコードを確認してください。
              各ページでは、説明、使用方法、実際に動作するサンプルコードを提供しています。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
