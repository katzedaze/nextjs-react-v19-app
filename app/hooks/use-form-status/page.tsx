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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

// フォーム送信ボタンコンポーネント
function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <div className="space-y-2">
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {pending ? "送信中..." : "送信"}
      </Button>

      {pending && (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>メソッド: {method}</p>
          <p>アクション: {typeof action === "string" ? action : "現在のURL"}</p>
          {data && (
            <div>
              <p>送信データ:</p>
              <ul className="ml-4">
                {Array.from(data.entries()).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value.toString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// フィールドの状態を表示するコンポーネント
function FieldStatus({ name }: { name: string }) {
  const { pending, data } = useFormStatus();
  const isSubmitted = pending && data?.has(name);

  return (
    <span className="text-xs text-muted-foreground">
      {isSubmitted && "✓ 送信済み"}
    </span>
  );
}

async function handleSubmit(formData: FormData) {
  // 模擬的な非同期処理
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // フォームデータを処理
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  console.log("フォーム送信:", { name, email, message });
}

export default function UseFormStatusPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold">useFormStatus Hook</h1>
          <Badge variant="default">v19</Badge>
        </div>
        <p className="text-muted-foreground">
          <code>useFormStatus</code>{" "}
          は、親フォームの送信状態を取得するための新しいHookです。
          フォーム内の任意のコンポーネントから送信状態にアクセスできます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending ? '送信中...' : '送信'}
    </button>
  );
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>フォーム内の任意のコンポーネントから状態を取得</li>
            <li>送信中の状態（pending）を取得</li>
            <li>送信されたFormDataにアクセス可能</li>
            <li>HTTPメソッドとアクションURLを取得</li>
            <li>フォーム要素の子コンポーネントでのみ使用可能</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>実際のサンプル</CardTitle>
          <CardDescription>
            フォームを送信してuseFormStatusの動作を確認してください（3秒かかります）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name">名前</Label>
                <FieldStatus name="name" />
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="山田太郎"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email">メールアドレス</Label>
                <FieldStatus name="email" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="taro@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="message">メッセージ</Label>
                <FieldStatus name="message" />
              </div>
              <Textarea
                id="message"
                name="message"
                placeholder="お問い合わせ内容を入力してください"
                rows={4}
                required
              />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>返り値の詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">pending</h4>
              <p className="text-sm text-muted-foreground">
                フォームが送信中かどうかを示すboolean値
              </p>
            </div>
            <div>
              <h4 className="font-semibold">data</h4>
              <p className="text-sm text-muted-foreground">
                送信されたFormDataオブジェクト（送信中のみ利用可能）
              </p>
            </div>
            <div>
              <h4 className="font-semibold">method</h4>
              <p className="text-sm text-muted-foreground">
                HTTPメソッド（GET、POSTなど）
              </p>
            </div>
            <div>
              <h4 className="font-semibold">action</h4>
              <p className="text-sm text-muted-foreground">
                フォームのaction属性の値（URLまたは関数名）
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>コード例</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`// 送信ボタンコンポーネント
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '送信中...' : '送信'}
    </button>
  );
}

// プログレスインジケーター
function ProgressIndicator() {
  const { pending, data } = useFormStatus();

  if (!pending) return null;

  return (
    <div className="progress-bar">
      <p>送信中: {data?.get('email')}</p>
    </div>
  );
}

// 親フォーム
function ContactForm() {
  return (
    <form action={submitForm}>
      <input name="email" type="email" />
      <textarea name="message" />
      <SubmitButton />
      <ProgressIndicator />
    </form>
  );
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
